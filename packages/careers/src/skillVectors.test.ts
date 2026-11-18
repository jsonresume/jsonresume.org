import { embedderFrom } from '@repo/jobs';
import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { expect, it } from 'vitest';
import { SkillCatalog } from './services';
import { SkillCatalogLive } from './skills';
import { embedSkills } from './skillVectors';

/** A vector per first word: "Agent harness" means "Agent harnesses". */
const embedder = embedderFrom((text) => {
  const v = new Float32Array(300);
  const stem = text.toLowerCase().split(' ')[0] ?? '';
  let h = 0;
  for (const c of stem) h = (h * 31 + c.charCodeAt(0)) % 256;
  v[h] = 1;
  return v;
});

it('embeds skills stored without a vector, so later names meet them by meaning', async () => {
  const result = await Effect.runPromise(
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;
      yield* sql`
        INSERT INTO app.skills (key, name) VALUES
          ('agent harnesses', 'Agent harnesses'),
          ('5+ years experience', '5+ years experience')
      `;
      const first = yield* embedSkills();
      const again = yield* embedSkills();
      const vectors = yield* sql<{ key: string; has: boolean }>`
        SELECT key, embedding IS NOT NULL AS has FROM app.skills ORDER BY key
      `;
      const met = yield* (yield* SkillCatalog).resolve(['Agent Harness']);
      return { first, again, vectors, met: met.get('Agent Harness')?.key };
    }).pipe(
      Effect.provide(
        SkillCatalogLive.pipe(
          Layer.provideMerge(Layer.mergeAll(TestDatabase, embedder))
        )
      )
    )
  );
  expect(result.first).toEqual({ embedded: 1, notSkills: 1 });
  expect(result.again).toEqual({ embedded: 0, notSkills: 1 });
  // A qualification never becomes something to match.
  expect(result.vectors).toEqual([
    { key: '5+ years experience', has: false },
    { key: 'agent harnesses', has: true },
  ]);
  expect(result.met).toBe('agent harnesses');
});
