import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';
import { OAuthError } from './OAuthApi';

export const OAuthApp = Schema.Struct({
  /** The client_id. */
  id: Schema.String,
  name: Schema.String,
  homepage: Schema.NullOr(Schema.String),
  redirectUris: Schema.Array(Schema.String),
  createdAt: Schema.String,
  /** People with it connected now. */
  users: Schema.Number,
  /** In the public apps directory (/apps), with this line about it. */
  listed: Schema.Boolean,
  description: Schema.NullOr(Schema.String),
});
export type OAuthApp = typeof OAuthApp.Type;

export const OAuthAppInput = Schema.Struct({
  name: Schema.String,
  homepage: Schema.optional(Schema.String),
  redirectUris: Schema.Array(Schema.String),
});
export type OAuthAppInput = typeof OAuthAppInput.Type;

const id = { id: Schema.String };

/** An app's webhook: resume.updated is POSTed here, signed with the secret. */
export const WebhookSettings = Schema.Struct({
  url: Schema.String,
  secret: Schema.String,
});

/**
 * The signed-in user's OAuth apps, for "Sign in with JSON Resume" in their
 * own product. The secret is in the create and new-secret responses only.
 */
export class OAuthAppsApi extends HttpApiGroup.make('oauthApps')
  .add(
    HttpApiEndpoint.get('list', '/', { success: Schema.Array(OAuthApp) }),
    HttpApiEndpoint.post('create', '/', {
      payload: OAuthAppInput,
      success: Schema.Struct({ app: OAuthApp, clientSecret: Schema.String }),
      error: OAuthError,
    }),
    HttpApiEndpoint.put('update', '/:id', {
      params: id,
      payload: OAuthAppInput,
      success: OAuthApp,
      error: OAuthError,
    }),
    HttpApiEndpoint.post('newSecret', '/:id/secret', {
      params: id,
      success: Schema.Struct({ clientSecret: Schema.String }),
      error: OAuthError,
    }),
    /** List it in the apps directory (needs a homepage and a description). */
    HttpApiEndpoint.put('setListing', '/:id/listing', {
      params: id,
      payload: Schema.Struct({
        listed: Schema.Boolean,
        description: Schema.String,
      }),
      success: OAuthApp,
      error: OAuthError,
    }),
    /** Where the app is told its readers' resumes changed, and its signing secret. */
    HttpApiEndpoint.get('webhook', '/:id/webhook', {
      params: id,
      success: Schema.NullOr(WebhookSettings),
    }),
    /** Set the URL (https), or null to stop; the secret stays once made. */
    HttpApiEndpoint.put('setWebhook', '/:id/webhook', {
      params: id,
      payload: Schema.Struct({ url: Schema.NullOr(Schema.String) }),
      success: Schema.NullOr(WebhookSettings),
      error: OAuthError,
    }),
    HttpApiEndpoint.delete('delete', '/:id', { params: id })
  )
  .middleware(Authentication)
  .prefix('/oauth/apps') {}

/** An app in the public directory. */
export const AppListing = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  description: Schema.String,
  homepage: Schema.String,
  /** People who have connected it. */
  users: Schema.Number,
});
export type AppListing = typeof AppListing.Type;

/** /apps: apps built on JSON Resume accounts, listed by their makers. */
export class AppsDirectoryApi extends HttpApiGroup.make('appsDirectory').add(
  HttpApiEndpoint.get('list', '/apps', { success: Schema.Array(AppListing) })
) {}
