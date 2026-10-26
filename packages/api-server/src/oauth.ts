import { OAuth, type OAuthFailure } from '@repo/accounts';
import { CurrentUser, JsonResumeApi, OAuthError } from '@repo/api';
import { Effect } from 'effect';
import { HttpServerRequest } from 'effect/http';
import { HttpApiBuilder } from 'effect/http-api';

const toError = (e: OAuthFailure) =>
  new OAuthError({ error: e.error, error_description: e.description });

const missing = (what: string) =>
  new OAuthError({
    error: 'invalid_request',
    error_description: `${what} is required`,
  });

/** The URI with these query parameters added (OAuth redirects). */
const withQuery = (uri: string, params: Record<string, string | undefined>) => {
  const url = new URL(uri);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  return url.toString();
};

/**
 * The client's credentials: client_secret_basic (RFC 6749 2.3.1, each part
 * form-encoded) when the request has it, else what the form sent.
 */
const credentials = (form: { client_id?: string; client_secret?: string }) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const basic = /^Basic\s+(\S+)$/i.exec(request.headers.authorization ?? '');
    if (basic?.[1]) {
      const pair = Buffer.from(basic[1], 'base64').toString('utf8');
      const colon = pair.indexOf(':');
      const part = (s: string) => decodeURIComponent(s.replace(/\+/g, ' '));
      if (colon > 0) {
        return {
          clientId: part(pair.slice(0, colon)),
          secret: part(pair.slice(colon + 1)),
        };
      }
    }
    return { clientId: form.client_id, secret: form.client_secret };
  });

/** Registration, tokens and revocation, called by clients themselves. */
export const OAuthHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'oauth',
  (handlers) =>
    Effect.gen(function* () {
      const oauth = yield* OAuth;
      return handlers.handleAll({
        register: ({ payload }) =>
          oauth
            .register({
              name: payload.client_name ?? '',
              redirectUris: payload.redirect_uris,
            })
            .pipe(
              Effect.map((c) => ({
                client_id: c.id,
                client_name: c.name,
                redirect_uris: c.redirectUris,
                token_endpoint_auth_method: 'none' as const,
                grant_types: ['authorization_code', 'refresh_token'],
                response_types: ['code'],
              })),
              Effect.mapError(toError)
            ),
        token: ({ payload: p }) =>
          Effect.gen(function* () {
            const { clientId, secret } = yield* credentials(p);
            if (!clientId) return yield* missing('client_id');
            if (p.grant_type === 'refresh_token') {
              if (!p.refresh_token) return yield* missing('refresh_token');
              return yield* oauth.refresh(p.refresh_token, clientId, secret);
            }
            if (p.grant_type !== 'authorization_code') {
              return yield* new OAuthError({
                error: 'unsupported_grant_type',
                error_description: 'Use authorization_code or refresh_token',
              });
            }
            if (!p.code) return yield* missing('code');
            return yield* oauth.exchangeCode({
              code: p.code,
              clientId,
              secret,
              redirectUri: p.redirect_uri ?? '',
              verifier: p.code_verifier,
            });
          }).pipe(
            Effect.catchTag('OAuthFailure', (e) => Effect.fail(toError(e)))
          ),
        revoke: ({ payload: p }) =>
          Effect.gen(function* () {
            const { clientId, secret } = yield* credentials(p);
            if (!clientId) return yield* missing('client_id');
            yield* oauth.revoke(p.token, clientId, secret);
            return {};
          }).pipe(
            Effect.catchTag('OAuthFailure', (e) => Effect.fail(toError(e)))
          ),
        client: ({ query }) =>
          oauth.check(query.client_id, query.redirect_uri, query.scope).pipe(
            Effect.map(({ client, scopes }) => ({
              name: client.name,
              redirectHost:
                new URL(query.redirect_uri).host || query.redirect_uri,
              homepage: client.homepage,
              owner: client.owner,
              confidential: client.confidential,
              scopes,
            })),
            Effect.mapError(toError)
          ),
      });
    })
);

/** The signed-in user approving or refusing a client; their connected apps. */
export const OAuthConsentHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'oauthConsent',
  (handlers) =>
    Effect.gen(function* () {
      const oauth = yield* OAuth;
      return handlers.handleAll({
        decide: ({ payload: p }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            if (!p.approve) {
              yield* oauth.check(p.client_id, p.redirect_uri, p.scope);
              return {
                redirect: withQuery(p.redirect_uri, {
                  error: 'access_denied',
                  state: p.state,
                }),
              };
            }
            const code = yield* oauth.issueCode({
              clientId: p.client_id,
              userId: user.id,
              redirectUri: p.redirect_uri,
              codeChallenge: p.code_challenge,
              scope: p.scope,
            });
            return {
              redirect: withQuery(p.redirect_uri, { code, state: p.state }),
            };
          }).pipe(Effect.mapError(toError)),
        connections: () =>
          Effect.flatMap(CurrentUser, (user) =>
            oauth.connections(user.id)
          ).pipe(
            Effect.map((list) =>
              list.map((c) => ({
                clientId: c.client_id,
                name: c.name,
                scopes: [...new Set(c.scopes.split(' '))],
                connectedAt: c.created_at.toISOString(),
                lastUsedAt: c.last_used_at?.toISOString() ?? null,
              }))
            )
          ),
        disconnect: ({ params }) =>
          Effect.flatMap(CurrentUser, (user) =>
            oauth.disconnect(user.id, params.clientId)
          ),
      });
    })
);
