import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';

/** How a public page is shown, and what it says about itself. */
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

  // When a mirrored gist last changed on GitHub (its updated_at): Explore
  // dates gist resumes by it, as it dates saved ones by stored_at.
  '28_gist_updated_at': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`ALTER TABLE app.profiles ADD COLUMN gist_updated_at timestamptz`;
  }),
};
