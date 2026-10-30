import type { CareerTree } from '@repo/api';
import { expect, it } from 'vitest';
import { related, treeModel } from './treeModel';

const node = (
  id: string,
  kind: CareerTree['nodes'][number]['kind']
): CareerTree['nodes'][number] => ({
  id,
  kind,
  label: id,
  detail: null,
  tone: kind === 'gap' ? 'attention' : 'success',
  jobId: kind === 'job' ? 1 : null,
  score: null,
});

// TypeScript and Go (missing) under a job; TypeScript under Acme, under a
// kind of role, under the job.
const tree: CareerTree = {
  nodes: [
    node('skill:ts', 'skill'),
    node('skill:go', 'gap'),
    node('experience:0', 'experience'),
    node('direction:ai', 'direction'),
    node('job:1', 'job'),
  ],
  edges: [
    { from: 0, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 0, to: 4 },
    { from: 1, to: 4 },
  ],
};

it('places skills at the bottom and jobs on top, bands named for them', () => {
  const model = treeModel(tree);
  const level = (i: number) => model.nodes[i]?.level ?? -1;
  expect(level(0)).toBe(0);
  expect(level(4)).toBeGreaterThan(level(3));
  expect(level(3)).toBeGreaterThan(level(2));
  const names = model.bands.map(model.bandLabel);
  expect(names).toContain('Skills');
  expect(names).toContain('Jobs');
  expect(names).toContain('Kinds of role');
});

it('picks out what a job stands on, and what rests on a skill', () => {
  const model = treeModel(tree);
  expect([...related(model, 4)].sort()).toEqual([0, 1, 2, 3, 4]);
  // A skill: itself and what rests on it directly, not the whole way up.
  expect([...related(model, 1)].sort()).toEqual([1, 4]);
  expect([...related(model, 0)].sort()).toEqual([0, 2, 4]);
});
