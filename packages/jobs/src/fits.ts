import { Duration, Effect, Fiber, Option, Predicate, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { createHash } from 'node:crypto';
import { FIT_VERSION, JobFitter, type Fit, type FitJob } from './fitter';

const Cached = Schema.Struct({
  job_id: Schema.Number,
  score: Schema.Number,
  role: Schema.String,
  why: Schema.String,
});
const rows = Schema.decodeUnknownEffect(Schema.Array(Cached));

/** How long a request waits for new fits before answering without them. */
const WAIT = Duration.seconds(40);

/** The resume as the fitter reads it: everything but references and meta. */
export const candidateText = (resume: unknown) => {
  const rest = Predicate.isObject(resume)
    ? Object.fromEntries(
        Object.entries(resume).filter(
          ([k]) => k !== 'references' && k !== 'meta'
        )
      )
    : {};
  return `Candidate (JSON Resume):\n${JSON.stringify(rest).slice(0, 30_000)}`;
};

/**
 * The model's fits of jobs to a resume, kept by resume and job so each pair
 * is judged once: a changed resume, or a new job, is judged on next use.
 * Without a JobFitter (no OpenAI key) there are none.
 */
export const fitStore = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const fitter = yield* Effect.serviceOption(JobFitter);
  // One judging run per resume at a time, shared by concurrent requests.
  const running = new Map<string, Fiber.Fiber<void>>();

  const cached = (key: string, ids: ReadonlyArray<number>) =>
    sql`
      SELECT job_id::float8 AS job_id, score::float8 AS score, role, why
      FROM app.job_fits WHERE resume_key = ${key} AND job_id IN ${sql.in(ids)}
    `.pipe(
      Effect.flatMap(rows),
      Effect.map((found) => new Map(found.map((f) => [f.job_id, f]))),
      Effect.orDie
    );

  const save = (key: string, fits: ReadonlyArray<Fit>) =>
    Effect.forEach(
      fits,
      (f) => sql`
        INSERT INTO app.job_fits (resume_key, job_id, score, role, why)
        VALUES (${key}, ${f.id}, ${Math.max(
        0,
        Math.min(100, Math.round(f.score))
      )},
                ${f.role.slice(0, 200)}, ${f.why.slice(0, 300)})
        ON CONFLICT (resume_key, job_id) DO NOTHING
      `,
      { discard: true }
    ).pipe(
      Effect.andThen(
        sql`DELETE FROM app.job_fits WHERE created_at < now() - interval '60 days'`
      ),
      Effect.asVoid,
      Effect.orDie
    );

  const judge = (key: string, candidate: string, jobs: ReadonlyArray<FitJob>) =>
    Option.match(fitter, {
      onNone: () => Effect.void,
      onSome: (f) =>
        f.fit(candidate, jobs).pipe(
          Effect.flatMap((fits) => save(key, fits)),
          Effect.catchTag('FitFailed', (e) =>
            Effect.logWarning('Job fits failed', { error: e.message })
          )
        ),
    });

  /**
   * Fits of these jobs to the resume: those already judged, plus new ones
   * if the model answers within WAIT (it keeps going after, for next time).
   */
  const fitsFor = Effect.fn('JobMatcher.fits')(function* (
    resume: unknown,
    jobs: ReadonlyArray<FitJob>
  ) {
    if (jobs.length === 0) return new Map<number, typeof Cached.Type>();
    const candidate = candidateText(resume);
    const key = createHash('sha256')
      .update(`${FIT_VERSION}\n${candidate}`)
      .digest('hex');
    const ids = jobs.map((j) => j.id);
    const have = yield* cached(key, ids);
    const missing = jobs.filter((j) => !have.has(j.id));
    if (missing.length === 0 || Option.isNone(fitter)) return have;
    let fiber = running.get(key);
    if (!fiber) {
      const started = yield* judge(key, candidate, missing).pipe(
        Effect.ensuring(Effect.sync(() => running.delete(key))),
        Effect.forkDetach
      );
      running.set(key, started);
      fiber = started;
    }
    yield* Fiber.join(fiber).pipe(Effect.timeoutOption(WAIT));
    return yield* cached(key, ids);
  });

  return { fitsFor };
});
