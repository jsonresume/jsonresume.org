import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { expect, it } from 'vitest';
import { PgProfileStore } from './sql';
import { ProfileStore } from './store';

it('keeps a gist resume holding NUL characters, which jsonb refuses, without them', async () => {
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
});
