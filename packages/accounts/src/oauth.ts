import { parseScope } from '@repo/api';
import { Clock, Context, Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { randomBytes } from 'node:crypto';
import { hashToken, newToken } from './crypto';
import { appQueries } from './oauthApps';
import { clientQueries, defaultScope } from './oauthClients';
import { connectionQueries } from './oauthConnections';
import { tokenQueries } from './oauthTokens';
import * as O from './oauthUris';
import { userQueries } from './sqlUsers';

/**
 * OAuth 2.1: apps that register themselves (MCP clients) or are registered
 * by a person (HR tools, with a secret); codes with PKCE; scoped,
 * short-lived access tokens with rotating refresh tokens.
 */
export class OAuth extends Context.Service<
  OAuth,
  Effect.Success<typeof make>
>()('@repo/accounts/OAuth') {
  static readonly layer = Layer.effect(
    OAuth,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const users = yield* userQueries;
  const clients = clientQueries(sql);
  const at = (ms: number) =>
    Effect.map(Clock.currentTimeMillis, (now) => new Date(now + ms));

  /** RFC 7591: any client may register; its redirect URIs are checked. */
  const register = Effect.fn('OAuth.register')(function* (input: {
    name: string;
    redirectUris: ReadonlyArray<string>;
  }) {
    if (
      input.redirectUris.length === 0 ||
      !input.redirectUris.every(O.allowedRedirect)
    ) {
      return yield* O.fail(
        'invalid_redirect_uri',
        'Redirect URIs must be https, loopback http, or an app scheme'
      );
    }
    const id = `jrc_${randomBytes(16).toString('base64url')}`;
    const name = input.name.trim().slice(0, 80) || 'An MCP client';
    yield* sql`
      INSERT INTO app.oauth_clients (id, name, redirect_uris)
      VALUES (${id}, ${name}, ${JSON.stringify(input.redirectUris)}::jsonb)
    `.pipe(Effect.orDie);
    return { id, name, redirectUris: input.redirectUris };
  });

  /**
   * The client and the scopes it asks for, if the redirect URI is one it
   * registered and every scope exists.
   */
  const check = Effect.fn('OAuth.check')(function* (
    clientId: string,
    redirectUri: string,
    scope?: string
  ) {
    const client = yield* clients.client(clientId);
    if (!client) return yield* O.fail('invalid_client', 'Unknown client');
    if (!O.matchesRedirect(client.redirectUris, redirectUri)) {
      return yield* O.fail(
        'invalid_request',
        'That redirect URI is not registered'
      );
    }
    const scopes = parseScope(scope, defaultScope(client));
    if (!scopes) return yield* O.fail('invalid_scope', 'Unknown scope');
    return { client, scopes };
  });

  /** After the user approves: a one-time code for the client's redirect. */
  const issueCode = Effect.fn('OAuth.issueCode')(function* (input: {
    clientId: string;
    userId: string;
    redirectUri: string;
    codeChallenge: string | undefined;
    scope: string | undefined;
  }) {
    const { client, scopes } = yield* check(
      input.clientId,
      input.redirectUri,
      input.scope
    );
    // Without a secret, PKCE is what stops a stolen code being used.
    if (!input.codeChallenge && !client.confidential) {
      return yield* O.fail('invalid_request', 'PKCE (S256) is required');
    }
    const code = newToken();
    yield* sql`
      INSERT INTO app.oauth_codes (code_hash, client_id, user_id, redirect_uri, code_challenge, scope, expires_at)
      VALUES (${hashToken(code)}, ${input.clientId}, ${input.userId}, ${
      input.redirectUri
    },
              ${input.codeChallenge ?? null}, ${scopes.join(' ')}, ${yield* at(
      O.CODE_TTL
    )})
    `.pipe(Effect.orDie);
    return code;
  });

  /** Who an access token belongs to and what it allows, noting its use. */
  const authenticate = Effect.fn('OAuth.authenticate')(function* (
    access: string
  ) {
    const [row] = yield* sql<{
      user_id: string;
      client_id: string;
      scope: string;
    }>`
      UPDATE app.oauth_tokens SET last_used_at = now()
      WHERE access_hash = ${hashToken(access)} AND access_expires_at > now()
      RETURNING user_id, client_id, scope
    `.pipe(Effect.orDie);
    if (!row) return undefined;
    const user = yield* users.byId(row.user_id);
    return user && { user, scope: row.scope, clientId: row.client_id };
  });

  return {
    register,
    check,
    issueCode,
    authenticate,
    ...tokenQueries(sql, clients),
    ...connectionQueries(sql),
    ...appQueries(sql),
  };
});
