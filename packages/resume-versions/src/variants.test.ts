import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { slugOf, Variants } from './variants';

const layer = Variants.layer.pipe(Layer.provideMerge(TestDatabase));
const run = <A, E>(e: Effect.Effect<A, E, Variants | SqlClient.SqlClient>) =>
  Effect.runPromise(e.pipe(Effect.provide(layer)));

describe('Variants', () => {
  it('names slugs from names, unique per person, never timeline', async () => {
    expect(slugOf('Acme — Senior Engineer!')).toBe('acme-senior-engineer');
    expect(slugOf('???')).toBe('variant');
    const result = await run(
      Effect.gen(function* () {
        const sql = yield* SqlClient.SqlClient;
        const [user] = yield* sql<{ id: string }>`
          INSERT INTO app.users (email) VALUES ('ada@example.com') RETURNING id`;
        const id = user?.id ?? '';
        const variants = yield* Variants;
        const a = yield* variants.create(id, {
          name: 'Acme',
          resume: { basics: { name: 'Ada' } },
          jobId: 42,
        });
        const b = yield* variants.create(id, { name: 'acme', resume: {} });
        const t = yield* variants.create(id, { name: 'Timeline', resume: {} });
        const saved = yield* variants.save(id, 'acme', {
          basics: { name: 'Ada for Acme' },
        });
        const missing = yield* Effect.flip(variants.save(id, 'nope', {}));
        const removed = yield* variants.remove(id, 'acme-2');
        const left = (yield* variants.list(id)).map((v) => v.slug).sort();
        return { a, b, t, saved, missing, removed, left };
      })
    );
    expect(result.a).toMatchObject({ slug: 'acme', name: 'Acme', jobId: 42 });
    expect(result.b.slug).toBe('acme-2');
    expect(result.t.slug).toBe('timeline-1');
    expect(result.saved.resume).toEqual({ basics: { name: 'Ada for Acme' } });
    expect(result.missing).toEqual({ reason: 'No such variant' });
    expect(result.removed).toBe(true);
    expect(result.left).toEqual(['acme', 'timeline-1']);
  });
});
