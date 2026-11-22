import { JobMark, type MarkSource, type PassReason } from '@repo/api';
import { Effect, Option, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';
import { decodePosting } from './posting';
import { toSummary } from './summary';

const MarkedRow = Schema.Struct({
  id: Schema.Number,
  parsed: Schema.Unknown,
  posted_at: Schema.Date,
  family_months: Schema.Number,
  state: JobMark,
  feedback: Schema.NullOr(Schema.String),
  updated_at: Schema.Date,
});
/** Why and where a mark was made. */
export interface MarkMeta {
  reason?: PassReason | undefined;
  source?: MarkSource | undefined;
  position?: number | undefined;
}

/** The decision a mark was made against, if one was shown. */
const Snapshot = Schema.Struct({
  verdict: Schema.NullOr(Schema.String),
  chance: Schema.NullOr(Schema.Number),
  appeal: Schema.NullOr(Schema.Number),
});

const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** What a user thinks of jobs: interested, maybe, applied, not for them. */
export const markQueries = (sql: SqlClient.SqlClient) => {
  const markOf = (userId: string, jobId: number) =>
    sql<{ state: JobMark }>`
      SELECT state FROM app.job_marks WHERE user_id = ${userId} AND job_id = ${jobId}
    `.pipe(
      Effect.map(([row]) => row?.state ?? null),
      Effect.orDie
    );

  const exists = (jobId: number) =>
    sql`SELECT id::float8 AS id FROM app.jobs WHERE id = ${jobId}`.pipe(
      Effect.map((found) => found.length > 0),
      Effect.orDie
    );

  /**
   * Marks a job (null clears it), with the note when one is given, and
   * records the mark with the decision it was made against (app.job_mark_events).
   */
  const mark = (
    userId: string,
    jobId: number,
    state: JobMark | null,
    feedback: string | null = null,
    meta: MarkMeta = {}
  ) =>
    (state === null
      ? sql`DELETE FROM app.job_marks WHERE user_id = ${userId} AND job_id = ${jobId}`
      : sql`
          INSERT INTO app.job_marks (user_id, job_id, state, feedback)
          VALUES (${userId}, ${jobId}, ${state}, ${feedback})
          ON CONFLICT (user_id, job_id) DO UPDATE SET state = EXCLUDED.state,
            feedback = coalesce(EXCLUDED.feedback, app.job_marks.feedback), updated_at = now()
        `
    ).pipe(
      Effect.andThen(
        sql`
          INSERT INTO app.job_mark_events
            (user_id, job_id, state, reason, note, source, position, verdict, chance, appeal)
          SELECT ${userId}, ${jobId}, ${state}, ${
          meta.reason ?? null
        }, ${feedback},
                 ${meta.source ?? 'jobs'}, ${
          meta.position ?? null
        }, d.verdict, d.chance, d.appeal
          FROM (SELECT 1) one
          LEFT JOIN app.job_decisions d ON d.user_id = ${userId} AND d.job_id = ${jobId}
          RETURNING verdict, chance::float8 AS chance, appeal::float8 AS appeal
        `
      ),
      Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Snapshot))),
      Effect.map(
        ([row]) => row ?? { verdict: null, chance: null, appeal: null }
      ),
      Effect.orDie
    );

  /** The jobs a user has marked, newest mark first; optionally one mark. */
  const marked = (userId: string, only: JobMark | null = null) =>
    sql`
      SELECT j.id::float8 AS id, j.parsed, j.posted_at, j.family_months::float8 AS family_months,
             m.state, m.feedback, m.updated_at
      FROM app.job_marks m JOIN app.jobs j ON j.id = m.job_id
      WHERE m.user_id = ${userId} AND j.parsed IS NOT NULL
        AND (${only}::text IS NULL OR m.state = ${only})
      ORDER BY m.updated_at DESC
    `.pipe(
      Effect.flatMap(rows(MarkedRow)),
      Effect.map((found) =>
        found.flatMap((r) =>
          Option.match(decodePosting(r.parsed), {
            onNone: () => [],
            onSome: (posting) => [
              {
                job: toSummary({
                  id: r.id,
                  posting,
                  postedAt: r.posted_at,
                  months: r.family_months,
                }),
                mark: r.state,
                feedback: r.feedback,
                markedAt: r.updated_at,
              },
            ],
          })
        )
      ),
      Effect.orDie
    );

  return { markOf, mark, marked, exists };
};
