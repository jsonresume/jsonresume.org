import { Duration, Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { CareerGraphs } from './careerGraph';
import { pass, seed, setup, timed } from './test/careerStack';
import { resume } from './test/fakes';

/** The test resume, as version `n` (its name tells them apart). */
const version = (n: number) => ({
  ...resume,
  basics: { ...resume.basics, name: `Ada v${n}` },
});

describe('preparing the tree when resumes are saved', () => {
  it('reads only the last of a burst of saves, once', async () => {
    const { layer, reads, calls } = setup();
    await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        const careers = yield* CareerGraphs;
        // Five saves in nine seconds, like an agent's update_resume_section.
        for (let n = 1; n <= 5; n++) {
          yield* careers.prepare(userId, version(n), 'saved');
          yield* pass(2);
        }
        yield* pass(120);
      }).pipe(Effect.provide(layer))
    );
    expect(reads.started).toEqual(['Ada v5']);
    expect(reads.finished).toEqual(['Ada v5']);
    expect(calls.fits).toBe(1);
  });

  it('stops the model calls for a version a newer save replaces', async () => {
    const { layer, reads } = setup();
    await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        const careers = yield* CareerGraphs;
        yield* careers.prepare(userId, version(1), 'saved');
        // Settled, and reading v1 for ten seconds.
        yield* pass(35);
        yield* careers.prepare(userId, version(2), 'saved');
        yield* pass(120);
      }).pipe(Effect.provide(layer))
    );
    expect(reads.started).toEqual(['Ada v1', 'Ada v2']);
    expect(reads.finished).toEqual(['Ada v2']);
  });

  it('changes nothing when the same version is saved again, or the dashboard opens', async () => {
    const { layer, reads, calls } = setup();
    await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        const careers = yield* CareerGraphs;
        yield* careers.prepare(userId, version(1), 'saved');
        yield* pass(30);
        yield* careers.prepare(userId, version(1), 'saved');
        // The dashboard opens on a stale read: the save's work goes on.
        yield* careers.prepare(userId, version(0), 'opened');
        yield* careers.prepare(userId, version(1), 'opened');
        yield* pass(120);
        // Read and judged: opening the dashboard again starts nothing.
        yield* careers.prepare(userId, version(1), 'opened');
        yield* pass(5);
      }).pipe(Effect.provide(layer))
    );
    expect(reads.started).toEqual(['Ada v1']);
    expect(calls.fits).toBe(1);
  });

  it('a graph asked for while a prepare reads joins it, and the reverse', async () => {
    const { layer, reads, calls } = setup();
    const [during, after] = await Effect.runPromise(
      Effect.gen(function* () {
        const userId = yield* seed;
        const careers = yield* CareerGraphs;
        // The dashboard opens: work starts at once.
        yield* careers.prepare(userId, version(1), 'opened');
        yield* pass(10);
        const during = yield* timed(
          careers.graph(userId, version(1), Duration.seconds(5))
        );
        const after = yield* careers.graph(userId, version(1), 5_000);
        // The Tree opened first, then a save of the same version.
        yield* timed(careers.graph(userId, version(2), Duration.seconds(5)));
        yield* careers.prepare(userId, version(2), 'saved');
        yield* pass(120);
        return [during, after] as const;
      }).pipe(Effect.provide(layer))
    );
    expect(during.value.pending).toBe(true);
    expect(after.pending).toBe(false);
    expect(reads.started).toEqual(['Ada v1', 'Ada v2']);
    expect(calls.fits).toBe(2);
  });
});
