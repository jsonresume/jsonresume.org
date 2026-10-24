import {
  JobNotFound,
  type JobBoard as Board,
  type JobsStatus,
} from '@repo/api';
import { Context, Effect, Layer, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { decodePosting } from './posting';
import { toJob, toSummary, type JobRow } from './summary';

/** Jobs stay on the board this long: two monthly threads. */
export const OPEN_DAYS = 62;

const Row = Schema.Struct({
  id: Schema.Number,
  parsed: Schema.Unknown,
  posted_at: Schema.Date,
  family_months: Schema.Number,
});
const Full = Schema.Struct({
  ...Row.fields,
  html: Schema.String,
  author: Schema.String,
  closed: Schema.Boolean,
});
const Thread = Schema.Struct({ id: Schema.Number, first: Schema.Date });
const Run = Schema.Struct({
  started_at: Schema.Date,
  finished_at: Schema.NullOr(Schema.Date),
  ok: Schema.NullOr(Schema.Boolean),
  stats: Schema.Record(Schema.String, Schema.Number),
  error: Schema.NullOr(Schema.String),
});
const Counts = Schema.Struct({
  open: Schema.Number,
  pending: Schema.Number,
  last_success: Schema.NullOr(Schema.Date),
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

const toRow = (r: typeof Row.Type): JobRow[] =>
  Option.match(decodePosting(r.parsed), {
    onNone: () => [],
    onSome: (posting) => [
      { id: r.id, posting, postedAt: r.posted_at, months: r.family_months },
    ],
  });

const monthTitle = (d: Date) =>
  `Ask HN: Who is hiring? (${d.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })})`;

/** Open on the board: parsed, still listed, recent, and the newest of its family. */
export const openJobs = `
  j.parsed IS NOT NULL AND j.removed_at IS NULL
  AND j.posted_at >= now() - make_interval(days => ${OPEN_DAYS})
  AND NOT EXISTS (
    SELECT 1 FROM app.jobs n
    WHERE n.family_id = j.family_id AND n.posted_at > j.posted_at AND n.removed_at IS NULL
  )`;

/** What the board and job pages read. Database errors are defects. */
export class JobBoard extends Context.Service<
  JobBoard,
  Effect.Success<typeof make>
>()('@repo/jobs/JobBoard') {
  static readonly layer = Layer.effect(
    JobBoard,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const open = sql.literal(openJobs);

  const board: Effect.Effect<Board> = Effect.gen(function* () {
    const jobs = yield* sql`
      SELECT j.id::float8 AS id, j.parsed, j.posted_at, j.family_months::float8 AS family_months
      FROM app.jobs j WHERE ${open} ORDER BY j.posted_at DESC
    `.pipe(Effect.flatMap(rows(Row)));
    const [thread] = yield* sql`
      SELECT thread_id::float8 AS id, min(posted_at) AS first FROM app.jobs
      GROUP BY thread_id ORDER BY thread_id DESC LIMIT 1
    `.pipe(Effect.flatMap(rows(Thread)));
    return {
      jobs: jobs.flatMap(toRow).map(toSummary),
      thread: thread
        ? { id: thread.id, title: monthTitle(thread.first) }
        : null,
    };
  }).pipe(Effect.orDie);

  const job = (id: number) =>
    sql`
      SELECT j.id::float8 AS id, j.parsed, j.posted_at, j.family_months::float8 AS family_months,
             j.html, j.author, NOT (${open}) AS closed
      FROM app.jobs j WHERE j.id = ${id} AND j.parsed IS NOT NULL
    `.pipe(
      Effect.flatMap(rows(Full)),
      Effect.orDie,
      Effect.flatMap(([row]) => {
        const [parsed] = row ? toRow(row) : [];
        return row && parsed
          ? Effect.succeed(toJob(parsed, row))
          : Effect.fail(new JobNotFound());
      })
    );

  const status: Effect.Effect<JobsStatus> = Effect.gen(function* () {
    const [run] = yield* sql`
      SELECT started_at, finished_at, ok, stats, error FROM app.job_runs
      ORDER BY id DESC LIMIT 1
    `.pipe(Effect.flatMap(rows(Run)));
    const [counts] = yield* sql`
      SELECT (SELECT count(*) FROM app.jobs j WHERE ${open})::float8 AS open,
             (SELECT count(*) FROM app.jobs WHERE removed_at IS NULL
                AND posted_at >= now() - make_interval(days => ${OPEN_DAYS})
                AND (parsed IS NULL AND parse_attempts < 3 OR parsed IS NOT NULL AND embedding IS NULL))::float8 AS pending,
             (SELECT max(finished_at) FROM app.job_runs WHERE ok) AS last_success
    `.pipe(Effect.flatMap(rows(Counts)));
    return {
      lastRun: run
        ? {
            startedAt: run.started_at.toISOString(),
            finishedAt: run.finished_at?.toISOString() ?? null,
            ok: run.ok,
            stats: run.stats,
            error: run.error,
          }
        : null,
      lastSuccessAt: counts?.last_success?.toISOString() ?? null,
      open: counts?.open ?? 0,
      pending: counts?.pending ?? 0,
    };
  }).pipe(Effect.orDie);

  return { board, job, status };
});
