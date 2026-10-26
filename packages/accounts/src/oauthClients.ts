import type { Scope } from '@repo/api';
import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';
import { timingSafeEqual } from 'node:crypto';
import { hashToken } from './crypto';
import { fail } from './oauthUris';

const ClientRow = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  redirect_uris: Schema.Array(Schema.String),
  owner_id: Schema.NullOr(Schema.String),
  owner: Schema.NullOr(Schema.String),
  homepage: Schema.NullOr(Schema.String),
  secret_hash: Schema.NullOr(Schema.String),
});
const decode = Schema.decodeUnknownEffect(Schema.Array(ClientRow));

/** An app that may ask users for access. */
export interface OAuthClient {
  id: string;
  name: string;
  redirectUris: ReadonlyArray<string>;
  /** Who registered it (a username), or null when it registered itself. */
  owner: string | null;
  ownerId: string | null;
  homepage: string | null;
  /** Has a secret, so it runs on a server and may skip PKCE. */
  confidential: boolean;
}

/**
 * What an app gets when it asks for nothing: self-registered MCP clients
 * expect their tools, registered apps only who signed in.
 */
export const defaultScope = (client: OAuthClient): Scope =>
  client.ownerId ? 'profile' : 'mcp';

const sameHash = (secret: string, stored: string) => {
  const a = Buffer.from(hashToken(secret));
  const b = Buffer.from(stored);
  return a.length === b.length && timingSafeEqual(a, b);
};

export const clientQueries = (sql: SqlClient.SqlClient) => {
  const client = (id: string) =>
    sql`
      SELECT c.id, c.name, c.redirect_uris, c.owner_id, p.username AS owner, c.homepage, c.secret_hash
      FROM app.oauth_clients c
      LEFT JOIN app.profiles p ON p.user_id = c.owner_id AND p.kind = 'account'
      WHERE c.id = ${id}
    `.pipe(
      Effect.flatMap(decode),
      Effect.map(([row]) => (row ? { row, client: toClient(row) } : undefined)),
      Effect.orDie
    );

  /**
   * The client making a token request: its secret must match when it has
   * one (client_secret_basic or client_secret_post).
   */
  const authenticateClient = Effect.fn('OAuth.authenticateClient')(function* (
    id: string,
    secret: string | undefined
  ) {
    const found = yield* client(id);
    const bad = fail('invalid_client', 'Unknown client or wrong secret');
    if (!found) return yield* bad;
    const stored = found.row.secret_hash;
    if (stored && (!secret || !sameHash(secret, stored))) return yield* bad;
    return found.client;
  });

  return {
    client: (id: string) => Effect.map(client(id), (found) => found?.client),
    authenticateClient,
  };
};

const toClient = (row: typeof ClientRow.Type): OAuthClient => ({
  id: row.id,
  name: row.name,
  redirectUris: row.redirect_uris,
  owner: row.owner,
  ownerId: row.owner_id,
  homepage: row.homepage,
  confidential: row.secret_hash !== null,
});
