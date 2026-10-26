import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';

const Connection = Schema.Struct({
  client_id: Schema.String,
  name: Schema.String,
  scopes: Schema.String,
  created_at: Schema.Date,
  last_used_at: Schema.NullOr(Schema.Date),
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** The apps a user connected with OAuth, and disconnecting one. */
export const connectionQueries = (sql: SqlClient.SqlClient) => {
  /** The apps a user has connected, one row each. */
  const connections = (userId: string) =>
    sql`
      SELECT c.id AS client_id, c.name, string_agg(DISTINCT t.scope, ' ') AS scopes, min(t.created_at) AS created_at, max(t.last_used_at) AS last_used_at
      FROM app.oauth_tokens t JOIN app.oauth_clients c ON c.id = t.client_id
      WHERE t.user_id = ${userId} GROUP BY c.id, c.name ORDER BY min(t.created_at) DESC
    `.pipe(Effect.flatMap(rows(Connection)), Effect.orDie);

  const disconnect = (userId: string, clientId: string) =>
    sql`DELETE FROM app.oauth_tokens WHERE user_id = ${userId} AND client_id = ${clientId}`.pipe(
      Effect.asVoid,
      Effect.orDie
    );

  return { connections, disconnect };
};
