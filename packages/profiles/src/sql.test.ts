import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { expect, it } from 'vitest';
import { PgProfileStore } from './sql';
import { ProfileStore } from './store';

it(
  'keeps a gist resume holding NUL characters, which jsonb refuses, without them',
  { timeout: 30_000 },
  async () => {
    const found = await Effect.runPromise(
      Effect.gen(function* () {
        const store = yield* ProfileStore;
        yield* store.saveGhost({
          username: 'nul',
          githubId: 1,
          gistId: 'g',
          resume: {
            basics: { name: 'Nul' },
            courses: ['Protocol Buffers \u0000'],
          },
          fetchedAt: new Date(0),
        });
        return yield* store.find('nul');
      }).pipe(
        Effect.provide(PgProfileStore.pipe(Layer.provideMerge(TestDatabase)))
      )
    );
    expect(found).toMatchObject({
      kind: 'ghost',
      resume: { courses: ['Protocol Buffers '] },
    });
  }
);

it(
  'keeps when the gist last changed, and forgets it with the gist',
  { timeout: 30_000 },
  async () => {
    const updatedAt = new Date(Date.UTC(2025, 4, 1));
    const found = await Effect.runPromise(
      Effect.gen(function* () {
        const store = yield* ProfileStore;
        const mirror = {
          githubId: 1,
          gistId: 'g',
          resume: {},
          fetchedAt: new Date(0),
        };
        yield* store.saveGhost({ username: 'dated', ...mirror, updatedAt });
        const dated = yield* store.find('dated');
        yield* store.saveGhost({ username: 'dated', ...mirror });
        return { dated, undated: yield* store.find('dated') };
      }).pipe(
        Effect.provide(PgProfileStore.pipe(Layer.provideMerge(TestDatabase)))
      )
    );
    expect(found.dated).toMatchObject({ kind: 'ghost', updatedAt });
    expect(found.undated).not.toHaveProperty('updatedAt');
  }
);
