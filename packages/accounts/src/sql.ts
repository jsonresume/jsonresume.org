import { EmailTaken, UsernameUnavailable } from '@repo/api';
import { PgLive } from '@repo/database';
import { Effect, Layer, Option, Schema } from 'effect';
import { SqlClient, SqlSchema } from 'effect/sql';
import { AccountStore, GithubTaken, type UserRecord } from './store';
import { userQueries } from './sqlUsers';

const AccountRow = Schema.Struct({
  source: Schema.Literals(['gist', 'stored']),
  has_stored: Schema.Boolean,
  has_mirror: Schema.Boolean,
});

/** AccountStore on Postgres. Database errors are defects: callers can't fix them. */
export const PgAccountStore = Layer.effect(
  AccountStore,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const q = yield* userQueries;
    const findById = q.byId;
    const nameTaken = (username: string) =>
      sql<{ n: number }>`SELECT 1 AS n FROM app.profiles
        WHERE username = ${username} AND kind <> 'ghost'`.pipe(
        Effect.map((r) => r.length > 0)
      );
    const mustFind = (id: string) =>
      findById(id).pipe(
        Effect.flatMap((u) =>
          u ? Effect.succeed(u) : Effect.die(`no user ${id}`)
        )
      );

    const accountRow = SqlSchema.findOneOption({
      Request: Schema.String,
      Result: AccountRow,
      execute: (userId) => sql`
        SELECT source, stored_resume IS NOT NULL AS has_stored, resume IS NOT NULL AS has_mirror
        FROM app.profiles WHERE user_id = ${userId} AND kind = 'account'`,
    });

    return AccountStore.of({
      findByEmail: q.byEmail,
      findByGithubId: q.byGithubId,
      findById,
      createEmailUser: ({ email, passwordHash, username }) =>
        Effect.gen(function* () {
          const emails =
            yield* sql`SELECT 1 FROM app.users WHERE email = ${email}`;
          if (emails.length > 0) return yield* new EmailTaken();
          if (yield* nameTaken(username))
            return yield* new UsernameUnavailable({ reason: 'taken' });
          const [row] = yield* sql<{ id: string }>`
            INSERT INTO app.users (email, password_hash) VALUES (${email}, ${passwordHash}) RETURNING id`;
          if (!row) return yield* Effect.die('insert returned nothing');
          yield* sql`INSERT INTO app.profiles (username, kind, user_id, source)
            VALUES (${username}, 'account', ${row.id}, 'stored')`;
          return yield* mustFind(row.id);
        }).pipe(sql.withTransaction, Effect.catchTag('SqlError', Effect.die)),
      createGithubUser: (identity, username) =>
        Effect.gen(function* () {
          if (yield* nameTaken(username))
            return yield* new UsernameUnavailable({ reason: 'taken' });
          // GitHub's verified email is theirs, unless an account here has it.
          const emailFree =
            identity.email !== null &&
            (yield* sql`SELECT 1 FROM app.users WHERE email = ${identity.email}`)
              .length === 0;
          const email = emailFree ? identity.email : null;
          const [row] = yield* sql<{ id: string }>`
            INSERT INTO app.users (email, email_verified_at, github_id, github_login, avatar_url)
            VALUES (${email}, ${email ? new Date() : null}, ${identity.id}, ${
            identity.login
          }, ${identity.avatarUrl})
            RETURNING id`;
          if (!row) return yield* Effect.die('insert returned nothing');
          // Their own ghost becomes the account, keeping its gist copy.
          const claimed = yield* sql`
            UPDATE app.profiles SET kind = 'account', user_id = ${row.id}, source = 'gist'
            WHERE username = ${username} AND kind = 'ghost' AND github_id = ${identity.id}
            RETURNING username`;
          if (claimed.length === 0) {
            yield* sql`DELETE FROM app.profiles WHERE username = ${username} AND kind = 'ghost'`;
            yield* sql`INSERT INTO app.profiles (username, kind, user_id, source)
              VALUES (${username}, 'account', ${row.id}, 'gist')`;
          }
          return yield* mustFind(row.id);
        }).pipe(sql.withTransaction, Effect.catchTag('SqlError', Effect.die)),
      linkGithub: (userId, identity) =>
        Effect.gen(function* () {
          const other =
            yield* sql`SELECT 1 FROM app.users WHERE github_id = ${identity.id} AND id <> ${userId}`;
          if (other.length > 0) return yield* new GithubTaken();
          yield* sql`
            UPDATE app.users SET github_id = ${identity.id}, github_login = ${identity.login},
              avatar_url = ${identity.avatarUrl},
              email_verified_at = CASE WHEN email = ${identity.email} THEN coalesce(email_verified_at, now())
                                       ELSE email_verified_at END
            WHERE id = ${userId}`;
          // Their ghost merges in: the login redirects to the account from now on.
          const ghost = yield* sql`
            DELETE FROM app.profiles WHERE username = ${identity.login.toLowerCase()}
              AND kind = 'ghost' AND github_id = ${
                identity.id
              } RETURNING username`;
          if (ghost.length > 0) {
            yield* sql`INSERT INTO app.profiles (username, kind, user_id)
              VALUES (${identity.login.toLowerCase()}, 'alias', ${userId})`;
          }
          yield* sql`UPDATE app.profiles SET source = 'gist'
            WHERE user_id = ${userId} AND kind = 'account' AND stored_resume IS NULL`;
          return yield* mustFind(userId);
        }).pipe(sql.withTransaction, Effect.catchTag('SqlError', Effect.die)),
      createSession: (userId, tokenHash, expiresAt) =>
        sql`INSERT INTO app.sessions (token_hash, user_id, expires_at)
          VALUES (${tokenHash}, ${userId}, ${expiresAt})`.pipe(
          Effect.asVoid,
          Effect.orDie
        ),
      findSession: q.bySession,
      deleteSession: (tokenHash) =>
        sql`DELETE FROM app.sessions WHERE token_hash = ${tokenHash}`.pipe(
          Effect.asVoid,
          Effect.orDie
        ),
      createEmailToken: (userId, email, tokenHash, expiresAt) =>
        sql`INSERT INTO app.email_tokens (token_hash, user_id, email, expires_at)
          VALUES (${tokenHash}, ${userId}, ${email}, ${expiresAt})`.pipe(
          Effect.asVoid,
          Effect.orDie
        ),
      consumeEmailToken: (tokenHash) =>
        Effect.gen(function* () {
          const [token] = yield* sql<{ user_id: string; email: string }>`
            DELETE FROM app.email_tokens WHERE token_hash = ${tokenHash} AND expires_at > now()
            RETURNING user_id, email`;
          if (!token) return undefined;
          // Only if the address is still the one the link was sent to.
          yield* sql`UPDATE app.users SET email_verified_at = coalesce(email_verified_at, now())
            WHERE id = ${token.user_id} AND email = ${token.email}`;
          return token.user_id;
        }).pipe(sql.withTransaction, Effect.orDie),
      account: (userId) =>
        Effect.gen(function* () {
          const user = yield* findById(userId);
          const row = Option.getOrUndefined(
            yield* accountRow(userId).pipe(Effect.orDie)
          );
          if (!user || !row) return undefined;
          return {
            user,
            source: row.source,
            hasStoredResume: row.has_stored,
            hasMirror: row.has_mirror,
          };
        }),
      saveStoredResume: (userId, resume) =>
        sql`UPDATE app.profiles SET stored_resume = ${JSON.stringify(
          resume
        )}::jsonb,
            stored_at = now(), source = 'stored'
          WHERE user_id = ${userId} AND kind = 'account'`.pipe(
          Effect.asVoid,
          Effect.orDie
        ),
      setSource: (userId, source) =>
        sql`UPDATE app.profiles SET source = ${source}
          WHERE user_id = ${userId} AND kind = 'account'`.pipe(
          Effect.asVoid,
          Effect.orDie
        ),
      purgeUnverified: (before) =>
        sql<{ id: string }>`DELETE FROM app.users
          WHERE email_verified_at IS NULL AND github_id IS NULL AND created_at < ${before}
          RETURNING id`.pipe(
          Effect.map((rows) => rows.length),
          Effect.orDie
        ),
    });
  })
);

/** The account store on a migrated Postgres. */
export const PgAccountStoreLive = PgAccountStore.pipe(Layer.provide(PgLive));

export type { UserRecord };
