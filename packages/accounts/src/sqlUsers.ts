import { Effect, Schema } from 'effect';
import { SqlClient, type Statement } from 'effect/sql';
import type { UserRecord } from './store';

const UserRow = Schema.Struct({
  id: Schema.String,
  username: Schema.String,
  email: Schema.NullOr(Schema.String),
  email_verified: Schema.Boolean,
  github_id: Schema.NullOr(Schema.Number),
  github_login: Schema.NullOr(Schema.String),
  avatar_url: Schema.NullOr(Schema.String),
  password_hash: Schema.NullOr(Schema.String),
});
type UserRow = typeof UserRow.Type;
const decodeRows = Schema.decodeUnknownEffect(Schema.Array(UserRow));

const toUser = (row: UserRow): UserRecord => ({
  id: row.id,
  username: row.username,
  email: row.email,
  emailVerified: row.email_verified,
  githubId: row.github_id,
  githubLogin: row.github_login,
  avatarUrl: row.avatar_url,
});

/** Lookups of a user with the username their account holds. */
export const userQueries = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const first = (where: Statement.Fragment) =>
    sql`
      SELECT u.id, p.username, u.email, u.email_verified_at IS NOT NULL AS email_verified,
             u.github_id::float8 AS github_id, u.github_login, u.avatar_url, u.password_hash
      FROM app.users u JOIN app.profiles p ON p.user_id = u.id AND p.kind = 'account'
      WHERE ${where}`.pipe(
      Effect.flatMap(decodeRows),
      Effect.map((rows) => rows[0]),
      Effect.orDie
    );
  const user = (where: Statement.Fragment) =>
    first(where).pipe(Effect.map((row) => (row ? toUser(row) : undefined)));

  return {
    byEmail: (email: string) =>
      first(sql`u.email = ${email}`).pipe(
        Effect.map(
          (row) => row && { user: toUser(row), passwordHash: row.password_hash }
        )
      ),
    byId: (id: string) => user(sql`u.id = ${id}`),
    byGithubId: (id: number) => user(sql`u.github_id = ${id}`),
    bySession: (hash: string) =>
      user(
        sql`u.id = (SELECT user_id FROM app.sessions WHERE token_hash = ${hash} AND expires_at > now())`
      ),
  };
});
