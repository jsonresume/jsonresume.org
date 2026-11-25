/**
 * The GitHub side of the collector: every public repository of the
 * jsonresume org, and in each its commit authors, the issues and pull
 * requests people opened, and their comments.
 */
import { Effect, Redacted, Schedule, Schema } from 'effect';
import { HttpClient, HttpClientRequest } from 'effect/http';
import type { Found, Who } from '../src/merge.ts';

export const ORG = 'jsonresume';

const User = Schema.Struct({
  login: Schema.String,
  id: Schema.Number,
  type: Schema.String,
});
const Repo = Schema.Struct({
  name: Schema.String,
  fork: Schema.Boolean,
  private: Schema.Boolean,
});
const Author = Schema.Struct({
  type: Schema.String,
  login: Schema.optional(Schema.String),
  id: Schema.optional(Schema.Number),
  name: Schema.optional(Schema.String),
  email: Schema.optional(Schema.String),
  contributions: Schema.Number,
});
const Issue = Schema.Struct({
  user: Schema.NullOr(User),
  pull_request: Schema.optional(Schema.Unknown),
});
const Comment = Schema.Struct({ user: Schema.NullOr(User) });
const Commit = Schema.Struct({ html_url: Schema.String });

interface Page {
  readonly body: unknown;
  readonly next: string | undefined;
}

const nextLink = (link: string | undefined) =>
  link?.match(/<([^>]+)>;\s*rel="next"/)?.[1];

export const makeGithub = (
  client: HttpClient.HttpClient,
  token: Redacted.Redacted
) => {
  const page = (url: string) =>
    client
      .execute(
        HttpClientRequest.get(url).pipe(
          HttpClientRequest.bearerToken(Redacted.value(token)),
          HttpClientRequest.setHeaders({
            accept: 'application/vnd.github+json',
            'user-agent': 'jsonresume.org contributors',
          })
        )
      )
      .pipe(
        Effect.flatMap((r) =>
          r.status === 200
            ? Effect.map(
                r.json,
                (body): Page => ({
                  body,
                  next: nextLink(r.headers['link']),
                })
              )
            : r.status === 204 || r.status === 404
            ? Effect.succeed<Page>({ body: [], next: undefined })
            : Effect.fail(new Error(`GitHub answered ${r.status} for ${url}`))
        ),
        // GitHub sometimes closes the connection mid-page: ask again.
        Effect.retry({ schedule: Schedule.exponential('2 seconds'), times: 4 })
      );

  /** Every page of a list endpoint, decoded. */
  const all = <S extends Schema.Top>(path: string, item: S) =>
    Effect.gen(function* () {
      const decode = Schema.decodeUnknownEffect(Schema.Array(item));
      const out: Array<S['Type']> = [];
      let url: string | undefined = `https://api.github.com${path}`;
      while (url) {
        const got: Page = yield* page(url);
        const { body, next } = got;
        out.push(...(yield* decode(body)));
        url = next;
      }
      return out;
    });

  const tally = (
    users: ReadonlyArray<typeof User.Type | null>,
    kind: Found['kind'],
    where: string
  ): Array<Found> => {
    const counts = new Map<string, { who: Who; count: number }>();
    for (const u of users) {
      if (!u || u.type !== 'User') continue;
      const at = counts.get(u.login) ?? {
        who: { github: u.login, id: u.id },
        count: 0,
      };
      at.count += 1;
      counts.set(u.login, at);
    }
    return [...counts.values()].map(({ who, count }) => ({
      who,
      kind,
      where,
      count,
    }));
  };

  const repos = all(`/orgs/${ORG}/repos?per_page=100&type=public`, Repo).pipe(
    Effect.map((list) =>
      list.filter((r) => !r.fork && !r.private).map((r) => r.name)
    )
  );

  /** Commit authors; ones without a GitHub account link their latest commit. */
  const code = (repo: string) =>
    Effect.gen(function* () {
      const authors = yield* all(
        `/repos/${ORG}/${repo}/contributors?per_page=100&anon=1`,
        Author
      );
      const out: Array<Found> = [];
      for (const a of authors) {
        if (a.type === 'User' && a.login) {
          out.push({
            who: { github: a.login, ...(a.id ? { id: a.id } : {}) },
            kind: 'code',
            where: repo,
            count: a.contributions,
          });
        } else if (a.type === 'Anonymous' && a.name && a.email) {
          const q = `author=${encodeURIComponent(a.email)}&per_page=1`;
          const { body } = yield* page(
            `https://api.github.com/repos/${ORG}/${repo}/commits?${q}`
          );
          const [commit] = yield* Schema.decodeUnknownEffect(
            Schema.Array(Commit)
          )(body);
          out.push({
            // Some commits name the author by their email: keep the name part.
            who: { name: a.name.split('@')[0] ?? a.name },
            kind: 'code',
            where: repo,
            count: a.contributions,
            ...(commit ? { href: commit.html_url } : {}),
          });
        }
      }
      return out;
    });

  const discussion = (repo: string) =>
    Effect.gen(function* () {
      const base = `/repos/${ORG}/${repo}`;
      const issues = yield* all(`${base}/issues?state=all&per_page=100`, Issue);
      const comments = yield* all(
        `${base}/issues/comments?per_page=100`,
        Comment
      );
      const reviews = yield* all(
        `${base}/pulls/comments?per_page=100`,
        Comment
      );
      const opened = (pulls: boolean) =>
        issues
          .filter((i) => (i.pull_request !== undefined) === pulls)
          .map((i) => i.user);
      return [
        ...tally(opened(true), 'pulls', repo),
        ...tally(opened(false), 'issues', repo),
        ...tally(
          comments.map((c) => c.user),
          'comments',
          repo
        ),
        ...tally(
          reviews.map((c) => c.user),
          'reviews',
          repo
        ),
      ];
    });

  return { all, page, repos, code, discussion };
};

export type Github = ReturnType<typeof makeGithub>;
