import { Duration, Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { CareerGraphs } from './careerGraph';
import { pass, seed, setup, timed } from './test/careerStack';
import { resume } from './test/fakes';

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
        yield* careers.prepare(userId, resume, 'saved');
        // 25s for saves to settle, 60s to read.
        yield* pass(90);
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
        yield* (yield* CareerGraphs).prepare(userId, {}, 'opened');
        yield* pass(5);
      }).pipe(Effect.provide(layer))
    );
    expect(reads.count).toBe(0);
  });
});
