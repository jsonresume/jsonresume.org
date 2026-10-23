import { PgLive } from '@repo/database';
import { Effect, Layer, Option, Schema } from 'effect';
import { SqlClient, SqlSchema } from 'effect/sql';
import { ProfileStore, type GistMirror, type Profile } from './store';

const Row = Schema.Struct({
  username: Schema.String,
  kind: Schema.Literals(['ghost', 'account', 'alias']),
  github_id: Schema.NullOr(Schema.Number),
  gist_id: Schema.NullOr(Schema.String),
  resume: Schema.Unknown,
  fetched_at: Schema.NullOr(Schema.Date),
  source: Schema.Literals(['gist', 'stored']),
  stored_resume: Schema.Unknown,
  user_id: Schema.NullOr(Schema.String),
  verified: Schema.Boolean,
  github_login: Schema.NullOr(Schema.String),
  target: Schema.NullOr(Schema.String),
});
type Row = typeof Row.Type;

const mirrorOf = (row: Row): GistMirror | undefined =>
  row.github_id !== null && row.gist_id !== null && row.fetched_at !== null
    ? {
        githubId: row.github_id,
        gistId: row.gist_id,
        resume: row.resume,
        fetchedAt: row.fetched_at,
      }
    : undefined;

const toProfile = (row: Row): Profile | undefined => {
  switch (row.kind) {
    case 'ghost': {
      const mirror = mirrorOf(row);
      return mirror && { kind: 'ghost', username: row.username, ...mirror };
    }
    case 'alias':
      return row.target === null
        ? undefined
        : { kind: 'alias', username: row.username, target: row.target };
    case 'account':
      return row.user_id === null
        ? undefined
        : {
            kind: 'account',
            username: row.username,
            userId: row.user_id,
            verified: row.verified,
            githubLogin: row.github_login ?? undefined,
            source: row.source,
            mirror: mirrorOf(row),
            stored: row.stored_resume,
          };
  }
};

/** ProfileStore on Postgres. Database errors are defects: callers can't fix them. */
export const PgProfileStore = Layer.effect(
  ProfileStore,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    // An account's verification and GitHub login live on its user; an
    // alias points at the username of its user's account.
    const findOne = SqlSchema.findOneOption({
      Request: Schema.String,
      Result: Row,
      execute: (username) => sql`
        SELECT p.username, p.kind, p.github_id::float8 AS github_id, p.gist_id,
               p.resume, p.fetched_at, p.source, p.stored_resume, p.user_id,
               (u.email_verified_at IS NOT NULL OR u.github_id IS NOT NULL) AS verified,
               u.github_login, a.username AS target
        FROM app.profiles p
        LEFT JOIN app.users u ON u.id = p.user_id
        LEFT JOIN app.profiles a ON p.kind = 'alias' AND a.user_id = p.user_id AND a.kind = 'account'
        WHERE p.username = ${username}`,
    });
    return ProfileStore.of({
      find: (username) =>
        findOne(username).pipe(
          Effect.map((row) =>
            Option.isSome(row) ? toProfile(row.value) : undefined
          ),
          Effect.orDie
        ),
      saveGhost: (ghost) =>
        sql`
          INSERT INTO app.profiles (username, kind, github_id, gist_id, resume, fetched_at)
          VALUES (${ghost.username}, 'ghost', ${ghost.githubId}, ${
          ghost.gistId
        },
                  ${JSON.stringify(ghost.resume)}::jsonb, ${ghost.fetchedAt})
          ON CONFLICT (username) DO UPDATE SET
            github_id = EXCLUDED.github_id, gist_id = EXCLUDED.gist_id,
            resume = EXCLUDED.resume, fetched_at = EXCLUDED.fetched_at
          WHERE app.profiles.kind = 'ghost'
        `.pipe(Effect.asVoid, Effect.orDie),
      removeGhost: (username) =>
        sql`DELETE FROM app.profiles WHERE username = ${username} AND kind = 'ghost'`.pipe(
          Effect.asVoid,
          Effect.orDie
        ),
      saveMirror: (username, mirror) =>
        sql`
          UPDATE app.profiles SET github_id = ${mirror.githubId}, gist_id = ${
          mirror.gistId
        },
            resume = ${JSON.stringify(mirror.resume)}::jsonb, fetched_at = ${
          mirror.fetchedAt
        }
          WHERE username = ${username} AND kind = 'account'
        `.pipe(Effect.asVoid, Effect.orDie),
    });
  })
);

/** The profile store on a migrated Postgres. */
export const PgProfileStoreLive = PgProfileStore.pipe(Layer.provide(PgLive));
