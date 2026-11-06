import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from 'effect/http-api';
import { Authentication } from './Authentication';

/** RFC 6749 errors: `error` is a code such as invalid_grant. */
export class OAuthError extends Schema.TaggedError<OAuthError>()(
  'OAuthError',
  { error: Schema.String, error_description: Schema.String },
  { httpApiStatus: 400 }
) {}

/** Who is asking on the consent page. */
export const ConsentClient = Schema.Struct({
  name: Schema.String,
  redirectHost: Schema.String,
  homepage: Schema.NullOr(Schema.String),
  /** The username that registered it; null when it registered itself. */
  owner: Schema.NullOr(Schema.String),
  /** Runs on a server with a secret, so PKCE is optional. */
  confidential: Schema.Boolean,
  scopes: Schema.Array(Schema.String),
});
export type ConsentClient = typeof ConsentClient.Type;

const Tokens = Schema.Struct({
  access_token: Schema.String,
  token_type: Schema.String,
  expires_in: Schema.Number,
  refresh_token: Schema.String,
  scope: Schema.String,
  /** OpenID Connect, with the openid scope: a JWT signed with a key from /jwks. */
  id_token: Schema.optional(Schema.String),
});

/** RFC 7517: the public keys that sign ID tokens. */
const Jwks = Schema.Struct({
  keys: Schema.Array(Schema.Record(Schema.String, Schema.Unknown)),
});

/**
 * OAuth 2.1 for MCP clients (claude.ai, ChatGPT and other agents) and apps
 * people register (HR tools): dynamic registration (RFC 7591), tokens,
 * revocation, ID-token keys. Clients call these directly, with no session; apps with a
 * secret send it as Basic auth or client_secret. Discovery is at /.well-known.
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
        client_secret: Schema.optional(Schema.String),
        code_verifier: Schema.optional(Schema.String),
        refresh_token: Schema.optional(Schema.String),
      }).pipe(HttpApiSchema.asFormUrlEncoded()),
      success: Tokens,
      error: OAuthError,
    }),
    /** RFC 7009: the client gives up a token it holds. */
    HttpApiEndpoint.post('revoke', '/revoke', {
      payload: Schema.Struct({
        token: Schema.String,
        token_type_hint: Schema.optional(Schema.String),
        client_id: Schema.optional(Schema.String),
        client_secret: Schema.optional(Schema.String),
      }).pipe(HttpApiSchema.asFormUrlEncoded()),
      success: Schema.Struct({}),
      error: OAuthError,
    }),
    HttpApiEndpoint.get('jwks', '/jwks', { success: Jwks }),
    /** For the consent page: who is asking, for what, if the redirect is theirs. */
    HttpApiEndpoint.get('client', '/client', {
      query: {
        client_id: Schema.String,
        redirect_uri: Schema.String,
        scope: Schema.optional(Schema.String),
      },
      success: ConsentClient,
      error: OAuthError,
    })
  )
  .prefix('/oauth') {}

export const Connection = Schema.Struct({
  clientId: Schema.String,
  name: Schema.String,
  scopes: Schema.Array(Schema.String),
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
        code_challenge: Schema.optional(Schema.String),
        scope: Schema.optional(Schema.String),
        state: Schema.optional(Schema.String),
        /** OpenID Connect: returned in the ID token. */
        nonce: Schema.optional(Schema.String),
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
