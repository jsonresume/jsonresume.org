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
    'career_moves',
    'email_tokens',
    'embeddings',
    'job_fits',
    'job_marks',
    'job_requirements',
    'job_roles',
    'job_runs',
    'jobs',
    'oauth_clients',
    'oauth_codes',
    'oauth_tokens',
    'pathway_plans',
    'plan_steps',
    'profiles',
    'resume_evidence',
    'resume_insights',
    'resume_views',
    'role_archetypes',
    'sessions',
    'skill_aliases',
    'skills',
    'title_families',
    'tree_snapshots',
    'users',
  ]);
});
