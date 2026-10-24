import { JobMark, NoResume, type JobMatch } from '@repo/api';
import { Context, Effect, Layer, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { matchData } from './matchData';
import { decodePosting } from './posting';
import { resumeText } from './resumeText';
import { toSummary, type JobRow } from './summary';
import { centroid, dot, fromBytes, normalize } from './vectors';

const Mark = Schema.Struct({
  job_id: Schema.Number,
  state: JobMark,
  embedding: Schema.NullOr(Schema.Uint8Array),
});
const MarkedRow = Schema.Struct({
  id: Schema.Number,
  parsed: Schema.Unknown,
  posted_at: Schema.Date,
  family_months: Schema.Number,
  state: JobMark,
  feedback: Schema.NullOr(Schema.String),
  updated_at: Schema.Date,
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** Matches the dashboard shows, best first. */
export const MATCHES = 100;

/** An open job against a resume: the cosine, as a 0 to 100 fit, and the user's mark. */
export interface Ranked {
  row: JobRow;
  cosine: number;
  score: number;
  mark: JobMark | null;
}
/** Rocchio weights: toward jobs liked, away from jobs passed on. */
const TOWARD = 0.5;
const AWAY = 0.15;
/**
 * Cosine between a resume and a job, as a 0 to 100 fit. Measured on the
 * October 2026 board: a resume's best jobs sit near 0.6, its 50th near 0.5.
 */
const FLOOR = 0.35;
const CEILING = 0.62;

export const fitScore = (cosine: number) =>
  Math.round(
    100 * Math.min(1, Math.max(0, (cosine - FLOOR) / (CEILING - FLOOR)))
  );

/** Open jobs ranked against a resume, nudged by the user's marks. */
export class JobMatcher extends Context.Service<
  JobMatcher,
  Effect.Success<typeof make>
>()('@repo/jobs/JobMatcher') {
  static readonly layer = Layer.effect(
    JobMatcher,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const { openJobRows, resumeVector } = yield* matchData;

  const marksOf = (userId: string) =>
    sql`
      SELECT m.job_id::float8 AS job_id, m.state, j.embedding
      FROM app.job_marks m JOIN app.jobs j ON j.id = m.job_id
      WHERE m.user_id = ${userId}
    `.pipe(Effect.flatMap(rows(Mark)), Effect.orDie);

  /**
   * Every open job, best fit first, with the user's marks. Without a user
   * (a resume sent to the public API) there are no marks to learn from.
   */
  const rank = Effect.fn('JobMatcher.rank')(function* (
    resume: unknown,
    userId?: string
  ) {
    const text = resumeText(resume);
    if (text.length < 20) return yield* new NoResume();
    const marks = userId ? yield* marksOf(userId) : [];
    const vectors = (states: ReadonlyArray<JobMark>) =>
      marks.flatMap((m) =>
        states.includes(m.state) && m.embedding ? [fromBytes(m.embedding)] : []
      );
    const liked = centroid(vectors(['interested', 'applied']));
    const passed = centroid(vectors(['not_interested']));
    const base = yield* resumeVector(text);
    const query = normalize(
      base.map(
        (v, i) =>
          v +
          (liked ? TOWARD * (liked[i] ?? 0) : 0) -
          (passed ? AWAY * (passed[i] ?? 0) : 0)
      )
    );
    const markOf = new Map(marks.map((m) => [m.job_id, m.state]));
    return (yield* openJobRows)
      .map(({ row, vector }): Ranked => {
        const cosine = dot(query, vector);
        return {
          row,
          cosine,
          score: fitScore(cosine),
          mark: markOf.get(row.id) ?? null,
        };
      })
      .sort((a, b) => b.cosine - a.cosine);
  });

  /** The best MATCHES jobs for the dashboard. */
  const matches = (userId: string, resume: unknown) =>
    rank(resume, userId).pipe(
      Effect.map((ranked) =>
        ranked.slice(0, MATCHES).map(
          ({ row, score, mark }): JobMatch => ({
            ...toSummary(row),
            score,
            mark,
          })
        )
      )
    );

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

  /** Marks a job (null clears it), with the reason when one is given. */
  const mark = (
    userId: string,
    jobId: number,
    state: JobMark | null,
    feedback: string | null = null
  ) =>
    (state === null
      ? sql`DELETE FROM app.job_marks WHERE user_id = ${userId} AND job_id = ${jobId}`
      : sql`
          INSERT INTO app.job_marks (user_id, job_id, state, feedback)
          VALUES (${userId}, ${jobId}, ${state}, ${feedback})
          ON CONFLICT (user_id, job_id) DO UPDATE SET state = EXCLUDED.state,
            feedback = coalesce(EXCLUDED.feedback, app.job_marks.feedback), updated_at = now()
        `
    ).pipe(Effect.asVoid, Effect.orDie);

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

  return { rank, matches, markOf, mark, marked, exists };
});
