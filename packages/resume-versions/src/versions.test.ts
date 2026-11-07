import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { ResumeVersions, userActor, type Actor } from './versions';

const layer = ResumeVersions.layer.pipe(Layer.provideMerge(TestDatabase));
const run = <A, E>(
  effect: Effect.Effect<A, E, ResumeVersions | SqlClient.SqlClient>
) => Effect.runPromise(effect.pipe(Effect.provide(layer)));

const newUser = (email: string) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const [row] = yield* sql<{
      id: string;
    }>`INSERT INTO app.users (email) VALUES (${email}) RETURNING id`;
    return row?.id ?? '';
  });

const claude: Actor = { kind: 'assistant', id: 'jrc_1', name: 'Claude' };

describe('ResumeVersions', () => {
  it('numbers saves, skips unchanged ones, and keeps who made each', async () => {
    const result = await run(
      Effect.gen(function* () {
        const versions = yield* ResumeVersions;
        const id = yield* newUser('ada@example.com');
        const first = yield* versions.record(
          id,
          { basics: { name: 'Ada' } },
          userActor
        );
        const same = yield* versions.record(
          id,
          { basics: { name: 'Ada' } },
          claude
        );
        const second = yield* versions.record(
          id,
          { basics: { name: 'Ada' }, skills: [{ name: 'Go' }] },
          claude
        );
        const page = yield* versions.list(id, {});
        return { first, same, second, page };
      })
    );
    expect(result.first).toEqual({ version: 1 });
    expect(result.same).toBeUndefined();
    expect(result.second).toEqual({ version: 2 });
    expect(result.page.next).toBeNull();
    expect(
      result.page.versions.map((v) => [v.version, v.actor, v.changes])
    ).toEqual([
      [2, claude, [{ path: 'skills', kind: 'added' }]],
      [1, userActor, [{ path: 'basics', kind: 'added' }]],
    ]);
  });

  it('gives back the exact JSON, key order included', async () => {
    const resume = { work: [], basics: { name: 'Ada', label: 'x' }, meta: {} };
    const found = await run(
      Effect.gen(function* () {
        const versions = yield* ResumeVersions;
        const id = yield* newUser('ada@example.com');
        yield* versions.record(id, resume, userActor);
        return yield* versions.get(id, 1);
      })
    );
    expect(JSON.stringify(found?.resume)).toBe(JSON.stringify(resume));
  });

  it('pages newest first, with each oldest diffed against the one before', async () => {
    const result = await run(
      Effect.gen(function* () {
        const versions = yield* ResumeVersions;
        const id = yield* newUser('ada@example.com');
        for (const n of [1, 2, 3, 4, 5])
          yield* versions.record(
            id,
            { basics: { name: `Ada ${n}` } },
            userActor
          );
        const one = yield* versions.list(id, { limit: 2 });
        const two = yield* versions.list(id, {
          limit: 2,
          before: one.next ?? 0,
        });
        const three = yield* versions.list(id, {
          limit: 2,
          before: two.next ?? 0,
        });
        return { one, two, three };
      })
    );
    const numbers = (p: typeof result.one) => p.versions.map((v) => v.version);
    expect([
      numbers(result.one),
      numbers(result.two),
      numbers(result.three),
    ]).toEqual([[5, 4], [3, 2], [1]]);
    expect([result.one.next, result.two.next, result.three.next]).toEqual([
      4,
      2,
      null,
    ]);
    expect(result.two.versions[1]?.changes).toEqual([
      { path: 'basics.name', kind: 'changed' },
    ]);
  });

  it('keeps each account to its own versions, and diffs any two', async () => {
    const result = await run(
      Effect.gen(function* () {
        const versions = yield* ResumeVersions;
        const ada = yield* newUser('ada@example.com');
        const bob = yield* newUser('bob@example.com');
        yield* versions.record(ada, { basics: { name: 'Ada' } }, userActor);
        yield* versions.record(ada, { basics: { name: 'Ada L' } }, userActor);
        return {
          bobs: yield* versions.list(bob, {}),
          bobGets: yield* versions.get(bob, 1),
          diff: yield* versions.diff(ada, 0, 2),
          missing: yield* versions.diff(ada, 1, 9),
        };
      })
    );
    expect(result.bobs.versions).toEqual([]);
    expect(result.bobGets).toBeUndefined();
    expect(result.diff).toEqual([{ path: 'basics', kind: 'added' }]);
    expect(result.missing).toBeUndefined();
  });

  it('writes nothing when the transaction fails', async () => {
    const count = await run(
      Effect.gen(function* () {
        const versions = yield* ResumeVersions;
        const id = yield* newUser('ada@example.com');
        yield* versions
          .inTransaction(
            versions
              .record(id, { basics: { name: 'Ada' } }, userActor)
              .pipe(Effect.andThen(Effect.fail('boom')))
          )
          .pipe(Effect.ignore);
        return (yield* versions.list(id, {})).versions.length;
      })
    );
    expect(count).toBe(0);
  });
});
