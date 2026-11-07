import { Duration, Effect, Fiber } from 'effect';
import { TestClock } from 'effect/testing';
import { expect, it } from 'vitest';
import { sharedRuns } from './sharedRuns';

const run = <A, E>(effect: Effect.Effect<A, E>) =>
  Effect.runPromise(effect.pipe(Effect.provide(TestClock.layer())));

/** Work that takes a minute and counts its starts and finishes. */
const counted = () => {
  const count = { started: 0, finished: 0 };
  const work = Effect.sync(() => void (count.started += 1)).pipe(
    Effect.andThen(Effect.sleep(Duration.minutes(1))),
    Effect.andThen(Effect.sync(() => void (count.finished += 1)))
  );
  return { count, work };
};

it('runs once per key while it runs: later callers join it', async () => {
  const { count, work } = counted();
  const states = await run(
    Effect.gen(function* () {
      const runs = sharedRuns();
      const early = yield* runs.run('k', work, { wait: 0 });
      // A caller that stopped waiting left the run going.
      const joined = yield* Effect.forkChild(
        runs.run('k', work, { wait: Duration.minutes(5) })
      );
      yield* TestClock.adjust(Duration.minutes(1));
      const later = yield* Fiber.join(joined);
      // Finished: the next caller starts a new run.
      const again = yield* runs.run('k', work, { wait: 0 });
      yield* TestClock.adjust(Duration.seconds(1));
      return [early, later, again];
    })
  );
  expect(states).toEqual(['running', 'done', 'running']);
  expect(count).toEqual({ started: 2, finished: 1 });
});

it('stops an owned run with its owner, and tells those joining it', async () => {
  const { count, work } = counted();
  const joined = await run(
    Effect.gen(function* () {
      const runs = sharedRuns();
      const owner = yield* Effect.forkChild(
        runs.run('k', work, { wait: Duration.infinity, owned: true })
      );
      yield* TestClock.adjust(Duration.seconds(1));
      const other = yield* Effect.forkChild(
        runs.run('k', work, { wait: Duration.minutes(5) })
      );
      yield* TestClock.adjust(Duration.seconds(1));
      yield* Fiber.interrupt(owner);
      return yield* Fiber.join(other);
    })
  );
  expect(joined).toBe('stopped');
  expect(count).toEqual({ started: 1, finished: 0 });
});
