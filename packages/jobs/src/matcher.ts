import { JobMark, NoResume, type JobMatch } from '@repo/api';
import { Clock, Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { resumeCountry } from './eligibility';
import { fitStore } from './fits';
import { resumeLevel } from './level';
import { markQueries } from './marks';
import { matchData } from './matchData';
import { finish, POOL, retrieve } from './ranking';
import { resumeText } from './resumeText';
import { toSummary } from './summary';
import { centroid, fromBytes, normalize } from './vectors';

export { fitScore, type Ranked } from './ranking';

const Mark = Schema.Struct({
  job_id: Schema.Number,
  state: JobMark,
  embedding: Schema.NullOr(Schema.Uint8Array),
});
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** Matches the dashboard shows, best first. */
export const MATCHES = 100;

/** Rocchio weights: toward jobs liked, away from jobs passed on. */
const TOWARD = 0.5;
const AWAY = 0.15;

/**
 * Open jobs ranked against a resume. Embeddings find the jobs worth a look
 * among those the candidate can take (their country, from the resume); a
 * model then judges each post against the resume, its best role and why;
 * pay, level and place cap the score; the user's marks nudge the order.
 */
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
  const { fitsFor } = yield* fitStore;

  const marksOf = (userId: string) =>
    sql`
      SELECT m.job_id::float8 AS job_id, m.state, j.embedding
      FROM app.job_marks m JOIN app.jobs j ON j.id = m.job_id
      WHERE m.user_id = ${userId}
    `.pipe(Effect.flatMap(rows(Mark)), Effect.orDie);

  /**
   * Every open job the candidate could take, best fit first, with the
   * user's marks. The model judges jobs only for a signed-in user: a
   * resume sent to the public API is ranked by embeddings alone.
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
    const retrieved = retrieve(
      yield* openJobRows,
      base,
      query,
      resumeCountry(resume)
    );
    const fits = userId
      ? yield* fitsFor(
          resume,
          retrieved.slice(0, POOL).map(({ job }) => ({
            id: job.row.id,
            company: job.row.posting.company,
            text: job.text,
          }))
        )
      : new Map();
    const level = resumeLevel(resume, yield* Clock.currentTimeMillis);
    return finish(
      retrieved,
      fits,
      level,
      new Map(marks.map((m) => [m.job_id, m.state]))
    );
  });

  /** The best MATCHES jobs for the dashboard. */
  const matches = (userId: string, resume: unknown) =>
    rank(resume, userId).pipe(
      Effect.map((ranked) =>
        ranked.slice(0, MATCHES).map(
          ({ row, score, mark, role, why }): JobMatch => ({
            ...toSummary(row),
            score,
            mark,
            role,
            why,
          })
        )
      )
    );

  return { rank, matches, ...markQueries(sql) };
});
