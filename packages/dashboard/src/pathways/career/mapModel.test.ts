import type { CareerGraph, CareerNode } from '@repo/api';
import { expect, it } from 'vitest';
import { mapModel, related } from './mapModel';

const node = (
  id: string,
  kind: CareerNode['kind'],
  levels: Partial<CareerNode['levels']>,
  score: number | null = null
): CareerNode => ({
  id,
  kind,
  label: id,
  detail: null,
  tone: 'open',
  levels: {
    meaning: null,
    distance: null,
    seniority: null,
    time: null,
    ...levels,
  },
  jobId: kind === 'job' ? 1 : null,
  score,
  year: null,
});

const graph: CareerGraph = {
  nodes: [
    node('skill', 'skill', { meaning: 1, distance: 0 }),
    node('work', 'evidence', { meaning: 2, seniority: 3 }),
    node('strong job', 'job', { meaning: 5, distance: 2, seniority: 3 }, 90),
    node('weak job', 'job', { meaning: 5, distance: 4 }, 50),
  ],
  edges: [
    { from: 0, to: 1, weight: 1, why: 'Built it' },
    { from: 1, to: 2, weight: 1, why: null },
    { from: 0, to: 3, weight: 0.5, why: null },
  ],
  strengths: [],
  pending: false,
  snapshots: [],
  bands: {
    meaning: ['Foundations', 'Skills', 'Experience', '', '', 'Jobs'],
    distance: ['Skills you show', '', 'Ready now', '', 'Further'],
    seniority: ['', '', '', 'Senior'],
    time: [],
  },
  planId: null,
};

it('draws a view’s squares on its levels, and names its bands', () => {
  const model = mapModel(graph, { view: 'meaning', minFit: 0 });
  expect(model.nodes.map((n) => [n.id, n.level])).toEqual([
    ['skill', 1],
    ['work', 2],
    ['strong job', 5],
    ['weak job', 5],
  ]);
  expect(model.bands.map(model.bandLabel)).toEqual([
    'Jobs',
    'Experience',
    'Skills',
  ]);
  // The edge into "work" carries the resume's words.
  expect(model.below[1]?.[0]?.edge.why).toBe('Built it');
});

it('leaves out what a view has no level for, and jobs below the fit asked', () => {
  const seniority = mapModel(graph, { view: 'seniority', minFit: 0 });
  expect(seniority.nodes.map((n) => n.id)).toEqual(['work', 'strong job']);
  const fit = mapModel(graph, { view: 'distance', minFit: 75 });
  expect(fit.nodes.map((n) => n.id)).toEqual(['skill', 'strong job']);
});

it('picks out what a square stands on', () => {
  const model = mapModel(graph, { view: 'meaning', minFit: 0 });
  expect([...related(model, 2)].sort()).toEqual([0, 1, 2]);
  expect([...related(model, 0)].sort()).toEqual([0, 1, 3]);
});
