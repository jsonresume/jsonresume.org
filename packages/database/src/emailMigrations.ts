import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';

/** Emails sent about an account (@repo/accounts lifecycle). */
export const emailMigrations: Record<
  string,
  Effect.Effect<void, unknown, SqlClient.SqlClient>
> = {
  // Each kind (welcome, verify reminders, the empty-page nudge) goes to an
  // account at most once; the row is claimed before sending.
  '25_account_emails': Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      CREATE TABLE app.account_emails (
        user_id uuid NOT NULL REFERENCES app.users (id) ON DELETE CASCADE,
        kind text NOT NULL,
        sent_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (user_id, kind)
      )
    `;
    // Whether the account wants those emails (off from any email's link).
    yield* sql`
      ALTER TABLE app.users ADD COLUMN account_emails boolean NOT NULL DEFAULT true
    `;
  }),
};
