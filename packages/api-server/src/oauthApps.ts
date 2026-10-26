import { OAuth, type OAuthAppRecord, type OAuthFailure } from '@repo/accounts';
import { CurrentUser, JsonResumeApi, OAuthError } from '@repo/api';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

const toError = (e: OAuthFailure) =>
  new OAuthError({ error: e.error, error_description: e.description });

export const toOAuthApp = (a: OAuthAppRecord) => ({
  id: a.id,
  name: a.name,
  homepage: a.homepage,
  redirectUris: a.redirectUris,
  createdAt: a.createdAt.toISOString(),
  users: a.users,
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
          Effect.flatMap(owner, (id) => oauth.createApp(id, payload)).pipe(
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
        delete: ({ params }) =>
          Effect.flatMap(owner, (id) => oauth.deleteApp(id, params.id)),
      });
    })
);
