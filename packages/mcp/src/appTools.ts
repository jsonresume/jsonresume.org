import { OAuth, type OAuthAppRecord, type OAuthFailure } from '@repo/accounts';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';
import { optional } from './params';

const ClientId = Schema.Struct({
  client_id: Schema.String.annotate({ description: 'The app’s client_id' }),
});

const OAuthApp = Schema.Struct({
  client_id: Schema.String,
  name: Schema.String,
  homepage: Schema.NullOr(Schema.String),
  redirect_uris: Schema.Array(Schema.String),
  created_at: Schema.String,
  users: Schema.Number,
});

const toApp = (a: OAuthAppRecord) => ({
  client_id: a.id,
  name: a.name,
  homepage: a.homepage,
  redirect_uris: a.redirectUris,
  created_at: a.createdAt.toISOString(),
  users: a.users,
});

const toToolError = (e: OAuthFailure) => failWith(e.description);

export const AppToolkit = Toolkit.make(
  Tool.make('list_connected_apps', {
    description: describe('list_connected_apps'),
    success: Schema.Struct({
      apps: Schema.Array(
        Schema.Struct({
          client_id: Schema.String,
          name: Schema.String,
          scopes: Schema.Array(Schema.String),
          connected_at: Schema.String,
          last_used_at: Schema.NullOr(Schema.String),
        })
      ),
    }),
    ...failing,
  }).annotateMerge(hints('list_connected_apps')),
  Tool.make('disconnect_app', {
    description: describe('disconnect_app'),
    parameters: ClientId,
    success: Schema.Struct({ disconnected: Schema.Boolean }),
    ...failing,
  }).annotateMerge(hints('disconnect_app', true)),
  Tool.make('list_oauth_apps', {
    description: describe('list_oauth_apps'),
    success: Schema.Struct({ apps: Schema.Array(OAuthApp) }),
    ...failing,
  }).annotateMerge(hints('list_oauth_apps')),
  Tool.make('create_oauth_app', {
    description: describe('create_oauth_app'),
    parameters: Schema.Struct({
      name: Schema.String.annotate({
        description: 'Shown on the consent page',
      }),
      homepage: optional(Schema.String, 'The product’s https URL'),
      redirect_uris: Schema.Array(Schema.String).annotate({
        description:
          'Where people come back to after allowing it: https, http://localhost, or an app scheme',
      }),
    }),
    success: Schema.Struct({ app: OAuthApp, client_secret: Schema.String }),
    ...failing,
  }).annotateMerge(hints('create_oauth_app')),
  Tool.make('new_oauth_app_secret', {
    description: describe('new_oauth_app_secret'),
    parameters: ClientId,
    success: Schema.Struct({ client_secret: Schema.String }),
    ...failing,
  }).annotateMerge(hints('new_oauth_app_secret', true)),
  Tool.make('delete_oauth_app', {
    description: describe('delete_oauth_app'),
    parameters: ClientId,
    success: Schema.Struct({ deleted: Schema.Boolean }),
    ...failing,
  }).annotateMerge(hints('delete_oauth_app', true))
);

/** Needs OAuth. */
export const AppHandlers = AppToolkit.toLayer(
  Effect.gen(function* () {
    const oauth = yield* OAuth;
    return {
      list_connected_apps: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          const list = yield* oauth.connections(user.id);
          return {
            apps: list.map((c) => ({
              client_id: c.client_id,
              name: c.name,
              scopes: [...new Set(c.scopes.split(' '))],
              connected_at: c.created_at.toISOString(),
              last_used_at: c.last_used_at?.toISOString() ?? null,
            })),
          };
        }),
      disconnect_app: ({ client_id }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          yield* oauth.disconnect(user.id, client_id);
          return { disconnected: true };
        }),
      list_oauth_apps: () =>
        Effect.gen(function* () {
          const user = yield* caller;
          return { apps: (yield* oauth.apps(user.id)).map(toApp) };
        }),
      create_oauth_app: ({ name, homepage, redirect_uris }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const made = yield* oauth
            .createApp(user.id, { name, homepage, redirectUris: redirect_uris })
            .pipe(Effect.mapError(toToolError));
          return { app: toApp(made.app), client_secret: made.secret };
        }),
      new_oauth_app_secret: ({ client_id }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const secret = yield* oauth
            .rotateSecret(user.id, client_id)
            .pipe(Effect.mapError(toToolError));
          return { client_secret: secret };
        }),
      delete_oauth_app: ({ client_id }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          yield* oauth.deleteApp(user.id, client_id);
          return { deleted: true };
        }),
    };
  })
);
