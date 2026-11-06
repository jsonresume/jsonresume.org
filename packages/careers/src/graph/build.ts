import type { CareerGraph } from '@repo/api';
import { buildNext } from './buildNext';
import { buildOpen } from './buildOpen';
import { buildYou } from './buildYou';
import { draft } from './draft';
import type { GraphInputs } from './inputs';

const MEANING = [
  'Foundations',
  'Skills',
  'Experience and evidence',
  'Strengths',
  'Kinds of role',
  'Jobs open now',
  'Where people like you go next',
];
const DISTANCE = [
  'Skills you show',
  'Skills to show',
  'Ready now',
  'One step away',
  'Two or more steps away',
  'Where people like you go next',
];
const SENIORITY = [
  'Intern',
  'Junior',
  'Mid-level',
  'Senior',
  'Staff and principal',
  'Lead and management',
];

/**
 * The career graph: every square once, with its level in each view.
 * Meaning: foundations, skills (and the missing ones the jobs need),
 * evidence, strengths, kinds of role, jobs, where people go next.
 * Distance: skills, then jobs by how many required skills you don't show
 * yet. Seniority: experience, jobs and destinations by level. Time: your
 * experience by when it began, then what's open, then what's next.
 */
export const buildGraph = (
  input: GraphInputs
): Omit<CareerGraph, 'pending' | 'snapshots'> => {
  const g = draft();
  const you = buildYou(g, input);
  const open = buildOpen(g, input, you);
  buildNext(g, input, you, open);

  // A kind of role with nothing under it rests on the skills its jobs use
  // that you show, so it still sits above them.
  const { nodes, edges } = g.done();
  nodes.forEach((n, i) => {
    if (n.kind !== 'direction' || edges.some((e) => e.to === i)) return;
    const jobs = edges.filter((e) => e.from === i).map((e) => e.to);
    const under = edges
      .filter((e) => jobs.includes(e.to) && nodes[e.from]?.kind === 'skill')
      .map((e) => e.from);
    for (const s of [...new Set(under)].slice(0, 3)) g.link(s, i, 0.3);
  });

  return {
    ...g.done(),
    strengths: input.insight.strengths.map((s) => s.name),
    bands: {
      meaning: MEANING,
      distance: DISTANCE,
      seniority: SENIORITY,
      time: you.time.names,
    },
    planId: input.plan?.id ?? null,
  };
};
