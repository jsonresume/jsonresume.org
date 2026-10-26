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

  // Password resets share email tokens, told apart by purpose. Renames
  // leave an alias that redirects until retired_until, then frees the name;
  // aliases from merged ghosts have none and stay.
  '4_resets_and_renames': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      ALTER TABLE app.email_tokens
        ADD COLUMN purpose text NOT NULL DEFAULT 'verify' CHECK (purpose IN ('verify', 'reset'))
    `;
    yield* sql`ALTER TABLE app.profiles ADD COLUMN retired_until timestamptz`;
  }),

  // A GitHub user's OAuth token, encrypted with AUTH_SECRET, and the scopes
  // it has: with gist, the editor saves to their gist.
  '5_github_grants': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`ALTER TABLE app.users ADD COLUMN github_token text, ADD COLUMN github_scopes text`;
  }),

  // Jobs from Hacker News "Who is hiring?" threads (@repo/jobs), keyed by
  // the comment's item id. The pipeline fills parsed (structured, from a
  // model), then embedding (float32s, text-embedding-3-large), then the
  // repost family: companies repost each month, and the board shows the
  // newest of a family. Marks are what a signed-in user said about a job.
  '6_jobs': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.jobs (
        id bigint PRIMARY KEY,
        thread_id bigint NOT NULL,
        author text NOT NULL,
        html text NOT NULL,
        posted_at timestamptz NOT NULL,
        imported_at timestamptz NOT NULL DEFAULT now(),
        parsed jsonb,
        parsed_at timestamptz,
        parse_attempts smallint NOT NULL DEFAULT 0,
        parse_error text,
        embedding bytea,
        family_id bigint,
        family_months smallint NOT NULL DEFAULT 1,
        removed_at timestamptz
      )
    `;
    yield* sql`CREATE INDEX jobs_posted ON app.jobs (posted_at DESC)`;
    yield* sql`
      CREATE TABLE app.job_marks (
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        job_id bigint NOT NULL REFERENCES app.jobs (id) ON DELETE CASCADE,
        state text NOT NULL CHECK (state IN ('interested', 'applied', 'not_interested')),
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, job_id)
      )
    `;
    yield* sql`
      CREATE TABLE app.job_runs (
        id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        started_at timestamptz NOT NULL DEFAULT now(),
        finished_at timestamptz,
        ok boolean,
        stats jsonb NOT NULL DEFAULT '{}'::jsonb,
        error text
      )
    `;
    // Embeddings of resumes, by a hash of the text embedded.
    yield* sql`
      CREATE TABLE app.embeddings (
        text_hash text PRIMARY KEY,
        embedding bytea NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
  }),

  // API keys for the jobs CLI (@jsonresume/jobs) and other scripts: only a
  // hash is kept. Marks gain "maybe" and the reason given, as the CLI sends.
  '7_api_keys': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.api_keys (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        name text NOT NULL,
        key_hash text NOT NULL UNIQUE,
        prefix text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        last_used_at timestamptz
      )
    `;
    yield* sql`CREATE INDEX api_keys_user ON app.api_keys (user_id)`;
    yield* sql`ALTER TABLE app.job_marks DROP CONSTRAINT job_marks_state_check`;
    yield* sql`
      ALTER TABLE app.job_marks
        ADD CONSTRAINT job_marks_state_check
          CHECK (state IN ('interested', 'maybe', 'applied', 'not_interested')),
        ADD COLUMN feedback text
    `;
  }),

  // OAuth 2.1 for MCP clients (claude.ai, ChatGPT, …): clients register
  // themselves (RFC 7591), users approve them, and get short-lived access
  // tokens with rotating refresh tokens. Only hashes of codes and tokens.
  '8_oauth': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.oauth_clients (
        id text PRIMARY KEY,
        name text NOT NULL,
        redirect_uris jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    yield* sql`
      CREATE TABLE app.oauth_codes (
        code_hash text PRIMARY KEY,
        client_id text NOT NULL REFERENCES app.oauth_clients (id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        redirect_uri text NOT NULL,
        code_challenge text NOT NULL,
        scope text NOT NULL,
        expires_at timestamptz NOT NULL
      )
    `;
    yield* sql`
      CREATE TABLE app.oauth_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id text NOT NULL REFERENCES app.oauth_clients (id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        access_hash text NOT NULL UNIQUE,
        refresh_hash text NOT NULL UNIQUE,
        scope text NOT NULL,
        access_expires_at timestamptz NOT NULL,
        refresh_expires_at timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        last_used_at timestamptz
      )
    `;
    yield* sql`CREATE INDEX oauth_tokens_user ON app.oauth_tokens (user_id)`;
  }),

  // Explore lists every public resume; an account can take theirs out.
  '9_explore_listing': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`ALTER TABLE app.profiles ADD COLUMN listed boolean NOT NULL DEFAULT true`;
  }),

  // OAuth apps people register (HR tools, job sites): an owner, a secret
  // (its hash) for apps with a server, a homepage for the consent page.
  // Apps with a secret may skip PKCE, as OAuth 2.1 allows.
  '10_oauth_apps': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      ALTER TABLE app.oauth_clients
        ADD COLUMN owner_id uuid REFERENCES app.users (id) ON DELETE CASCADE,
        ADD COLUMN secret_hash text,
        ADD COLUMN homepage text
    `;
    yield* sql`CREATE INDEX oauth_clients_owner ON app.oauth_clients (owner_id)`;
    yield* sql`ALTER TABLE app.oauth_codes ALTER COLUMN code_challenge DROP NOT NULL`;
  }),
};
