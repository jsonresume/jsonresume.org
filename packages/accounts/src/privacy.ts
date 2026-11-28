import type { Privacy, PrivacyChange } from '@repo/api';
import { HIDEABLE, type Hideable } from '@repo/profiles';
import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';

const Row = Schema.Struct({ hidden: Schema.NullOr(Schema.String) });
const decode = Schema.decodeUnknownEffect(Schema.Array(Row));
const PageRow = Schema.Struct({ private: Schema.Boolean });
const decodePage = Schema.decodeUnknownEffect(Schema.Array(PageRow));

const isHideable = (s: string): s is Hideable =>
  (HIDEABLE as ReadonlyArray<string>).includes(s);

/**
 * The contact details an account keeps off its public page, and whether it
 * keeps the whole page to itself (see Profiles). Stored as text
 * joined and split here, the same on Postgres and PGlite.
 */
export const privacyQueries = (sql: SqlClient.SqlClient) => {
  const q = {
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
    pagePrivate: (userId: string) =>
      sql`SELECT page_private AS private FROM app.users WHERE id = ${userId}`.pipe(
        Effect.flatMap(decodePage),
        Effect.map((rows) => rows[0]?.private ?? false),
        Effect.orDie
      ),
    setPagePrivate: (userId: string, hide: boolean) =>
      sql`UPDATE app.users SET page_private = ${hide} WHERE id = ${userId}`.pipe(
        Effect.asVoid,
        Effect.orDie
      ),
  };
  /** Both settings, as the API and the agents' tools show them. */
  const privacy = (userId: string): Effect.Effect<typeof Privacy.Type> =>
    Effect.all({
      hidden: q.hiddenFields(userId),
      pagePrivate: q.pagePrivate(userId),
    });
  return {
    ...q,
    privacy,
    /** Changes what the change names, and gives both back. */
    changePrivacy: (userId: string, change: typeof PrivacyChange.Type) =>
      Effect.gen(function* () {
        if (change.hidden !== undefined)
          yield* q.setHiddenFields(userId, change.hidden);
        if (change.pagePrivate !== undefined)
          yield* q.setPagePrivate(userId, change.pagePrivate);
        return yield* privacy(userId);
      }),
  };
};
