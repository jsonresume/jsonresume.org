import { Context, Effect, Layer, Schema } from 'effect';
import { FetchHttpClient, HttpClient } from 'effect/http';
import {
  ProfileNotFound,
  ResumeNotJson,
  type GithubUnavailable,
} from './errors';
import {
  githubCredentials,
  makeGithubApi,
  unavailable,
  type GithubCredentials,
} from './githubApi';

const GistFile = Schema.Struct({
  raw_url: Schema.String,
  content: Schema.optionalKey(Schema.String),
  truncated: Schema.optionalKey(Schema.Boolean),
});
const Gist = Schema.Struct({
  id: Schema.String,
  owner: Schema.Struct({ id: Schema.Number, login: Schema.String }),
  files: Schema.Record(Schema.String, GistFile),
});
type Gist = typeof Gist.Type;
const decodeGists = Schema.decodeUnknownEffect(Schema.Array(Gist));
const decodeGist = Schema.decodeUnknownEffect(Gist);
const decodeJson = Schema.decodeUnknownEffect(
  Schema.fromJsonString(Schema.Unknown)
);

/** A resume read from a gist, with what identifies where it came from. */
export interface GistResume {
  gistId: string;
  githubId: number;
  githubLogin: string;
  resume: unknown;
}

type Lookup = Effect.Effect<
  GistResume,
  ProfileNotFound | ResumeNotJson | GithubUnavailable
>;

const PAGE = 100;
const MAX_PAGES = 10;

/** Reads resumes from GitHub gists. */
export class GithubGists extends Context.Service<
  GithubGists,
  {
    /** Find `file` among the user's gists. */
    find(login: string, file: string): Lookup;
    /** Read `file` from a gist already known; not found if it moved or went. */
    read(login: string, gistId: string, file: string): Lookup;
  }
>()('@repo/profiles/GithubGists') {
  static readonly make = (credentials: GithubCredentials) =>
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      const api = makeGithubApi(client, credentials);
      const decodeError = (e: { message: string }) => unavailable(e.message);

      const content = Effect.fn('GithubGists.content')(function* (
        gist: Gist,
        login: string,
        file: string
      ) {
        const entry = gist.files[file];
        if (!entry) {
          return yield* new ProfileNotFound({
            username: login,
            reason: 'no-gist',
            file,
          });
        }
        // The API inlines files up to 1 MB; bigger ones come from raw_url.
        const text =
          entry.content !== undefined && entry.truncated !== true
            ? entry.content
            : yield* client.get(entry.raw_url).pipe(
                Effect.flatMap((r) => r.text),
                Effect.mapError(decodeError)
              );
        const resume = yield* decodeJson(text).pipe(
          Effect.mapError(
            (e) =>
              new ResumeNotJson({ username: login, file, message: e.message })
          )
        );
        return {
          gistId: gist.id,
          githubId: gist.owner.id,
          githubLogin: gist.owner.login,
          resume,
        } satisfies GistResume;
      });

      const find = Effect.fn('GithubGists.find')(function* (
        login: string,
        file: string
      ) {
        for (let page = 1; page <= MAX_PAGES; page++) {
          const body = yield* api(
            `/users/${login}/gists?per_page=${PAGE}&page=${page}`
          );
          if (body === undefined) {
            return yield* new ProfileNotFound({
              username: login,
              reason: 'no-user',
              file,
            });
          }
          const gists = yield* decodeGists(body).pipe(
            Effect.mapError(decodeError)
          );
          const gist = gists.find((g) => file in g.files);
          // Listings leave file contents out; one more request reads it.
          if (gist) return yield* read(login, gist.id, file);
          if (gists.length < PAGE) break;
        }
        return yield* new ProfileNotFound({
          username: login,
          reason: 'no-gist',
          file,
        });
      });

      const read = Effect.fn('GithubGists.read')(function* (
        login: string,
        gistId: string,
        file: string
      ) {
        const body = yield* api(`/gists/${gistId}`);
        const gist =
          body === undefined
            ? undefined
            : yield* decodeGist(body).pipe(Effect.mapError(decodeError));
        // Gone, lost the file, or the login now belongs to someone else.
        if (
          !gist ||
          gist.owner.login.toLowerCase() !== login.toLowerCase() ||
          !(file in gist.files)
        ) {
          return yield* new ProfileNotFound({
            username: login,
            reason: 'no-gist',
            file,
          });
        }
        return yield* content(gist, login, file);
      });

      return GithubGists.of({ find, read });
    });

  /** Credentials from the environment; GitHub over fetch. */
  static readonly layer = Layer.effect(
    GithubGists,
    Effect.gen(function* () {
      return yield* GithubGists.make(yield* githubCredentials);
    })
  ).pipe(Layer.provide(FetchHttpClient.layer));
}
