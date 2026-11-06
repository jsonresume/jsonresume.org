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
};
