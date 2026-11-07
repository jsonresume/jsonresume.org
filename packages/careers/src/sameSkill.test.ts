import { TestDatabase } from '@repo/database/testing';
import type { Ranked } from '@repo/jobs';
import { Effect, Layer } from 'effect';
import { expect, it } from 'vitest';
import { gather } from './gather';
import { buildGraph } from './graph/build';
import { PlanStore } from './plans';
import { ResumeInsightsLive } from './resumeInsights';
import { JobRoles, ResumeInsights, SkillCatalog } from './services';
import { SkillCatalogLive } from './skills';
import { posting } from './test/fixtures';
import { memorySkills, noMoves } from './testing';

/* End to end without models: a resume's skills section, read as evidence
   and resolved through the skill vocabulary, meets a job whose role
   requires skills written another way. */

const resume = {
  basics: { name: 'Ada' },
  work: [
    {
      name: 'Acme',
      position: 'Data Engineer',
      startDate: '2020-01-01',
      highlights: ['Trained ML models in python.', 'Wrote React dashboards.'],
    },
  ],
  skills: [{ name: 'Data', keywords: ['ML', 'python', 'react', 'Java'] }],
};

/** Job 10's one role requires these, as its post wrote them. */
const ASKS = ['Machine Learning', 'Python', 'REACT', 'JavaScript'];

const roles = Layer.effect(
  JobRoles,
  Effect.gen(function* () {
    const catalog = yield* SkillCatalog;
    return JobRoles.of({
      rolesOf: () =>
        Effect.map(catalog.resolve(ASKS), (skills) => {
          const requirements = ASKS.flatMap((name) => {
            const skill = skills.get(name);
            return skill
              ? [{ skill, need: 'required' as const, years: null }]
              : [];
          });
          return new Map([
            [
              10,
              [
                {
                  jobId: 10,
                  index: 0,
                  title: 'ML Engineer',
                  family: 'ai' as const,
                  seniority: 'senior' as const,
                  summary: '',
                  requirements,
                },
              ],
            ],
          ]);
        }),
      archetypes: Effect.succeed([]),
    });
  })
);

const ranked: Ranked = {
  row: {
    id: 10,
    posting: posting({ title: 'ML Engineer' }),
    postedAt: new Date(),
    months: 1,
  },
  cosine: 0.8,
  order: 0.8,
  score: 90,
  mark: null,
  eligible: 'yes',
  role: null,
  why: null,
  limits: [],
};

it('a resume saying "ML" meets a job requiring "Machine Learning": no gap', async () => {
  const graph = await Effect.runPromise(
    ResumeInsights.use((insights) => insights.insight(resume)).pipe(
      Effect.flatMap((insight) =>
        gather('00000000-0000-0000-0000-000000000000', insight, [ranked], 2026)
      ),
      Effect.map(buildGraph),
      Effect.provide(
        Layer.mergeAll(
          ResumeInsightsLive,
          roles,
          PlanStore.layer,
          noMoves
        ).pipe(
          Layer.provideMerge(SkillCatalogLive),
          Layer.provideMerge(TestDatabase)
        )
      )
    )
  );
  const labels = (kind: string) =>
    graph.nodes.filter((n) => n.kind === kind).map((n) => n.label);
  // Shown under their known names, each once.
  expect(labels('skill').sort()).toEqual([
    'Java',
    'Machine Learning',
    'Python',
    'React',
  ]);
  // Java is not JavaScript: that is all the job still asks for.
  expect(labels('gap')).toEqual(['JavaScript']);
  expect(graph.nodes.find((n) => n.id === 'job:10')?.detail).toContain(
    '1 required skill to show'
  );
});

it('the in-memory catalog tests use reads names the same way', async () => {
  const found = await Effect.runPromise(
    Effect.gen(function* () {
      return yield* (yield* SkillCatalog).resolve([
        'ML',
        'machine learning',
        'REACT',
        'react.js',
        'C',
        'C++',
      ]);
    }).pipe(Effect.provide(memorySkills()))
  );
  expect(found.get('ML')).toEqual(found.get('machine learning'));
  expect(found.get('ML')?.name).toBe('Machine Learning');
  expect(found.get('REACT')).toEqual(found.get('react.js'));
  expect(found.get('REACT')?.name).toBe('React');
  expect(found.get('C')).not.toEqual(found.get('C++'));
});
