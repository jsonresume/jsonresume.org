import { PgliteClient } from '@effect/sql-pglite';
import { Layer } from 'effect';
import { Migrator } from 'effect/sql';
import { migrations } from './migrations';

/**
 * An in-memory Postgres (PGlite) with every migration applied. Shared by
 * everything built with the same MemoMap: local development uses this.
 */
export const InMemoryDatabase = Layer.effectDiscard(
  Migrator.make({})({
    loader: Migrator.fromRecord(migrations),
    table: 'app_migrations',
  })
).pipe(Layer.provideMerge(PgliteClient.layer()));

/** For tests of SQL stores: each use of the layer is a new, empty database. */
export const TestDatabase = InMemoryDatabase.pipe(Layer.fresh);
