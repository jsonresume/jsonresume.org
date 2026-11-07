import { Context, Effect, Layer, Schema } from 'effect';
import { SqlClient, SqlError } from 'effect/sql';
import { diffResumes, sameJson, type Change } from './diff';

export const ActorKind = Schema.Literals([
  'user',
  'app',
  'assistant',
  'restore',
]);
export type ActorKind = typeof ActorKind.Type;

/**
 * Who made a version: the user (the editor, an upload), an app (an OAuth
 * client, or the API with a key), an assistant (MCP), or a restore. `id`
 * is the OAuth client id or API key id; `name` what to call it.
 */
export interface Actor {
  readonly kind: ActorKind;
  readonly id: string | null;
  readonly name: string | null;
}

/** The signed-in person, in the editor or dashboard. */
export const userActor: Actor = { kind: 'user', id: null, name: null };

const Row = Schema.Struct({
  version: Schema.Number,
  resume: Schema.Unknown,
  actor_kind: ActorKind,
  actor_id: Schema.NullOr(Schema.String),
  actor_name: Schema.NullOr(Schema.String),
  note: Schema.NullOr(Schema.String),
  created_at: Schema.Date,
});
const decodeRows = Schema.decodeUnknownEffect(Schema.Array(Row));

export interface ResumeVersion {
  version: number;
  resume: unknown;
  actor: Actor;
  note: string | null;
  createdAt: Date;
}

/** A version in a list: what changed since the one before, not the JSON. */
export interface VersionSummary extends Omit<ResumeVersion, 'resume'> {
  changes: Change[];
}

const toVersion = (row: typeof Row.Type): ResumeVersion => ({
  version: row.version,
  resume: row.resume,
  actor: { kind: row.actor_kind, id: row.actor_id, name: row.actor_name },
  note: row.note,
  createdAt: row.created_at,
});

export const MAX_PAGE = 100;

/**
 * Every save of an account's resume, append-only (app.resume_versions).
 * Database errors are defects: callers can't fix them.
 */
export class ResumeVersions extends Context.Service<
  ResumeVersions,
  Effect.Success<typeof make>
>()('@repo/resume-versions/ResumeVersions') {
  static readonly layer = Layer.effect(
    ResumeVersions,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const columns = sql`version, resume, actor_kind, actor_id, actor_name, note, created_at`;
  const query = (rows: Effect.Effect<ReadonlyArray<unknown>, unknown>) =>
    rows.pipe(
      Effect.flatMap(decodeRows),
      Effect.map((r) => r.map(toVersion)),
      Effect.orDie
    );

  const get = (userId: string, version: number) =>
    query(sql`SELECT ${columns} FROM app.resume_versions
      WHERE user_id = ${userId} AND version = ${version}`).pipe(
      Effect.map((rows) => rows[0])
    );

  const latest = (userId: string) =>
    query(sql`SELECT ${columns} FROM app.resume_versions
      WHERE user_id = ${userId} ORDER BY version DESC LIMIT 1`).pipe(
      Effect.map((rows) => rows[0])
    );

  /**
   * Keeps `resume` as the next version, unless it is the same JSON as the
   * last one: then undefined. Run it in the save's transaction, after the
   * profile's row is written (that row's lock orders concurrent saves).
   */
  const record = Effect.fn('ResumeVersions.record')(function* (
    userId: string,
    resume: unknown,
    actor: Actor,
    note: string | null = null
  ) {
    const last = yield* latest(userId);
    if (last && sameJson(last.resume, resume)) return undefined;
    const version = (last?.version ?? 0) + 1;
    yield* sql`INSERT INTO app.resume_versions
        (user_id, version, resume, actor_kind, actor_id, actor_name, note)
      VALUES (${userId}, ${version}, ${JSON.stringify(resume)}::json, ${
      actor.kind
    }, ${actor.id}, ${actor.name?.slice(0, 120) ?? null}, ${note})`.pipe(
      Effect.orDie
    );
    return { version };
  });

  /** Newest first, `limit` at a time, older than `before` when given. */
  const list = Effect.fn('ResumeVersions.list')(function* (
    userId: string,
    page: { before?: number | undefined; limit?: number | undefined }
  ) {
    const limit = Math.min(Math.max(page.limit ?? 20, 1), MAX_PAGE);
    const before = page.before ?? 2 ** 31 - 1;
    // One more than asked: the version before the page's oldest, for its diff.
    const rows = yield* query(sql`SELECT ${columns} FROM app.resume_versions
      WHERE user_id = ${userId} AND version < ${before}
      ORDER BY version DESC LIMIT ${limit + 1}`);
    const versions: VersionSummary[] = rows
      .slice(0, limit)
      .map(({ resume, ...v }, i) => ({
        ...v,
        changes: diffResumes(rows[i + 1]?.resume, resume),
      }));
    const next = rows.length > limit ? versions.at(-1)?.version ?? null : null;
    return { versions, next };
  });

  /** From one version to another; `from` 0 is an empty resume. */
  const diff = Effect.fn('ResumeVersions.diff')(function* (
    userId: string,
    from: number,
    to: number
  ) {
    const a = from === 0 ? { resume: {} } : yield* get(userId, from);
    const b = yield* get(userId, to);
    return a && b ? diffResumes(a.resume, b.resume) : undefined;
  });

  /** Runs `effect` in one transaction with the store's own writes. */
  const inTransaction = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    sql
      .withTransaction(effect)
      .pipe(Effect.catchIf(SqlError.isSqlError, (e) => Effect.die(e)));

  return { record, get, latest, list, diff, inTransaction };
});
