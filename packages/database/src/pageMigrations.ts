import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';

/** How an account's public page is shown. */
export const pageMigrations: Record<
  string,
  Effect.Effect<void, unknown, SqlClient.SqlClient>
> = {
  // A private page: /@username and its formats answer only to its signed-in
  // owner, and it leaves Explore and the sitemap. The account works as ever.
  '27_private_pages': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      ALTER TABLE app.users ADD COLUMN page_private boolean NOT NULL DEFAULT false
    `;
  }),
};
