import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';

/** Resume imports (@repo/resume-import) after the first. */
export const importMigrations: Record<
  string,
  Effect.Effect<void, unknown, SqlClient.SqlClient>
> = {
  // Photos and screenshots of a resume are read by the model as images.
  '24_import_images': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`ALTER TABLE app.imports DROP CONSTRAINT imports_kind_check`;
    yield* sql`
      ALTER TABLE app.imports ADD CONSTRAINT imports_kind_check
        CHECK (kind IN ('pdf', 'docx', 'linkedin', 'text', 'image'))
    `;
  }),
};
