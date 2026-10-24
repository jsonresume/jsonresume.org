import { UsernameUnavailable } from '@repo/api';
import { Effect } from 'effect';
import { SqlClient, type SqlError } from 'effect/sql';
import type { UserRecord } from './store';

/**
 * The account changes that touch several tables at once (a new password,
 * deleting the account, renaming it), each in one transaction; and reading
 * its resumes.
 */
export const accountChanges = (
  nameTaken: (username: string) => Effect.Effect<boolean, SqlError.SqlError>,
  mustFind: (id: string) => Effect.Effect<UserRecord>
) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;

    const setPassword = (userId: string, passwordHash: string) =>
      Effect.gen(function* () {
        yield* sql`UPDATE app.users SET password_hash = ${passwordHash} WHERE id = ${userId}`;
        yield* sql`DELETE FROM app.sessions WHERE user_id = ${userId}`;
      }).pipe(sql.withTransaction, Effect.orDie);

    // The names go with the account (profiles cascade), and so do the views
    // of every name it held: nothing about the account is kept.
    const deleteUser = (userId: string) =>
      Effect.gen(function* () {
        yield* sql`DELETE FROM app.resume_views WHERE username IN (
          SELECT username FROM app.profiles WHERE user_id = ${userId})`;
        yield* sql`DELETE FROM app.users WHERE id = ${userId}`;
      }).pipe(sql.withTransaction, Effect.orDie);

    const renameUser = (userId: string, username: string, retiredUntil: Date) =>
      Effect.gen(function* () {
        const [current] = yield* sql<{ username: string }>`
          SELECT username FROM app.profiles WHERE user_id = ${userId} AND kind = 'account'`;
        if (!current) return yield* Effect.die(`no account for ${userId}`);
        if (current.username === username) return yield* mustFind(userId);
        // Back to one of their own old names: its alias makes way.
        yield* sql`DELETE FROM app.profiles WHERE username = ${username}
          AND kind = 'alias' AND user_id = ${userId}`;
        if (yield* nameTaken(username))
          return yield* new UsernameUnavailable({ reason: 'taken' });
        yield* sql`DELETE FROM app.profiles WHERE username = ${username} AND kind = 'ghost'`;
        yield* sql`UPDATE app.profiles SET username = ${username}
          WHERE user_id = ${userId} AND kind = 'account'`;
        yield* sql`INSERT INTO app.profiles (username, kind, user_id, retired_until)
          VALUES (${current.username}, 'alias', ${userId}, ${retiredUntil})`;
        yield* sql`UPDATE app.resume_views SET username = ${username}
          WHERE username = ${current.username}`;
        return yield* mustFind(userId);
      }).pipe(sql.withTransaction, Effect.catchTag('SqlError', Effect.die));

    const resumeOf = (userId: string) =>
      sql<{ stored: unknown; mirror: unknown; source: 'gist' | 'stored' }>`
        SELECT stored_resume AS stored, resume AS mirror, source
        FROM app.profiles WHERE user_id = ${userId} AND kind = 'account'`.pipe(
        Effect.map((rows) => rows[0]),
        Effect.orDie
      );

    const purgeRetired = () =>
      sql<{ username: string }>`DELETE FROM app.profiles
        WHERE kind = 'alias' AND retired_until < now() RETURNING username`.pipe(
        Effect.map((rows) => rows.length),
        Effect.orDie
      );

    return { setPassword, deleteUser, renameUser, resumeOf, purgeRetired };
  });
