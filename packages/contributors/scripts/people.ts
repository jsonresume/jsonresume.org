/**
 * Credits from the site's own lists (the team and the projects directory),
 * and everyone's display name and avatar id from GitHub's GraphQL API.
 */
import { readFile } from 'node:fs/promises';
import { Effect, Redacted, Schema } from 'effect';
import { HttpClient, HttpClientRequest } from 'effect/http';
import type { Found, Profile } from '../src/merge.ts';
import { ORG } from './github.ts';
import { ownerOf } from './npm.ts';

const content = (file: string) =>
  new URL(`../../content/src/data/${file}`, import.meta.url);

const Member = Schema.Struct({ github: Schema.String });
const Team = Schema.Struct({
  coreTeam: Schema.Array(Member),
  standardsCommittee: Schema.Array(Member),
});
const Project = Schema.Struct({ name: Schema.String, link: Schema.String });

const json = (file: string) =>
  Effect.tryPromise(() => readFile(content(file), 'utf8')).pipe(
    Effect.map((text): unknown => JSON.parse(text))
  );

export const siteCredits = Effect.gen(function* () {
  const team = yield* Schema.decodeUnknownEffect(Team)(
    yield* json('team.json')
  );
  const projects = yield* Schema.decodeUnknownEffect(Schema.Array(Project))(
    yield* json('projects.json')
  );
  const found: Array<Found> = [
    ...team.coreTeam.map(
      (m): Found => ({
        who: { github: m.github },
        kind: 'team',
        where: 'Core team',
        count: 1,
      })
    ),
    ...team.standardsCommittee.map(
      (m): Found => ({
        who: { github: m.github },
        kind: 'team',
        where: 'Standards committee',
        count: 1,
      })
    ),
  ];
  for (const p of projects) {
    const owner = ownerOf(p.link);
    if (!owner || owner.toLowerCase() === ORG) continue;
    found.push({
      who: { github: owner },
      kind: 'projects',
      where: p.name,
      count: 1,
      href: p.link,
    });
  }
  return found;
});

const Owner = Schema.NullOr(
  Schema.Struct({
    login: Schema.String,
    databaseId: Schema.NullOr(Schema.Number),
    name: Schema.optional(Schema.NullOr(Schema.String)),
  })
);
const Answer = Schema.Struct({
  data: Schema.Record(Schema.String, Owner),
});

/** Names and ids for logins, 100 to a query. Unknown logins are left out. */
export const profiles = (
  client: HttpClient.HttpClient,
  token: Redacted.Redacted,
  logins: ReadonlyArray<string>
) =>
  Effect.gen(function* () {
    const out = new Map<string, Profile>();
    const decode = Schema.decodeUnknownEffect(Answer);
    for (let i = 0; i < logins.length; i += 100) {
      const batch = logins.slice(i, i + 100);
      const fields = batch
        .map(
          (login, n) =>
            `u${n}: repositoryOwner(login: ${JSON.stringify(
              login
            )}) { login ... on User { databaseId name } ... on Organization { databaseId name } }`
        )
        .join('\n');
      const request = HttpClientRequest.post(
        'https://api.github.com/graphql'
      ).pipe(
        HttpClientRequest.bearerToken(Redacted.value(token)),
        HttpClientRequest.setHeaders({
          'user-agent': 'jsonresume.org contributors',
        }),
        HttpClientRequest.bodyJsonUnsafe({ query: `{ ${fields} }` })
      );
      const response = yield* client.execute(request);
      const answer = yield* decode(yield* response.json);
      for (const owner of Object.values(answer.data)) {
        if (!owner) continue;
        out.set(owner.login.toLowerCase(), {
          login: owner.login,
          id: owner.databaseId ?? undefined,
          name: owner.name?.trim() || undefined,
        });
      }
    }
    return out;
  });
