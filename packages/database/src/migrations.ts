import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';

/**
 * Every schema change, run once each, in order, at startup. Tables live in
 * the `app` schema, apart from the copy of the old Supabase database in
 * `public`. Never edit a migration that has shipped; add the next one.
 */
export const migrations: Record<
  string,
  Effect.Effect<void, unknown, SqlClient.SqlClient>
> = {
  '1_profiles': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`CREATE SCHEMA IF NOT EXISTS app`;
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

  // Accounts (docs/ACCOUNTS_AND_USERNAMES.md): a user signs in with email and
  // password or GitHub and holds one username. Profiles become one row per
  // name: a ghost (mirror of a gist), an account, or an alias that redirects
  // to an account (a merged ghost, later a rename).
  '2_accounts': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text UNIQUE CHECK (email = lower(email)),
        password_hash text,
        email_verified_at timestamptz,
        github_id bigint UNIQUE,
        github_login text,
        avatar_url text,
        created_at timestamptz NOT NULL DEFAULT now(),
        CHECK (email IS NOT NULL OR github_id IS NOT NULL)
      )
    `;
    yield* sql`
      CREATE TABLE app.sessions (
        token_hash text PRIMARY KEY,
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL
      )
    `;
    yield* sql`CREATE INDEX sessions_user ON app.sessions (user_id)`;
    yield* sql`
      CREATE TABLE app.email_tokens (
        token_hash text PRIMARY KEY,
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        email text NOT NULL,
        expires_at timestamptz NOT NULL
      )
    `;
    yield* sql`ALTER TABLE app.profiles DROP CONSTRAINT profiles_kind_check`;
    yield* sql`
      ALTER TABLE app.profiles
        ADD CONSTRAINT profiles_kind_check CHECK (kind IN ('ghost', 'account', 'alias')),
        ADD COLUMN user_id uuid REFERENCES app.users (id) ON DELETE CASCADE,
        ADD COLUMN source text NOT NULL DEFAULT 'gist' CHECK (source IN ('gist', 'stored')),
        ADD COLUMN stored_resume jsonb,
        ADD COLUMN stored_at timestamptz,
        ALTER COLUMN github_id DROP NOT NULL,
        ALTER COLUMN gist_id DROP NOT NULL,
        ALTER COLUMN resume DROP NOT NULL,
        ALTER COLUMN fetched_at DROP NOT NULL,
        ADD CONSTRAINT profiles_owner CHECK (
          (kind = 'ghost' AND user_id IS NULL AND github_id IS NOT NULL AND gist_id IS NOT NULL
            AND resume IS NOT NULL AND fetched_at IS NOT NULL)
          OR (kind IN ('account', 'alias') AND user_id IS NOT NULL)
        )
    `;
    yield* sql`CREATE UNIQUE INDEX profiles_one_account ON app.profiles (user_id) WHERE kind = 'account'`;
  }),

  // Resume views: one row per page view (from the beacon in themed pages)
  // or data read (.json, .yaml, .txt, counted by the server). No cookies and
  // no IP addresses: visitors are a daily salted hash.
  '3_resume_views': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.resume_views (
        id uuid PRIMARY KEY,
        username text NOT NULL,
        kind text NOT NULL CHECK (kind IN ('page', 'json', 'yaml', 'txt')),
        theme text,
        viewed_at timestamptz NOT NULL DEFAULT now(),
        visible_seconds integer NOT NULL DEFAULT 0,
        read_depth smallint NOT NULL DEFAULT 0,
        referrer text,
        country text,
        device text,
        browser text,
        visitor text NOT NULL
      )
    `;
    yield* sql`CREATE INDEX resume_views_user_time ON app.resume_views (username, viewed_at DESC)`;
  }),
};
