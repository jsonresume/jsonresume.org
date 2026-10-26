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
});
export type OAuthApp = typeof OAuthApp.Type;

export const OAuthAppInput = Schema.Struct({
  name: Schema.String,
  homepage: Schema.optional(Schema.String),
  redirectUris: Schema.Array(Schema.String),
});
export type OAuthAppInput = typeof OAuthAppInput.Type;

const id = { id: Schema.String };

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
    HttpApiEndpoint.delete('delete', '/:id', { params: id })
  )
  .middleware(Authentication)
  .prefix('/oauth/apps') {}
