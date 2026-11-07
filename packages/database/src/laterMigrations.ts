import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';

/**
 * Migrations from 14 on, kept apart so neither file outgrows the line
 * limit; `migrations` runs them after the rest. Never edit one that has
 * shipped; add the next one.
 */
export const laterMigrations: Record<
  string,
  Effect.Effect<void, unknown, SqlClient.SqlClient>
> = {
  // Word downloads (/@username.docx) are counted with the other downloads.
  '14_docx_downloads': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`ALTER TABLE app.resume_views DROP CONSTRAINT resume_views_kind_check`;
    yield* sql`
      ALTER TABLE app.resume_views
        ADD CONSTRAINT resume_views_kind_check
          CHECK (kind IN ('page', 'json', 'yaml', 'txt', 'docx'))
    `;
  }),

  // Resume imports (@repo/resume-import), for quality and cost: never the
  // file or its text. `result` is the parsed resume, kept on the row that
  // read it so the same input (by SHA-256, at the same version) is read once.
  '15_imports': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.imports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES app.users (id) ON DELETE SET NULL,
        kind text NOT NULL CHECK (kind IN ('pdf', 'docx', 'linkedin', 'text')),
        file_hash text NOT NULL,
        ms integer NOT NULL,
        fields integer NOT NULL,
        model text,
        version text NOT NULL,
        cached boolean NOT NULL DEFAULT false,
        result jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    yield* sql`
      CREATE INDEX imports_cache ON app.imports (file_hash, version)
        WHERE result IS NOT NULL
    `;
    yield* sql`CREATE INDEX imports_created ON app.imports (created_at)`;
    // Deleting an account forgets what its imports read; the stats stay.
    yield* sql`
      CREATE FUNCTION app.forget_user_imports() RETURNS trigger AS $$
      BEGIN
        UPDATE app.imports SET result = NULL WHERE user_id = OLD.id;
        RETURN OLD;
      END $$ LANGUAGE plpgsql
    `;
    yield* sql`
      CREATE TRIGGER users_forget_imports BEFORE DELETE ON app.users
        FOR EACH ROW EXECUTE FUNCTION app.forget_user_imports()
    `;
  }),

  // Every save of an account's resume, append-only (@repo/resume-versions).
  // By account, as profiles are keyed by a username that can change. `json`
  // keeps the text as saved, key order too, so a restore is exact.
  '16_resume_versions': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.resume_versions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        version integer NOT NULL CHECK (version > 0),
        resume json NOT NULL,
        actor_kind text NOT NULL
          CHECK (actor_kind IN ('user', 'app', 'assistant', 'restore')),
        actor_id text,
        actor_name text,
        note text,
        created_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (user_id, version)
      )
    `;
  }),

  // Contact details an account keeps off its public page (@repo/profiles
  // redact): any of 'email', 'phone', 'address'.
  '17_hidden_fields': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      ALTER TABLE app.users
        ADD COLUMN hidden_fields text[] NOT NULL DEFAULT '{}'
    `;
  }),

  // The apps directory (/apps): OAuth apps their owners list, with a line
  // about what each does.
  '18_app_directory': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      ALTER TABLE app.oauth_clients
        ADD COLUMN listed boolean NOT NULL DEFAULT false,
        ADD COLUMN description text
    `;
  }),
};
