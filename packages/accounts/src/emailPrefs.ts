import { Effect } from 'effect';
import type { SqlClient } from 'effect/sql';

/**
 * The account's own email switches, both on until turned off:
 * account_emails (welcome, reminders, the empty-page nudge) and
 * monthly_report (@repo/resume-report).
 */
export const emailPrefs = (sql: SqlClient.SqlClient) => {
  const read = (userId: string, column: 'account_emails' | 'monthly_report') =>
    sql<{ on: boolean }>`
      SELECT ${sql(column)} AS on FROM app.users WHERE id = ${userId}`.pipe(
      Effect.map((rows) => rows[0]?.on === true),
      Effect.orDie
    );
  const write = (
    userId: string,
    column: 'account_emails' | 'monthly_report',
    on: boolean
  ) =>
    sql`UPDATE app.users SET ${sql(column)} = ${on} WHERE id = ${userId}`.pipe(
      Effect.asVoid,
      Effect.orDie
    );
  return {
    accountEmails: (userId: string) => read(userId, 'account_emails'),
    setAccountEmails: (userId: string, on: boolean) =>
      write(userId, 'account_emails', on),
    monthlyReport: (userId: string) => read(userId, 'monthly_report'),
    setMonthlyReport: (userId: string, on: boolean) =>
      write(userId, 'monthly_report', on),
  };
};
