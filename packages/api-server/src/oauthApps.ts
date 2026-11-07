import { OAuth, type OAuthAppRecord, type OAuthFailure } from '@repo/accounts';
import { CurrentUser, JsonResumeApi, OAuthError } from '@repo/api';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { track } from '@repo/posthog';

const toError = (e: OAuthFailure) =>
  new OAuthError({ error: e.error, error_description: e.description });

export const toOAuthApp = (a: OAuthAppRecord) => ({
  id: a.id,
  name: a.name,
  homepage: a.homepage,
  redirectUris: a.redirectUris,
  createdAt: a.createdAt.toISOString(),
  users: a.users,
  listed: a.listed,
  description: a.description,
});

/** The signed-in user's OAuth apps: list, register, edit, new secret, delete. */
export const OAuthAppsHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'oauthApps',
  (handlers) =>
    Effect.gen(function* () {
      const oauth = yield* OAuth;
      const owner = Effect.map(CurrentUser, (u) => u.id);
      return handlers.handleAll({
        list: () =>
          Effect.flatMap(owner, oauth.apps).pipe(
            Effect.map((apps) => apps.map(toOAuthApp))
          ),
        create: ({ payload }) =>
          Effect.flatMap(owner, (id) =>
            oauth
              .createApp(id, payload)
              .pipe(Effect.tap(() => track(id, 'oauth_app_created')))
          ).pipe(
            Effect.map(({ app, secret }) => ({
              app: toOAuthApp(app),
              clientSecret: secret,
            })),
            Effect.mapError(toError)
          ),
        update: ({ params, payload }) =>
          Effect.flatMap(owner, (id) =>
            oauth.updateApp(id, params.id, payload)
          ).pipe(Effect.map(toOAuthApp), Effect.mapError(toError)),
        newSecret: ({ params }) =>
          Effect.flatMap(owner, (id) => oauth.rotateSecret(id, params.id)).pipe(
            Effect.map((clientSecret) => ({ clientSecret })),
            Effect.mapError(toError)
          ),
        setListing: ({ params, payload }) =>
          Effect.gen(function* () {
            const id = yield* owner;
            yield* oauth
              .setListing(id, params.id, payload)
              .pipe(Effect.mapError(toError));
            const app = (yield* oauth.apps(id)).find((a) => a.id === params.id);
            if (!app)
              return yield* new OAuthError({
                error: 'invalid_client',
                error_description: 'No such app',
              });
            return toOAuthApp(app);
          }),
        delete: ({ params }) =>
          Effect.flatMap(owner, (id) => oauth.deleteApp(id, params.id)),
      });
    })
);

/** GET /api/apps: the public apps directory. */
export const AppsDirectoryHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'appsDirectory',
  (handlers) =>
    Effect.gen(function* () {
      const oauth = yield* OAuth;
      return handlers.handle('list', () => oauth.directory());
    })
);
