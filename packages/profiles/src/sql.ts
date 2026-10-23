import { PgClient } from '@effect/sql-pg';
import { Config, Effect, Layer, Schema } from 'effect';
import { Migrator, SqlClient, SqlSchema } from 'effect/sql';
import { GhostProfile, ProfileStore } from './store';

/**
 * Schema changes, run in order at startup. Tables live in the `app` schema,
 * apart from the copy of the old Supabase database in `public`.
 */
const migrations = Migrator.fromRecord({
  '1_profiles': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`CREATE SCHEMA IF NOT EXISTS app`;
    // One row per username. Only ghosts for now; accounts add their own
    // columns (docs/ACCOUNTS_AND_USERNAMES.md).
    yield* sql`
      CREATE TABLE app.profiles (
        username text PRIMARY KEY CHECK (username = lower(username)),
        kind text NOT NULL CHECK (kind IN ('ghost')),
        github_id bigint NOT NULL,
        gist_id text NOT NULL,
        resume jsonb NOT NULL,
        fetched_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  }),
});

const Row = Schema.Struct({
  username: Schema.String,
  github_id: Schema.Number,
  gist_id: Schema.String,
  resume: Schema.Unknown,
  fetched_at: Schema.Date,
});

const toGhost = (row: typeof Row.Type): GhostProfile => ({
  username: row.username,
  githubId: row.github_id,
  gistId: row.gist_id,
  resume: row.resume,
  fetchedAt: row.fetched_at,
});

/** ProfileStore on Postgres. Database errors are defects: callers can't fix them. */
export const PgProfileStore = Layer.effect(
  ProfileStore,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const findOne = SqlSchema.findOneOption({
      Request: Schema.String,
      Result: Row,
      execute: (username) =>
        sql`SELECT username, github_id::float8 AS github_id, gist_id, resume, fetched_at
            FROM app.profiles WHERE username = ${username} AND kind = 'ghost'`,
    });
    return ProfileStore.of({
      findGhost: (username) =>
        findOne(username).pipe(
          Effect.map((row) =>
            row._tag === 'Some' ? toGhost(row.value) : undefined
          ),
          Effect.orDie
        ),
      saveGhost: (ghost) =>
        sql`
          INSERT INTO app.profiles (username, kind, github_id, gist_id, resume, fetched_at)
          VALUES (${ghost.username}, 'ghost', ${ghost.githubId}, ${
          ghost.gistId
        },
                  ${JSON.stringify(ghost.resume)}::jsonb, ${ghost.fetchedAt})
          ON CONFLICT (username) DO UPDATE SET
            github_id = EXCLUDED.github_id, gist_id = EXCLUDED.gist_id,
            resume = EXCLUDED.resume, fetched_at = EXCLUDED.fetched_at
          WHERE app.profiles.kind = 'ghost'
        `.pipe(Effect.asVoid, Effect.orDie),
      removeGhost: (username) =>
        sql`DELETE FROM app.profiles WHERE username = ${username} AND kind = 'ghost'`.pipe(
          Effect.asVoid,
          Effect.orDie
        ),
    });
  })
);

/** Postgres from DATABASE_URL, migrated before anything uses it. */
export const PgLive = Layer.effectDiscard(
  Migrator.make({})({ loader: migrations, table: 'app_migrations' })
).pipe(
  Layer.provideMerge(
    PgClient.layerConfig({ url: Config.Redacted('DATABASE_URL') })
  )
);

/** The profile store on a migrated Postgres. */
export const PgProfileStoreLive = PgProfileStore.pipe(Layer.provide(PgLive));
