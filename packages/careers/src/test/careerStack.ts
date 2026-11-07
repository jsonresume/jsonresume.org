import { TestDatabase } from '@repo/database/testing';
import { embedderFrom, JobFitter, JobMatcher } from '@repo/jobs';
import { Clock, Duration, Effect, Fiber, Layer, Predicate } from 'effect';
import { SqlClient } from 'effect/sql';
import { TestClock } from 'effect/testing';
import { CareerGraphs } from '../careerGraph';
import { CareerMovesLive } from '../careerMoves';
import { InsightReader } from '../insightReader';
import { JobRolesLive } from '../jobRoles';
import { PlanStore } from '../plans';
import { ResumeInsightsLive } from '../resumeInsights';
import { SkillCatalogLive } from '../skills';
import { Snapshots } from '../snapshots';
import { reading } from './fakes';
import { posting } from './fixtures';

/* CareerGraphs on PGlite with slow fake models and a test clock, for
   timing what waits on what. */

/** basics.name, which tells the test's resume versions apart. */
export const nameOf = (r: unknown) => {
  const basics = Predicate.isObject(r) ? r['basics'] : undefined;
  const name = Predicate.isObject(basics) ? basics['name'] : undefined;
  return typeof name === 'string' ? name : '';
};

/* The models as slow as they were in production (2026-10-30 to 11-06):
   judging the jobs took 24-30s, reading a resume 18-61s. */
export const FITS = Duration.seconds(28);
export const READING = Duration.seconds(60);

const vector = () => {
  const v = new Float32Array(3072);
  v[0] = 1;
  return v;
};

export const setup = () => {
  const calls = { reads: 0, fits: 0 };
  const fitter = Layer.succeed(
    JobFitter,
    JobFitter.of({
      fit: (_, jobs) =>
        Effect.sync(() => void (calls.fits += 1)).pipe(
          Effect.andThen(Effect.sleep(FITS)),
          Effect.as(
            jobs.map((j) => ({ id: j.id, score: 80, role: 'Eng', why: 'Fits' }))
          )
        ),
    })
  );
  // What the reader was asked to read (by name), and what it finished.
  const reads = { count: 0, started: [] as string[], finished: [] as string[] };
  const reader = Layer.succeed(
    InsightReader,
    InsightReader.of({
      read: (r) =>
        Effect.gen(function* () {
          const name = nameOf(r);
          reads.count += 1;
          reads.started.push(name);
          yield* Effect.sleep(READING);
          reads.finished.push(name);
          return reading;
        }),
    })
  );
  const layer = CareerGraphs.layer.pipe(
    Layer.provideMerge(
      Layer.mergeAll(
        ResumeInsightsLive,
        JobRolesLive,
        CareerMovesLive,
        PlanStore.layer,
        Snapshots.layer,
        JobMatcher.layer
      )
    ),
    Layer.provideMerge(SkillCatalogLive),
    Layer.provideMerge(
      Layer.mergeAll(TestDatabase, embedderFrom(vector), fitter, reader)
    ),
    Layer.merge(TestClock.layer())
  );
  return { calls, reads, layer };
};

/** Some open jobs and a user; the user's id. */
export const seed = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  for (let id = 1; id <= 12; id++) {
    yield* sql`
      INSERT INTO app.jobs (id, thread_id, author, html, posted_at, parsed, parsed_at, embedding)
      VALUES (${id}, 1, 'hn', ${`Platform engineer ${id}: Kubernetes, Rust`},
              now() - interval '1 day',
              ${JSON.stringify(posting({ company: `Co ${id}` }))}::jsonb,
              now(), ${new Uint8Array(vector().buffer)})`;
  }
  const [user] = yield* sql<{ id: string }>`
    INSERT INTO app.users (email) VALUES ('ada@example.com') RETURNING id`;
  return user?.id ?? '';
});

/**
 * Moves the test clock a second at a time, letting the database (real
 * time, not the test clock's) answer in between.
 */
export const pass = (seconds: number) =>
  Effect.gen(function* () {
    for (let i = 0; i < seconds; i++) {
      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 10)));
      yield* TestClock.adjust(Duration.seconds(1));
    }
  });

/** Runs `effect` while the clock moves; when it finished, in whole seconds. */
export const timed = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.gen(function* () {
    const start = yield* Clock.currentTimeMillis;
    const fiber = yield* Effect.forkChild(
      Effect.zip(effect, Clock.currentTimeMillis)
    );
    yield* pass(90);
    const [value, end] = yield* Fiber.join(fiber);
    return { value, seconds: (end - start) / 1000 };
  });
