import { Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { hashToken, newToken } from './crypto';
import { userQueries } from './sqlUsers';

const KeyRow = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  prefix: Schema.String,
  created_at: Schema.Date,
  last_used_at: Schema.NullOr(Schema.Date),
});
const decodeKeys = Schema.decodeUnknownEffect(Schema.Array(KeyRow));

export interface ApiKeyRecord {
  id: string;
  name: string;
  /** The key's first characters, to tell keys apart. */
  prefix: string;
  createdAt: Date;
  lastUsedAt: Date | null;
}

const toRecord = (row: typeof KeyRow.Type): ApiKeyRecord => ({
  id: row.id,
  name: row.name,
  prefix: row.prefix,
  createdAt: row.created_at,
  lastUsedAt: row.last_used_at,
});

/** A user may hold this many keys. */
export const MAX_KEYS = 10;

/**
 * API keys ("jr_..."), for the jobs CLI and scripts: shown once when made,
 * stored as a hash, revocable. Database errors are defects.
 */
export class ApiKeys extends Context.Service<
  ApiKeys,
  Effect.Success<typeof make>
>()('@repo/accounts/ApiKeys') {
  static readonly layer = Layer.effect(
    ApiKeys,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const users = yield* userQueries;

  const list = (userId: string) =>
    sql`
      SELECT id, name, prefix, created_at, last_used_at FROM app.api_keys
      WHERE user_id = ${userId} ORDER BY created_at DESC
    `.pipe(
      Effect.flatMap(decodeKeys),
      Effect.map((rows) => rows.map(toRecord)),
      Effect.orDie
    );

  /** A new key and its record, or undefined when the user has MAX_KEYS. */
  const create = Effect.fn('ApiKeys.create')(function* (
    userId: string,
    name: string
  ) {
    if ((yield* list(userId)).length >= MAX_KEYS) return undefined;
    const key = `jr_${newToken()}`;
    const [row] = yield* sql`
      INSERT INTO app.api_keys (user_id, name, key_hash, prefix)
      VALUES (${userId}, ${name.trim().slice(0, 60) || 'API key'}, ${hashToken(
      key
    )}, ${key.slice(0, 10)})
      RETURNING id, name, prefix, created_at, last_used_at
    `.pipe(Effect.flatMap(decodeKeys), Effect.orDie);
    return row && { key, record: toRecord(row) };
  });

  const revoke = (userId: string, id: string) =>
    sql`DELETE FROM app.api_keys WHERE user_id = ${userId} AND id::text = ${id}`.pipe(
      Effect.asVoid,
      Effect.orDie
    );

  /** Who a key belongs to, noting its use; undefined for an unknown key. */
  const authenticate = Effect.fn('ApiKeys.authenticate')(function* (
    key: string
  ) {
    const hash = hashToken(key);
    const [owner] = yield* sql<{ user_id: string }>`
      UPDATE app.api_keys SET last_used_at = now() WHERE key_hash = ${hash}
      RETURNING user_id
    `.pipe(Effect.orDie);
    return owner ? yield* users.byId(owner.user_id) : undefined;
  });

  return { list, create, revoke, authenticate };
});
