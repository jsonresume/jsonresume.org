import { PgClient } from '@effect/sql-pg';
import { Config, Effect, Layer, type Redacted } from 'effect';
import { Migrator, SqlClient, type SqlError } from 'effect/sql';
import { migrations } from './migrations';

export { jsonbText } from './jsonb';
export { migrations } from './migrations';

/** Postgres from DATABASE_URL, migrated before anything uses it. */
export const PgLive = Layer.effectDiscard(
  Migrator.make({})({
    loader: Migrator.fromRecord(migrations),
    table: 'app_migrations',
  })
).pipe(
  Layer.provideMerge(
    PgClient.layerConfig({ url: Config.Redacted('DATABASE_URL') })
  )
);

/**
 * Another Postgres, read-only and never migrated: every transaction on it is
 * read-only from the connection's startup, whatever the driver (PGOPTIONS
 * is not read by Effect's driver). For reading from production in scripts
 * and the dev seed; `ensureReadOnly` checks it before anything runs.
 */
export const pgReadOnly = (
  url: Redacted.Redacted
): Layer.Layer<SqlClient.SqlClient, SqlError.SqlError | Config.ConfigError> =>
  PgClient.layerConfig({
    url: Config.succeed(url),
    startupParameters: Config.succeed({ default_transaction_read_only: 'on' }),
  });

/** Fails unless the connection's transactions are read-only. */
export const ensureReadOnly: Effect.Effect<
  void,
  SqlError.SqlError,
  SqlClient.SqlClient
> = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const [row] = yield* sql<{ default_transaction_read_only: string }>`
    SHOW default_transaction_read_only`;
  if (row?.default_transaction_read_only !== 'on') {
    return yield* Effect.die(
      'Refusing to run: the connection is not read-only'
    );
  }
});
