import { Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import type { Posting } from './posting';
import { runs } from './runs';

/** A top-level comment in a "Who is hiring?" thread. */
export interface NewPost {
  id: number;
  threadId: number;
  author: string;
  html: string;
  postedAt: Date;
}

/** A job already parsed, for embedding and repost families. */
export interface ParsedRow {
  id: number;
  parsed: unknown;
  postedAt: Date;
}

const Ids = Schema.Array(Schema.Struct({ id: Schema.Number }));
const ToParse = Schema.Array(
  Schema.Struct({ id: Schema.Number, html: Schema.String })
);
const Parsed = Schema.Array(
  Schema.Struct({
    id: Schema.Number,
    parsed: Schema.Unknown,
    posted_at: Schema.Date,
  })
);
const WithVector = Schema.Array(
  Schema.Struct({
    id: Schema.Number,
    company: Schema.String,
    posted_at: Schema.Date,
    embedding: Schema.Uint8Array,
  })
);
const decode = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(schema);

/** How many times a post may fail to parse before it is left alone. */
export const MAX_PARSE_ATTEMPTS = 3;

/** The pipeline's writes to app.jobs and app.job_runs. Database errors are defects. */
export class JobStore extends Context.Service<
  JobStore,
  Effect.Success<typeof make>
>()('@repo/jobs/JobStore') {
  static readonly layer = Layer.effect(
    JobStore,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  /** Adds posts not seen before; the number added. */
  const addPosts = (posts: ReadonlyArray<NewPost>) =>
    posts.length === 0
      ? Effect.succeed(0)
      : sql`
          INSERT INTO app.jobs ${sql.insert(
            posts.map((p) => ({
              id: p.id,
              thread_id: p.threadId,
              author: p.author,
              html: p.html,
              posted_at: p.postedAt,
            }))
          )}
          ON CONFLICT (id) DO NOTHING
          RETURNING id::float8 AS id
        `.pipe(
          Effect.flatMap(decode(Ids)),
          Effect.map((rows) => rows.length),
          Effect.orDie
        );

  /** Posts of a thread that HN no longer lists (deleted or killed) leave the board. */
  const markRemoved = (threadId: number, live: ReadonlyArray<number>) =>
    sql`
      UPDATE app.jobs SET removed_at = now()
      WHERE thread_id = ${threadId} AND removed_at IS NULL
        AND id NOT IN (
          SELECT jsonb_array_elements_text(${JSON.stringify(
            live
          )}::jsonb)::bigint)
      RETURNING id::float8 AS id
    `.pipe(
      Effect.flatMap(decode(Ids)),
      Effect.map((rows) => rows.length),
      Effect.orDie
    );

  /** Posts of a thread still on the board. */
  const threadSize = (threadId: number) =>
    sql`
      SELECT count(*)::float8 AS id FROM app.jobs
      WHERE thread_id = ${threadId} AND removed_at IS NULL
    `.pipe(
      Effect.flatMap(decode(Ids)),
      Effect.map((rows) => rows[0]?.id ?? 0),
      Effect.orDie
    );

  /**
   * Posts to parse: new ones, or with `parsedBefore` (a prompt changed) also
   * those parsed before that time, which stay on the board meanwhile.
   */
  const toParse = (limit: number, since: Date, parsedBefore?: Date) =>
    sql`
      SELECT id::float8 AS id, html FROM app.jobs
      WHERE removed_at IS NULL AND parse_attempts < ${MAX_PARSE_ATTEMPTS}
        AND posted_at >= ${since}
        AND (parsed IS NULL OR parsed_at < ${parsedBefore ?? new Date(0)})
      ORDER BY posted_at DESC LIMIT ${limit}
    `.pipe(Effect.flatMap(decode(ToParse)), Effect.orDie);

  const saveParsed = (id: number, posting: Posting) =>
    sql`
      UPDATE app.jobs SET parsed = ${JSON.stringify(posting).replace(
        /\\u0000/g,
        ''
      )}::jsonb,
        parsed_at = now(), parse_attempts = 0, parse_error = NULL,
        embedding = NULL
      WHERE id = ${id}
    `.pipe(Effect.asVoid, Effect.orDie);

  /** Not a job (someone looking for work, a comment): never parsed again. */
  const notAJob = (id: number) =>
    sql`
      UPDATE app.jobs SET parse_attempts = ${MAX_PARSE_ATTEMPTS},
        parse_error = 'not a job post', parsed = NULL, embedding = NULL
      WHERE id = ${id}
    `.pipe(Effect.asVoid, Effect.orDie);

  const parseFailed = (id: number, error: string) =>
    sql`
      UPDATE app.jobs SET parse_attempts = parse_attempts + 1,
        parse_error = ${error.slice(0, 500)}
      WHERE id = ${id}
    `.pipe(Effect.asVoid, Effect.orDie);

  const toEmbed = (limit: number, since: Date) =>
    sql`
      SELECT id::float8 AS id, parsed, posted_at FROM app.jobs
      WHERE parsed IS NOT NULL AND embedding IS NULL AND posted_at >= ${since}
      ORDER BY posted_at DESC LIMIT ${limit}
    `.pipe(
      Effect.flatMap(decode(Parsed)),
      Effect.map((rows): ParsedRow[] =>
        rows.map((r) => ({ id: r.id, parsed: r.parsed, postedAt: r.posted_at }))
      ),
      Effect.orDie
    );

  const saveEmbedding = (id: number, embedding: Uint8Array) =>
    sql`UPDATE app.jobs SET embedding = ${embedding} WHERE id = ${id}`.pipe(
      Effect.asVoid,
      Effect.orDie
    );

  /** Embedded jobs since a date, with their company, for repost families. */
  const withVectors = (since: Date) =>
    sql`
      SELECT id::float8 AS id, parsed->>'company' AS company, posted_at, embedding
      FROM app.jobs
      WHERE embedding IS NOT NULL AND posted_at >= ${since}
    `.pipe(Effect.flatMap(decode(WithVector)), Effect.orDie);

  const saveFamilies = (
    families: ReadonlyArray<{ id: number; familyId: number; months: number }>
  ) =>
    families.length === 0
      ? Effect.void
      : sql`
          UPDATE app.jobs j SET family_id = f.family_id, family_months = f.months
          FROM jsonb_to_recordset(${JSON.stringify(
            families.map((f) => ({
              id: f.id,
              family_id: f.familyId,
              months: f.months,
            }))
          )}::jsonb) AS f(id bigint, family_id bigint, months smallint)
          WHERE j.id = f.id
        `.pipe(Effect.asVoid, Effect.orDie);

  return {
    addPosts,
    markRemoved,
    threadSize,
    toParse,
    saveParsed,
    parseFailed,
    notAJob,
    toEmbed,
    saveEmbedding,
    withVectors,
    saveFamilies,
    ...runs(sql),
  };
});
