import type { Ranked } from '@repo/jobs';
import { expect, it } from 'vitest';
import type { ResumeInsight, Skill } from '../services';
import { buildGraph } from './build';
import type { GraphInputs, GraphJob } from './inputs';

const skill = (id: number, name: string): Skill => ({
  id,
  key: name.toLowerCase(),
  name,
});
const TS = skill(1, 'TypeScript');
const PG = skill(2, 'PostgreSQL');
const K8S = skill(3, 'Kubernetes');
const RUST = skill(4, 'Rust');

const insight: ResumeInsight = {
  key: 'k',
  level: 'staff_plus',
  pending: false,
  entries: [
    {
      key: 'work:0',
      section: 'work',
      label: 'Acme',
      detail: 'Staff Engineer',
      startYear: 2021,
      endYear: null,
      family: 'backend',
      seniority: 'staff_plus',
    },
    {
      key: 'work:1',
      section: 'work',
      label: 'Beta',
      detail: 'Developer',
      startYear: 2015,
      endYear: 2020,
      family: 'fullstack',
      seniority: 'mid',
    },
    {
      key: 'education:0',
      section: 'education',
      label: 'UQ',
      detail: 'Software Engineering',
      startYear: 2008,
      endYear: 2009,
      family: null,
      seniority: null,
    },
  ],
  evidence: [
    {
      entry: 'work:0',
      skill: TS,
      strength: 3,
      lastYear: null,
      quote: 'Built TypeScript services',
    },
    {
      entry: 'work:0',
      skill: PG,
      strength: 2,
      lastYear: null,
      quote: 'on PostgreSQL',
    },
    {
      entry: 'work:1',
      skill: RUST,
      strength: 1,
      lastYear: 2020,
      quote: 'some Rust',
    },
  ],
  strengths: [
    {
      name: 'Backend systems',
      summary: 'Ships backend systems',
      entries: ['work:0'],
      skills: [1, 2],
    },
  ],
  foundations: [
    {
      key: 'education:0',
      kind: 'education',
      label: 'UQ',
      detail: 'Software Engineering',
    },
  ],
};

const ranked = (id: number, score: number): Ranked => ({
  row: {
    id,
    posting: {
      title: 'Engineer',
      company: `Co ${id}`,
      seniority: 'senior',
    } as Ranked['row']['posting'],
    postedAt: new Date(),
    months: 1,
  },
  cosine: 0.5,
  order: 0.5,
  score,
  mark: null,
  eligible: 'yes',
  role: null,
  why: null,
  limits: [],
});
const job = (
  id: number,
  score: number,
  reqs: Array<[Skill, 'required' | 'nice']>
): GraphJob => ({
  ranked: ranked(id, score),
  role: null,
  family: 'backend',
  requirements: reqs.map(([s, need]) => ({ skill: s, need, years: null })),
});

const input: GraphInputs = {
  insight,
  jobs: [
    job(10, 90, [
      [TS, 'required'],
      [PG, 'required'],
    ]),
    job(11, 80, [
      [TS, 'required'],
      [K8S, 'required'],
    ]),
    job(12, 60, [
      [K8S, 'required'],
      [skill(5, 'Go'), 'required'],
      [TS, 'nice'],
    ]),
  ],
  archetypes: [],
  destinations: [
    {
      family: 'eng_manager',
      name: 'Engineering manager',
      seniority: 'lead_management',
      people: 40,
      share: 23,
      medianYears: 4,
    },
  ],
  plan: {
    id: 'p',
    family: 'eng_manager',
    steps: [
      {
        id: 's1',
        kind: 'skill',
        title: 'Run a Kubernetes cluster',
        detail: 'For Bode',
        skillId: 3,
        jobId: 11,
        done: false,
      },
    ],
  },
  year: 2026,
};

it('places every square on its level in each view', () => {
  const graph = buildGraph(input);
  const at = (id: string) => graph.nodes.find((n) => n.id === id);
  expect(at('foundation:education:0')?.levels.meaning).toBe(0);
  expect(at('skill:1')?.levels).toMatchObject({ meaning: 1, distance: 0 });
  expect(at('gap:3')).toMatchObject({ kind: 'gap', tone: 'attention' });
  // Go is asked once: not enough to show as a gap.
  expect(at('gap:5')).toBeUndefined();
  expect(at('evidence:work:0')?.levels).toMatchObject({
    meaning: 2,
    seniority: 4,
  });
  expect(at('strength:0')?.levels.meaning).toBe(3);
  expect(at('direction:backend')?.levels.meaning).toBe(4);
  // By how many required skills you don't show yet.
  expect(at('job:10')?.levels.distance).toBe(2);
  expect(at('job:11')?.levels.distance).toBe(3);
  expect(at('job:12')?.levels.distance).toBe(4);
  expect(at('job:10')?.tone).toBe('success');
  expect(at('destination:eng_manager:lead_management')?.levels.meaning).toBe(6);
  expect(at('step:s1')?.levels).toMatchObject({ meaning: 2, distance: 1 });
  // Time: from 2008 in two-year spans; the 2021 role five spans in.
  expect(at('evidence:work:0')?.levels.time).toBe(6);
  expect(graph.bands.time.at(-1)).toBe('Next');
});

it('rests things on what holds them up, with the resume’s words', () => {
  const graph = buildGraph(input);
  const index = new Map(graph.nodes.map((n, i) => [n.id, i]));
  const edge = (from: string, to: string) =>
    graph.edges.find(
      (e) => e.from === index.get(from) && e.to === index.get(to)
    );
  expect(edge('skill:1', 'evidence:work:0')).toMatchObject({
    weight: 1,
    why: 'Built TypeScript services',
  });
  // Old and light evidence counts for less.
  expect(edge('skill:4', 'evidence:work:1')?.weight).toBeLessThan(0.4);
  expect(edge('evidence:work:0', 'direction:backend')).toBeDefined();
  expect(edge('gap:3', 'step:s1')).toBeDefined();
  expect(edge('step:s1', 'job:11')).toBeDefined();
  expect(
    edge('evidence:work:0', 'destination:eng_manager:lead_management')
  ).toBeDefined();
  expect(graph.planId).toBe('p');
  expect(graph.strengths).toEqual(['Backend systems']);
});
