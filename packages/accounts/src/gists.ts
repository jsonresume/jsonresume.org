import { Context, Effect, Layer, Schema } from 'effect';
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from 'effect/http';

export const RESUME_FILE = 'resume.json';

/** GitHub refused (no gist permission, or the gist isn't theirs), or is down. */
export class GistAccess extends Schema.TaggedError<GistAccess>()('GistAccess', {
  reason: Schema.Literals(['permission', 'missing', 'unavailable']),
}) {}

const Gist = Schema.Struct({
  id: Schema.String,
  owner: Schema.Struct({ id: Schema.Number }),
  files: Schema.Record(
    Schema.String,
    Schema.Struct({ content: Schema.optionalKey(Schema.String) })
  ),
});

/**
 * A person's resume.json gist, read and written with their own token, so
 * the gist stays the source of truth when they edit here.
 */
export class GistFiles extends Context.Service<
  GistFiles,
  {
    read(
      token: string,
      gistId: string
    ): Effect.Effect<string | undefined, GistAccess>;
    write(
      token: string,
      gistId: string,
      content: string
    ): Effect.Effect<{ gistId: string; ownerId: number }, GistAccess>;
    create(
      token: string,
      content: string
    ): Effect.Effect<{ gistId: string; ownerId: number }, GistAccess>;
  }
>()('@repo/accounts/GistFiles') {
  static readonly layer = Layer.effect(
    GistFiles,
    Effect.gen(function* () {
      const client = yield* HttpClient.HttpClient;
      const call = (
        request: HttpClientRequest.HttpClientRequest,
        token: string
      ) =>
        request.pipe(
          HttpClientRequest.bearerToken(token),
          HttpClientRequest.setHeaders({
            accept: 'application/vnd.github+json',
            'user-agent': 'jsonresume.org',
          }),
          client.execute,
          Effect.mapError(() => new GistAccess({ reason: 'unavailable' })),
          Effect.flatMap((response) => {
            if (response.status === 404)
              return Effect.fail(new GistAccess({ reason: 'missing' }));
            if (response.status === 401 || response.status === 403) {
              return Effect.fail(new GistAccess({ reason: 'permission' }));
            }
            if (response.status >= 300)
              return Effect.fail(new GistAccess({ reason: 'unavailable' }));
            return HttpClientResponse.schemaBodyJson(Gist)(response).pipe(
              Effect.mapError(() => new GistAccess({ reason: 'unavailable' }))
            );
          })
        );
      const saved = (gist: typeof Gist.Type) => ({
        gistId: gist.id,
        ownerId: gist.owner.id,
      });
      const files = (content: string) => ({
        files: { [RESUME_FILE]: { content } },
      });

      return GistFiles.of({
        read: (token, gistId) =>
          call(
            HttpClientRequest.get(`https://api.github.com/gists/${gistId}`),
            token
          ).pipe(Effect.map((gist) => gist.files[RESUME_FILE]?.content)),
        write: (token, gistId, content) =>
          call(
            HttpClientRequest.patch(
              `https://api.github.com/gists/${gistId}`
            ).pipe(HttpClientRequest.bodyJsonUnsafe(files(content))),
            token
          ).pipe(Effect.map(saved)),
        create: (token, content) =>
          call(
            HttpClientRequest.post('https://api.github.com/gists').pipe(
              HttpClientRequest.bodyJsonUnsafe({
                description:
                  'My resume, in JSON Resume format (jsonresume.org)',
                public: true,
                ...files(content),
              })
            ),
            token
          ).pipe(Effect.map(saved)),
      });
    })
  ).pipe(Layer.provide(FetchHttpClient.layer));
}
