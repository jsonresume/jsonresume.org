import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';

/**
 * The job decision model (@repo/jobs decision, @repo/careers decisions):
 * what each post says about its company, what each person wants, every
 * decision shown and every mark with the decision it was made against.
 */
export const decisionMigrations: Record<
  string,
  Effect.Effect<void, unknown, SqlClient.SqlClient>
> = {
  '22_job_decisions': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.job_facts (
        job_id bigint PRIMARY KEY REFERENCES app.jobs (id) ON DELETE CASCADE,
        facts jsonb NOT NULL,
        model text NOT NULL,
        read_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    yield* sql`
      CREATE TABLE app.job_preferences (
        user_id uuid PRIMARY KEY REFERENCES app.users (id) ON DELETE CASCADE,
        preferences jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    yield* sql`
      CREATE TABLE app.job_preference_changes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        preferences jsonb NOT NULL,
        source text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    yield* sql`
      CREATE INDEX job_preference_changes_user
        ON app.job_preference_changes (user_id, created_at)
    `;
    yield* sql`
      CREATE TABLE app.job_decisions (
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        job_id bigint NOT NULL REFERENCES app.jobs (id) ON DELETE CASCADE,
        verdict text NOT NULL,
        chance smallint NOT NULL,
        appeal smallint NOT NULL,
        value smallint NOT NULL,
        reasons jsonb NOT NULL,
        model text NOT NULL,
        decided_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, job_id)
      )
    `;
    yield* sql`
      CREATE TABLE app.job_mark_events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        job_id bigint NOT NULL,
        state text,
        reason text,
        note text,
        source text NOT NULL,
        position integer,
        verdict text,
        chance smallint,
        appeal smallint,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    yield* sql`
      CREATE INDEX job_mark_events_user ON app.job_mark_events (user_id, created_at)
    `;
  }),

  // The weekly jobs email (@repo/job-digest): every job sent to whom, so a
  // job is never sent twice and a rerun the same week sends nothing new.
  '23_job_digests': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.job_digests (
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        job_id bigint NOT NULL,
        sent_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, job_id)
      )
    `;
  }),
};
