import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { expect, it } from 'vitest';
import { JobRolesLive } from './jobRoles';
import type { RoleRead } from './roleReader';
import { refreshArchetypes, refreshRoles } from './roleRefresh';
import { JobRoles } from './services';
import { fakeReader, insertJob, posting, TestCatalog } from './test/fixtures';

const role = (
  title: string,
  family: RoleRead['family'],
  requirements: RoleRead['requirements']
): RoleRead => ({
  title,
  family,
  seniority: 'senior',
  summary: `${title} work.`,
  requirements,
});
const req = (skill: string, need: 'required' | 'nice' = 'required') => ({
  skill,
  need,
  years: null,
});

// LiveKit-like: one post, two roles; a post the model finds no role in; a
// post the model skips.
const read = new Map<number, ReadonlyArray<RoleRead>>([
  [
    1,
    [
      role('Product Engineer', 'fullstack', [
        req('TypeScript'),
        req('Go', 'nice'),
      ]),
      role('Software Engineer, Agents', 'ai', [
        req('Python'),
        req('Python', 'nice'),
        req('TypeScript', 'nice'),
      ]),
    ],
  ],
  [2, []],
]);

const layers = (calls: { read: number[]; summarize: string[] }) =>
  Layer.mergeAll(
    JobRolesLive.pipe(Layer.provide(TestCatalog)),
    TestCatalog
  ).pipe(
    Layer.provideMerge(fakeReader(read, calls)),
    Layer.provideMerge(TestDatabase)
  );

const seed = Effect.all([
  insertJob(
    1,
    'LiveKit | Product Engineer | Software Engineer, Agents',
    posting({ salaryMax: 200_000 })
  ),
  insertJob(
    2,
    'Acme | Engineer',
    posting({ title: 'Engineer', remote: 'onsite', salaryMin: 100_000 })
  ),
  insertJob(3, 'Skipped Co | Engineer', posting()),
]);

it('stores each role in a post and what it requires, once per version', async () => {
  const calls = { read: [] as number[], summarize: [] as string[] };
  const [first, again, roles] = await Effect.runPromise(
    Effect.gen(function* () {
      yield* seed;
      const first = yield* refreshRoles();
      const again = yield* refreshRoles();
      const roles = yield* (yield* JobRoles).rolesOf([1, 2, 3]);
      return [first, again, roles] as const;
    }).pipe(Effect.provide(layers(calls)))
  );
  expect(first).toEqual({ candidates: 3, read: 2, roles: 3, failed: 0 });
  // Only the skipped post is read again.
  expect(again.candidates).toBe(1);
  expect(calls.read.filter((id) => id === 1)).toHaveLength(1);

  const livekit = roles.get(1) ?? [];
  expect(livekit.map((r) => [r.index, r.title, r.family])).toEqual([
    [0, 'Product Engineer', 'fullstack'],
    [1, 'Software Engineer, Agents', 'ai'],
  ]);
  expect(livekit[0]?.requirements.map((q) => [q.skill.name, q.need])).toEqual([
    ['TypeScript', 'required'],
    ['Go', 'nice'],
  ]);
  // One row per skill, "required" winning.
  expect(livekit[1]?.requirements.map((q) => [q.skill.name, q.need])).toEqual([
    ['Python', 'required'],
    ['TypeScript', 'nice'],
  ]);
  // No role read: the parsed posting stands in.
  expect(roles.get(2)?.map((r) => [r.title, r.family])).toEqual([
    ['Engineer', 'other_tech'],
  ]);
  expect(roles.has(3)).toBe(false);
});

it('sums up role families from the open roles', async () => {
  const calls = { read: [] as number[], summarize: [] as string[] };
  const archetypes = await Effect.runPromise(
    Effect.gen(function* () {
      yield* seed;
      yield* refreshRoles();
      const stats = yield* refreshArchetypes();
      expect(stats).toEqual({ families: 3, roles: 3 });
      return yield* (yield* JobRoles).archetypes;
    }).pipe(Effect.provide(layers(calls)))
  );
  const ai = archetypes.find((a) => a.family === 'ai');
  expect(ai).toMatchObject({
    name: 'AI and agents engineer',
    roles: 1,
    payP50: 200_000,
    remoteShare: 100,
    summary: 'AI and agents engineer: 1 roles',
  });
  expect(ai?.skills.map((s) => [s.skill.name, s.share])).toEqual([
    ['TypeScript', 1],
    ['Python', 1],
  ]);
  const other = archetypes.find((a) => a.family === 'other_tech');
  expect(other).toMatchObject({ payP50: 100_000, remoteShare: 0 });
  expect(calls.summarize).toHaveLength(3);
});
