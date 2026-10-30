import { TestDatabase } from '@repo/database/testing';
import { Duration, Effect, Fiber, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { ResumeInsightsLive } from './resumeInsights';
import { ResumeInsights } from './services';
import { SkillCatalogLive } from './skills';
import { fakeReader, FakeEmbedder, reading, resume } from './test/fakes';

const layer = (reader?: Layer.Layer<never> | ReturnType<typeof fakeReader>) =>
  ResumeInsightsLive.pipe(
    Layer.provide(SkillCatalogLive),
    Layer.provideMerge(
      Layer.mergeAll(TestDatabase, FakeEmbedder, reader ?? Layer.empty)
    )
  );

const insightOf = (r: unknown) =>
  Effect.gen(function* () {
    return yield* (yield* ResumeInsights).insight(r);
  });

describe('resume insights', () => {
  it('reads a resume once per version: evidence with quotes, strengths, roles', async () => {
    const calls = { count: 0 };
    const [first, again, changed] = await Effect.runPromise(
      Effect.gen(function* () {
        const first = yield* insightOf(resume);
        const again = yield* insightOf(resume);
        const changed = yield* insightOf({
          ...resume,
          basics: { name: 'Ada L' },
        });
        return [first, again, changed] as const;
      }).pipe(Effect.provide(layer(fakeReader(reading, calls))))
    );
    expect(calls.count).toBe(2);
    expect(again).toEqual(first);
    expect(changed.key).not.toBe(first.key);
    expect(first.pending).toBe(false);
    expect(first.level).toBe('staff_plus');
    const k8s = first.evidence.find((e) => e.skill.key === 'kubernetes');
    expect(k8s).toMatchObject({
      entry: 'work:0',
      strength: 3,
      lastYear: new Date().getUTCFullYear(),
      quote: 'Led the move of every service to Kubernetes.',
    });
    // Rust ended with Initech, in 2021.
    expect(first.evidence.find((e) => e.skill.key === 'rust')?.lastYear).toBe(
      2021
    );
    // Listed but shown nowhere: evidence on the skills section.
    expect(first.evidence.find((e) => e.skill.key === 'erlang')).toMatchObject({
      entry: 'skills',
      quote: 'Backend: Erlang',
    });
    expect(first.strengths).toEqual([
      expect.objectContaining({
        name: 'Platform migrations',
        skills: expect.arrayContaining([k8s?.skill.id]),
      }),
    ]);
    const roles = Object.fromEntries(
      first.entries.map((e) => [e.key, [e.family, e.seniority]])
    );
    expect(roles['work:0']).toEqual(['platform', 'staff_plus']);
    // An unknown family is no family.
    expect(roles['projects:0']).toEqual([null, null]);
    expect(first.foundations).toHaveLength(3);
  });

  it('answers without the reading while it is still running', async () => {
    const calls = { count: 0 };
    const [early, later] = await Effect.runPromise(
      Effect.gen(function* () {
        const waiting = yield* Effect.forkChild(insightOf(resume));
        yield* TestClock.adjust(Duration.seconds(41));
        const early = yield* Fiber.join(waiting);
        yield* TestClock.adjust(Duration.minutes(2));
        const later = yield* insightOf(resume);
        return [early, later] as const;
      }).pipe(
        Effect.provide(
          Layer.merge(
            layer(
              fakeReader(reading, calls, Effect.sleep(Duration.minutes(1)))
            ),
            TestClock.layer()
          )
        )
      )
    );
    expect(early.pending).toBe(true);
    expect(early.strengths).toEqual([]);
    expect(early.evidence.length).toBeGreaterThan(0);
    expect(later.pending).toBe(false);
    expect(later.strengths).toHaveLength(1);
    expect(calls.count).toBe(1);
  });

  it('without a reader, matches the skills list to the entries that name them', async () => {
    const insight = await Effect.runPromise(
      insightOf(resume).pipe(Effect.provide(layer()))
    );
    expect(insight.pending).toBe(false);
    expect(insight.strengths).toEqual([]);
    const rust = insight.evidence.find((e) => e.skill.key === 'rust');
    expect(rust).toMatchObject({
      entry: 'work:1',
      strength: 1,
      quote: 'Wrote Rust services for payments.',
    });
    expect(
      insight.evidence.find((e) => e.skill.key === 'kubernetes')?.entry
    ).toBe('work:0');
    expect(insight.evidence.find((e) => e.skill.key === 'erlang')?.entry).toBe(
      'skills'
    );
  });
});
