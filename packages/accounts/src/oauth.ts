import { Clock, Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { randomBytes } from 'node:crypto';
import { hashToken, newToken } from './crypto';
import * as O from './oauthUris';
import { connectionQueries } from './oauthConnections';
import { userQueries } from './sqlUsers';

const Client = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  redirect_uris: Schema.Array(Schema.String),
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** OAuth 2.1 for MCP clients: registration, codes with PKCE, rotating tokens. */
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
  const at = (ms: number) =>
    Effect.map(Clock.currentTimeMillis, (now) => new Date(now + ms));

  const client = (id: string) =>
    sql`SELECT id, name, redirect_uris FROM app.oauth_clients WHERE id = ${id}`.pipe(
      Effect.flatMap(rows(Client)),
      Effect.map(([found]) => found),
      Effect.orDie
    );

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

  /** The client, if the redirect URI is one it registered. */
  const check = Effect.fn('OAuth.check')(function* (
    clientId: string,
    redirectUri: string
  ) {
    const found = yield* client(clientId);
    if (!found) return yield* O.fail('invalid_client', 'Unknown client');
    if (!O.matchesRedirect(found.redirect_uris, redirectUri)) {
      return yield* O.fail(
        'invalid_request',
        'That redirect URI is not registered'
      );
    }
    return found;
  });

  /** After the user approves: a one-time code for the client's redirect. */
  const issueCode = Effect.fn('OAuth.issueCode')(function* (input: {
    clientId: string;
    userId: string;
    redirectUri: string;
    codeChallenge: string;
  }) {
    yield* check(input.clientId, input.redirectUri);
    const code = newToken();
    yield* sql`
      INSERT INTO app.oauth_codes (code_hash, client_id, user_id, redirect_uri, code_challenge, scope, expires_at)
      VALUES (${hashToken(code)}, ${input.clientId}, ${input.userId}, ${
      input.redirectUri
    },
              ${input.codeChallenge}, ${O.SCOPE}, ${yield* at(O.CODE_TTL)})
    `.pipe(Effect.orDie);
    return code;
  });

  const issueTokens = (clientId: string, userId: string) =>
    Effect.gen(function* () {
      const access = `jro_${newToken()}`;
      const refresh = `jrr_${newToken()}`;
      yield* sql`
        INSERT INTO app.oauth_tokens (client_id, user_id, access_hash, refresh_hash, scope,
                                      access_expires_at, refresh_expires_at)
        VALUES (${clientId}, ${userId}, ${hashToken(access)}, ${hashToken(
        refresh
      )}, ${O.SCOPE},
                ${yield* at(O.ACCESS_TTL)}, ${yield* at(O.REFRESH_TTL)})
      `.pipe(Effect.orDie);
      return {
        access_token: access,
        token_type: 'Bearer',
        expires_in: O.ACCESS_TTL / 1000,
        refresh_token: refresh,
        scope: O.SCOPE,
      };
    });

  const exchangeCode = Effect.fn('OAuth.exchangeCode')(function* (input: {
    code: string;
    clientId: string;
    redirectUri: string;
    verifier: string;
  }) {
    const [row] = yield* sql<{
      client_id: string;
      user_id: string;
      redirect_uri: string;
      code_challenge: string;
    }>`
      DELETE FROM app.oauth_codes WHERE code_hash = ${hashToken(
        input.code
      )} AND expires_at > now()
      RETURNING client_id, user_id, redirect_uri, code_challenge
    `.pipe(Effect.orDie);
    const invalid = O.fail(
      'invalid_grant',
      'The code is unknown, used or expired'
    );
    if (
      !row ||
      row.client_id !== input.clientId ||
      row.redirect_uri !== input.redirectUri
    ) {
      return yield* invalid;
    }
    if (!O.pkceMatches(input.verifier, row.code_challenge))
      return yield* invalid;
    return yield* issueTokens(row.client_id, row.user_id);
  });

  /** A refresh token is used once: it is replaced with a new pair. */
  const refresh = Effect.fn('OAuth.refresh')(function* (
    token: string,
    clientId: string
  ) {
    const [row] = yield* sql<{ client_id: string; user_id: string }>`
      DELETE FROM app.oauth_tokens WHERE refresh_hash = ${hashToken(
        token
      )} AND refresh_expires_at > now()
      RETURNING client_id, user_id
    `.pipe(Effect.orDie);
    if (!row || row.client_id !== clientId) {
      return yield* O.fail(
        'invalid_grant',
        'The refresh token is unknown or expired'
      );
    }
    return yield* issueTokens(row.client_id, row.user_id);
  });

  /** Who an access token belongs to, noting its use. */
  const authenticate = Effect.fn('OAuth.authenticate')(function* (
    access: string
  ) {
    const [row] = yield* sql<{ user_id: string }>`
      UPDATE app.oauth_tokens SET last_used_at = now()
      WHERE access_hash = ${hashToken(access)} AND access_expires_at > now()
      RETURNING user_id
    `.pipe(Effect.orDie);
    return row ? yield* users.byId(row.user_id) : undefined;
  });

  return {
    register,
    check,
    issueCode,
    exchangeCode,
    refresh,
    authenticate,
    ...connectionQueries(sql),
  };
});
