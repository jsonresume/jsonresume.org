import { HIDEABLE, type Hideable } from '@repo/profiles';
import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';

const Row = Schema.Struct({ hidden: Schema.NullOr(Schema.String) });
const decode = Schema.decodeUnknownEffect(Schema.Array(Row));

const isHideable = (s: string): s is Hideable =>
  (HIDEABLE as ReadonlyArray<string>).includes(s);

/**
 * The contact details an account keeps off its public page. Stored as text
 * joined and split here, the same on Postgres and PGlite.
 */
export const privacyQueries = (sql: SqlClient.SqlClient) => ({
  hiddenFields: (userId: string) =>
    sql`
      SELECT array_to_string(hidden_fields, ',') AS hidden
      FROM app.users WHERE id = ${userId}
    `.pipe(
      Effect.flatMap(decode),
      Effect.map((rows) =>
        (rows[0]?.hidden ?? '').split(',').filter(isHideable)
      ),
      Effect.orDie
    ),
  setHiddenFields: (userId: string, fields: ReadonlyArray<Hideable>) =>
    sql`
      UPDATE app.users
      SET hidden_fields = string_to_array(${[...new Set(fields)].join(
        ','
      )}, ',')
      WHERE id = ${userId}
    `.pipe(Effect.asVoid, Effect.orDie),
});
