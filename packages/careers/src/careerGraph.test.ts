import { TestDatabase } from '@repo/database/testing';
import { embedderFrom, JobFitter, JobMatcher } from '@repo/jobs';
import { Clock, Duration, Effect, Fiber, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { CareerGraphs } from './careerGraph';
import { CareerMovesLive } from './careerMoves';
import { JobRolesLive } from './jobRoles';
import { PlanStore } from './plans';
import { ResumeInsightsLive } from './resumeInsights';
import { SkillCatalogLive } from './skills';
import { Snapshots } from './snapshots';
import { fakeReader, reading, resume } from './test/fakes';
import { posting } from './test/fixtures';

/* The models as slow as they were in production (2026-10-30 to 11-06):
   judging the jobs took 24-30s, reading a resume 18-61s. */
const FITS = Duration.seconds(28);
const READING = Duration.seconds(60);

const vector = () => {
  const v = new Float32Array(3072);
  v[0] = 1;
  return v;
};

const setup = () => {
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
  const reads = { count: 0 };
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
      Layer.mergeAll(
        TestDatabase,
        embedderFrom(vector),
        fitter,
        fakeReader(reading, reads, Effect.sleep(READING))
      )
    ),
    Layer.merge(TestClock.layer())
  );
  return { calls, reads, layer };
};

/** Some open jobs and a user; the user's id. */
const seed = Effect.gen(function* () {
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
const pass = (seconds: number) =>
  Effect.gen(function* () {
    for (let i = 0; i < seconds; i++) {
      yield* Effect.promise(() => new Promise((r) => setTimeout(r, 10)));
      yield* TestClock.adjust(Duration.seconds(1));
    }
  });

/** Runs `effect` while the clock moves; when it finished, in whole seconds. */
const timed = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  Effect.gen(function* () {
    const start = yield* Clock.currentTimeMillis;
    const fiber = yield* Effect.forkChild(
      Effect.zip(effect, Clock.currentTimeMillis)
    );
    yield* pass(90);
    const [value, end] = yield* Fiber.join(fiber);
    return { value, seconds: (end - start) / 1000 };
  });

describe('the career graph', () => {
  it('reads the resume and judges the jobs at once, not one after the other', async () => {
    const { layer } = setup();
    const first = await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        const careers = yield* CareerGraphs;
        return yield* timed(careers.graph(userId, resume));
      }).pipe(Effect.provide(layer))
    );
    // One after the other it was 28s + 40s; at once, the 40s wait.
    expect(first.seconds).toBeGreaterThanOrEqual(40);
    expect(first.seconds).toBeLessThanOrEqual(41);
    expect(first.value.pending).toBe(true);
    expect(first.value.waitingFor).toEqual(['resume']);
  });

  it('answers quickly with what is ready, and says what it still waits for', async () => {
    const { layer } = setup();
    const [quick, later] = await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        const careers = yield* CareerGraphs;
        const quick = yield* timed(
          careers.graph(userId, resume, Duration.seconds(5))
        );
        const later = yield* timed(
          careers.graph(userId, resume, Duration.seconds(5))
        );
        return [quick, later] as const;
      }).pipe(Effect.provide(layer))
    );
    expect(quick.seconds).toBeGreaterThanOrEqual(5);
    expect(quick.seconds).toBeLessThanOrEqual(6);
    expect(quick.value.waitingFor).toEqual(['resume', 'jobs']);
    // Jobs scored by embeddings in the meantime, so the tree has them.
    expect(quick.value.nodes.some((n) => n.kind === 'job')).toBe(true);
    expect(later.seconds).toBeLessThanOrEqual(1);
    expect(later.value.pending).toBe(false);
    expect(later.value.strengths).toEqual(['Platform migrations']);
  });

  it('is ready when opened if prepared when the resume was saved', async () => {
    const { layer, calls, reads } = setup();
    const opened = await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        const careers = yield* CareerGraphs;
        yield* careers.prepare(userId, resume);
        yield* pass(62);
        return yield* timed(careers.graph(userId, resume, Duration.seconds(5)));
      }).pipe(Effect.provide(layer))
    );
    expect(opened.seconds).toBeLessThanOrEqual(1);
    expect(opened.value.pending).toBe(false);
    expect(opened.value.waitingFor).toEqual([]);
    // Each model ran once, for the save.
    expect(reads.count).toBe(1);
    expect(calls.fits).toBe(1);
  });

  it('prepares nothing for an empty resume, without failing', async () => {
    const { layer, reads } = setup();
    await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        yield* (yield* CareerGraphs).prepare(userId, {});
        yield* pass(5);
      }).pipe(Effect.provide(layer))
    );
    expect(reads.count).toBe(0);
  });
});
