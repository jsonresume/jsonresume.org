import { PgClient } from '@effect/sql-pg';
import { Config, Layer } from 'effect';
import { Migrator } from 'effect/sql';
import { migrations } from './migrations';

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
