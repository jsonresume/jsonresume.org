import { Clock, Effect } from 'effect';
import type { SqlClient } from 'effect/sql';
import { hashToken, newToken } from './crypto';
import type { clientQueries } from './oauthClients';
import * as O from './oauthUris';

/** Tokens for a client: from a code, from a refresh token, and revoked. */
export const tokenQueries = (
  sql: SqlClient.SqlClient,
  clients: ReturnType<typeof clientQueries>
) => {
  const at = (ms: number) =>
    Effect.map(Clock.currentTimeMillis, (now) => new Date(now + ms));

  const issueTokens = (clientId: string, userId: string, scope: string) =>
    Effect.gen(function* () {
      const access = `jro_${newToken()}`;
      const refresh = `jrr_${newToken()}`;
      yield* sql`
        INSERT INTO app.oauth_tokens (client_id, user_id, access_hash, refresh_hash, scope,
                                      access_expires_at, refresh_expires_at)
        VALUES (${clientId}, ${userId}, ${hashToken(access)}, ${hashToken(
        refresh
      )}, ${scope},
                ${yield* at(O.ACCESS_TTL)}, ${yield* at(O.REFRESH_TTL)})
      `.pipe(Effect.orDie);
      return {
        access_token: access,
        token_type: 'Bearer',
        expires_in: O.ACCESS_TTL / 1000,
        refresh_token: refresh,
        scope,
      };
    });

  const exchangeCode = Effect.fn('OAuth.exchangeCode')(function* (input: {
    code: string;
    clientId: string;
    secret: string | undefined;
    redirectUri: string;
    verifier: string | undefined;
  }) {
    const client = yield* clients.authenticateClient(
      input.clientId,
      input.secret
    );
    const [row] = yield* sql<{
      client_id: string;
      user_id: string;
      redirect_uri: string;
      code_challenge: string | null;
      scope: string;
    }>`
      DELETE FROM app.oauth_codes WHERE code_hash = ${hashToken(
        input.code
      )} AND expires_at > now()
      RETURNING client_id, user_id, redirect_uri, code_challenge, scope
    `.pipe(Effect.orDie);
    const invalid = O.fail(
      'invalid_grant',
      'The code is unknown, used or expired'
    );
    if (
      !row ||
      row.client_id !== client.id ||
      row.redirect_uri !== input.redirectUri
    ) {
      return yield* invalid;
    }
    if (row.code_challenge !== null) {
      if (!input.verifier || !O.pkceMatches(input.verifier, row.code_challenge))
        return yield* invalid;
    }
    return yield* issueTokens(row.client_id, row.user_id, row.scope);
  });

  /** A refresh token is used once: it is replaced with a new pair. */
  const refresh = Effect.fn('OAuth.refresh')(function* (
    token: string,
    clientId: string,
    secret: string | undefined
  ) {
    const client = yield* clients.authenticateClient(clientId, secret);
    const [row] = yield* sql<{
      client_id: string;
      user_id: string;
      scope: string;
    }>`
      DELETE FROM app.oauth_tokens WHERE refresh_hash = ${hashToken(
        token
      )} AND refresh_expires_at > now()
      RETURNING client_id, user_id, scope
    `.pipe(Effect.orDie);
    if (!row || row.client_id !== client.id) {
      return yield* O.fail(
        'invalid_grant',
        'The refresh token is unknown or expired'
      );
    }
    return yield* issueTokens(row.client_id, row.user_id, row.scope);
  });

  /** RFC 7009: an access or refresh token (and its pair) stops working. */
  const revoke = Effect.fn('OAuth.revoke')(function* (
    token: string,
    clientId: string,
    secret: string | undefined
  ) {
    const client = yield* clients.authenticateClient(clientId, secret);
    const hash = hashToken(token);
    yield* sql`
      DELETE FROM app.oauth_tokens
      WHERE client_id = ${client.id} AND (access_hash = ${hash} OR refresh_hash = ${hash})
    `.pipe(Effect.orDie);
  });

  return { exchangeCode, refresh, revoke };
};
