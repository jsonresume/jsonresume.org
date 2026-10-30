import { expect, it } from 'vitest';
import { careerTree } from './careerTree';
import type { Ranked } from './ranking';
import { posting } from './test/fixtures';
import { treeDigest } from './treeDigest';

const job = (
  id: number,
  title: string,
  score: number,
  skills: string[],
  role: string | null = null
): Ranked => ({
  row: {
    id,
    posting: posting({
      title,
      company: `Co ${id}`,
      skills: skills.map((name) => ({ name, keywords: [] })),
    }),
    postedAt: new Date('2026-10-01'),
    months: 1,
  },
  cosine: 0.5,
  order: 0.5,
  score,
  mark: null,
  eligible: 'yes',
  role,
  why: null,
  limits: [],
});

const resume = {
  skills: [{ name: 'Backend', keywords: ['TypeScript', 'Postgres', 'Rust'] }],
  work: [
    {
      name: 'Acme',
      position: 'Staff Engineer',
      highlights: ['Built TypeScript services on PostgreSQL and Rust'],
    },
  ],
  projects: [{ name: 'Toy', description: 'A Haskell toy' }],
};

const ranked = [
  job(1, 'AI Engineer', 92, ['TypeScript', 'Kubernetes', 'PostgreSQL']),
  job(
    2,
    'Product Engineer',
    75,
    ['TypeScript', 'Kubernetes'],
    'Software Engineer, Agents'
  ),
  job(3, 'Rust Engineer', 40, ['Rust']),
];

it('rests jobs on kinds of role, experience and skills, with the gaps', () => {
  const tree = careerTree(ranked, resume);
  const byId = new Map(tree.nodes.map((n, i) => [n.id, i]));
  const has = (from: string, to: string) =>
    tree.edges.some((e) => e.from === byId.get(from) && e.to === byId.get(to));

  // Below the least fit, left out.
  expect(byId.has('job:3')).toBe(false);
  // The role that fits names the kind of role, not the post's title.
  expect(has('direction:AI and machine learning', 'job:1')).toBe(true);
  expect(has('direction:Software engineering', 'job:2')).toBe(true);
  expect(byId.has('direction:Full-stack and product engineering')).toBe(false);
  // "Postgres" on the resume is the PostgreSQL the job asks for.
  expect(has('skill:postgresql', 'job:1')).toBe(true);
  expect(has('skill:typescript', 'experience:0')).toBe(true);
  expect(has('experience:0', 'direction:AI and machine learning')).toBe(true);
  // A project sharing no skills isn't evidence.
  expect(byId.has('experience:1')).toBe(false);
  // Asked for by both jobs, missing from the resume: a gap.
  expect(tree.nodes[byId.get('skill:kubernetes') ?? -1]).toMatchObject({
    kind: 'gap',
    tone: 'attention',
  });
  expect(tree.nodes[byId.get('job:1') ?? -1]?.tone).toBe('success');
  expect(tree.nodes[byId.get('job:2') ?? -1]?.tone).toBe('closable');
});

it('says in words what holds the most up and what would open the most', () => {
  const digest = treeDigest(careerTree(ranked, resume));
  expect(digest.strengths[0]).toEqual({
    name: 'TypeScript',
    onResume: true,
    jobs: 2,
  });
  expect(digest.gaps).toEqual([
    { name: 'Kubernetes', onResume: false, jobs: 2 },
  ]);
  expect(digest.directions[0]).toMatchObject({
    name: 'AI and machine learning',
    evidence: ['Acme'],
  });
  expect(digest.directions[0]?.jobs.map((j) => j.id)).toEqual([1]);
});
