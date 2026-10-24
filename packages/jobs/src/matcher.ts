import { NoResume, type JobMark, type JobMatch } from '@repo/api';
import { Context, Duration, Effect, Layer, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { createHash } from 'node:crypto';
import { openJobs } from './board';
import { Embedder } from './embedder';
import { decodePosting } from './posting';
import { resumeText } from './resumeText';
import { toSummary, type JobRow } from './summary';
import { centroid, dot, fromBytes, normalize, toBytes } from './vectors';

const Open = Schema.Struct({
  id: Schema.Number,
  parsed: Schema.Unknown,
  posted_at: Schema.Date,
  family_months: Schema.Number,
  embedding: Schema.Uint8Array,
});
const Mark = Schema.Struct({
  job_id: Schema.Number,
  state: Schema.Literals(['interested', 'applied', 'not_interested']),
  embedding: Schema.NullOr(Schema.Uint8Array),
});
const Cached = Schema.Struct({ embedding: Schema.Uint8Array });
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** Matches returned, best first. */
export const MATCHES = 100;
/** Rocchio weights: toward jobs liked, away from jobs passed on. */
const TOWARD = 0.5;
const AWAY = 0.15;
/** Cosine between a resume and a job, as a 0 to 100 fit. */
const FLOOR = 0.2;
const CEILING = 0.65;

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
  const embedder = yield* Embedder;

  // Every open job and its vector: a few MB, read at most every 5 minutes.
  const openJobRows = yield* Effect.cachedWithTTL(
    sql`
      SELECT j.id::float8 AS id, j.parsed, j.posted_at,
             j.family_months::float8 AS family_months, j.embedding
      FROM app.jobs j WHERE ${sql.literal(openJobs)} AND j.embedding IS NOT NULL
    `.pipe(
      Effect.flatMap(rows(Open)),
      Effect.map((open) =>
        open.flatMap((r) =>
          Option.match(decodePosting(r.parsed), {
            onNone: () => [],
            onSome: (posting) => [
              {
                row: {
                  id: r.id,
                  posting,
                  postedAt: r.posted_at,
                  months: r.family_months,
                } satisfies JobRow,
                vector: fromBytes(r.embedding),
              },
            ],
          })
        )
      ),
      Effect.orDie
    ),
    Duration.minutes(5)
  );

  /** A resume's vector, embedded once per distinct text. */
  const resumeVector = Effect.fn('JobMatcher.resumeVector')(function* (
    text: string
  ) {
    const hash = createHash('sha256').update(text).digest('hex');
    const [cached] = yield* sql`
      SELECT embedding FROM app.embeddings WHERE text_hash = ${hash}
    `.pipe(Effect.flatMap(rows(Cached)), Effect.orDie);
    if (cached) return fromBytes(cached.embedding);
    const vector = yield* embedder.embed(text).pipe(Effect.orDie);
    yield* sql`
      INSERT INTO app.embeddings (text_hash, embedding) VALUES (${hash}, ${toBytes(
      vector
    )})
      ON CONFLICT (text_hash) DO NOTHING
    `.pipe(Effect.orDie);
    return vector;
  });

  const marksOf = (userId: string) =>
    sql`
      SELECT m.job_id::float8 AS job_id, m.state, j.embedding
      FROM app.job_marks m JOIN app.jobs j ON j.id = m.job_id
      WHERE m.user_id = ${userId}
    `.pipe(Effect.flatMap(rows(Mark)), Effect.orDie);

  const matches = Effect.fn('JobMatcher.matches')(function* (
    userId: string,
    resume: unknown
  ) {
    const text = resumeText(resume);
    if (text.length < 20) return yield* new NoResume();
    const marks = yield* marksOf(userId);
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
    const open = yield* openJobRows;
    return open
      .map(({ row, vector }) => ({ row, cosine: dot(query, vector) }))
      .sort((a, b) => b.cosine - a.cosine)
      .slice(0, MATCHES)
      .map(
        ({ row, cosine }): JobMatch => ({
          ...toSummary(row),
          score: fitScore(cosine),
          mark: markOf.get(row.id) ?? null,
        })
      );
  });

  const exists = (jobId: number) =>
    sql`SELECT id::float8 AS id FROM app.jobs WHERE id = ${jobId}`.pipe(
      Effect.map((found) => found.length > 0),
      Effect.orDie
    );

  const mark = (userId: string, jobId: number, state: JobMark | null) =>
    (state === null
      ? sql`DELETE FROM app.job_marks WHERE user_id = ${userId} AND job_id = ${jobId}`
      : sql`
          INSERT INTO app.job_marks (user_id, job_id, state) VALUES (${userId}, ${jobId}, ${state})
          ON CONFLICT (user_id, job_id) DO UPDATE SET state = EXCLUDED.state, updated_at = now()
        `
    ).pipe(Effect.asVoid, Effect.orDie);

  return { matches, mark, exists };
});
