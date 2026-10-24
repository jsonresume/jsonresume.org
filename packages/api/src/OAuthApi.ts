import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from 'effect/http-api';
import { Authentication } from './Authentication';

/** RFC 6749 errors: `error` is a code such as invalid_grant. */
export class OAuthError extends Schema.TaggedError<OAuthError>()(
  'OAuthError',
  { error: Schema.String, error_description: Schema.String },
  { httpApiStatus: 400 }
) {}

const Tokens = Schema.Struct({
  access_token: Schema.String,
  token_type: Schema.String,
  expires_in: Schema.Number,
  refresh_token: Schema.String,
  scope: Schema.String,
});

/**
 * OAuth 2.1 for MCP clients (claude.ai, ChatGPT and other agents): dynamic
 * registration (RFC 7591) and the token endpoint. Clients call these
 * directly, with no session. Discovery documents are at /.well-known.
 */
export class OAuthApi extends HttpApiGroup.make('oauth')
  .add(
    HttpApiEndpoint.post('register', '/register', {
      payload: Schema.Struct({
        client_name: Schema.optional(Schema.String),
        redirect_uris: Schema.Array(Schema.String),
      }),
      success: Schema.Struct({
        client_id: Schema.String,
        client_name: Schema.String,
        redirect_uris: Schema.Array(Schema.String),
        token_endpoint_auth_method: Schema.Literal('none'),
        grant_types: Schema.Array(Schema.String),
        response_types: Schema.Array(Schema.String),
      }).pipe(HttpApiSchema.status(201)),
      error: OAuthError,
    }),
    HttpApiEndpoint.post('token', '/token', {
      payload: Schema.Struct({
        grant_type: Schema.String,
        code: Schema.optional(Schema.String),
        redirect_uri: Schema.optional(Schema.String),
        client_id: Schema.optional(Schema.String),
        code_verifier: Schema.optional(Schema.String),
        refresh_token: Schema.optional(Schema.String),
      }).pipe(HttpApiSchema.asFormUrlEncoded()),
      success: Tokens,
      error: OAuthError,
    }),
    /** For the consent page: who is asking, if the redirect is theirs. */
    HttpApiEndpoint.get('client', '/client', {
      query: { client_id: Schema.String, redirect_uri: Schema.String },
      success: Schema.Struct({
        name: Schema.String,
        redirectHost: Schema.String,
      }),
      error: OAuthError,
    })
  )
  .prefix('/oauth') {}

export const Connection = Schema.Struct({
  clientId: Schema.String,
  name: Schema.String,
  connectedAt: Schema.String,
  lastUsedAt: Schema.NullOr(Schema.String),
});
export type Connection = typeof Connection.Type;

/** The signed-in user approving a client, and the apps they've connected. */
export class OAuthConsentApi extends HttpApiGroup.make('oauthConsent')
  .add(
    HttpApiEndpoint.post('decide', '/decide', {
      payload: Schema.Struct({
        client_id: Schema.String,
        redirect_uri: Schema.String,
        code_challenge: Schema.String,
        state: Schema.optional(Schema.String),
        approve: Schema.Boolean,
      }),
      /** Where to send the browser: the client, with a code or an error. */
      success: Schema.Struct({ redirect: Schema.String }),
      error: OAuthError,
    }),
    HttpApiEndpoint.get('connections', '/connections', {
      success: Schema.Array(Connection),
    }),
    HttpApiEndpoint.delete('disconnect', '/connections/:clientId', {
      params: { clientId: Schema.String },
    })
  )
  .middleware(Authentication)
  .prefix('/oauth') {}
