import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';
import { expect, it } from 'vitest';
import { TestDatabase } from './testing';

it('applies every migration to an empty database', async () => {
  const tables = await Effect.runPromise(
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;
      return yield* sql<{ table_name: string }>`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'app' ORDER BY table_name`;
    }).pipe(Effect.provide(TestDatabase))
  );
  expect(tables.map((t) => t.table_name)).toEqual([
    'api_keys',
    'email_tokens',
    'embeddings',
    'job_marks',
    'job_runs',
    'jobs',
    'oauth_clients',
    'oauth_codes',
    'oauth_tokens',
    'profiles',
    'resume_views',
    'sessions',
    'users',
  ]);
});
