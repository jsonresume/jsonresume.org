import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { SkillCatalog } from './services';
import { SkillCatalogLive } from './skills';
import { FakeEmbedder } from './test/fakes';

const run = <A>(
  effect: Effect.Effect<A, never, SkillCatalog>,
  withEmbedder = true
) =>
  Effect.runPromise(
    effect.pipe(
      Effect.provide(
        SkillCatalogLive.pipe(
          Layer.provideMerge(
            withEmbedder
              ? Layer.mergeAll(TestDatabase, FakeEmbedder)
              : TestDatabase
          )
        )
      )
    )
  );

describe('the skill vocabulary', () => {
  it('folds names one skill goes by into it, and skips kinds of work', async () => {
    const [first, again, ids] = await run(
      Effect.gen(function* () {
        const catalog = yield* SkillCatalog;
        const first = yield* catalog.resolve([
          'Postgres',
          'PostgreSQL',
          'pg',
          'Backend',
          'Rust',
        ]);
        const again = yield* catalog.resolve(['POSTGRES', 'rust']);
        const ids = yield* catalog.byIds([...first.values()].map((s) => s.id));
        return [first, again, ids] as const;
      })
    );
    const pg = first.get('Postgres');
    expect(pg?.key).toBe('postgresql');
    expect(first.get('PostgreSQL')).toEqual(pg);
    expect(first.get('pg')).toEqual(pg);
    expect(first.has('Backend')).toBe(false);
    expect(again.get('POSTGRES')).toEqual(pg);
    expect(again.get('rust')).toEqual(first.get('Rust'));
    expect(new Set(ids.map((s) => s.id)).size).toBe(2);
  });

  it('finds a skill by meaning, in the database or the same batch', async () => {
    const [found, batch] = await run(
      Effect.gen(function* () {
        const catalog = yield* SkillCatalog;
        yield* catalog.resolve(['PostgreSQL']);
        const found = yield* catalog.resolve(['Postgres databases']);
        const batch = yield* catalog.resolve(['Kubernetes', 'Kube operators']);
        return [found, batch] as const;
      })
    );
    expect(found.get('Postgres databases')?.key).toBe('postgresql');
    expect(batch.get('Kube operators')).toEqual(batch.get('Kubernetes'));
  });

  it('without embeddings, a new name is a new skill', async () => {
    const found = await run(
      Effect.gen(function* () {
        const catalog = yield* SkillCatalog;
        yield* catalog.resolve(['PostgreSQL']);
        return yield* catalog.resolve(['Postgres databases', 'PostgreSQL']);
      }),
      false
    );
    expect(found.get('Postgres databases')?.key).toBe('postgres databases');
    expect(found.get('PostgreSQL')?.key).toBe('postgresql');
  });
});
