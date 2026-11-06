import type { CareerGraph } from '@repo/api';

/**
 * The career graph in words, for agents: strengths; jobs by how close they
 * are (ready now, one skill away and which); the missing skills that would
 * open the most; where people in this role went next; the plan's progress.
 */
export const graphDigest = (graph: CareerGraph) => {
  const { nodes, edges } = graph;
  const below = (i: number) =>
    edges.filter((e) => e.to === i).map((e) => e.from);
  const jobsAbove = (i: number) =>
    edges.filter((e) => e.from === i && nodes[e.to]?.kind === 'job').length;
  const indexed = nodes.map((n, i) => ({ n, i }));
  const jobs = indexed
    .filter(({ n }) => n.kind === 'job' && n.jobId !== null)
    .map(({ n, i }) => ({
      id: n.jobId ?? 0,
      company: n.label,
      detail: n.detail ?? '',
      fit: n.score ?? 0,
      missing: below(i).flatMap((j) => {
        const m = nodes[j];
        return m?.kind === 'gap' ? [m.label] : [];
      }),
      distance: n.levels.distance ?? 4,
    }));
  return {
    strengths: graph.strengths,
    ready: jobs
      .filter((j) => j.distance === 2)
      .map(({ distance: _, ...j }) => j),
    oneStep: jobs
      .filter((j) => j.distance === 3)
      .map(({ distance: _, ...j }) => j),
    further: jobs.filter((j) => j.distance >= 4).length,
    gaps: indexed
      .filter(({ n }) => n.kind === 'gap')
      .map(({ n, i }) => ({ skill: n.label, jobs: jobsAbove(i) }))
      .sort((a, b) => b.jobs - a.jobs),
    destinations: indexed
      .filter(({ n }) => n.kind === 'destination')
      .map(({ n }) => ({ id: n.id, name: n.label, detail: n.detail ?? '' })),
    plan: graph.planId
      ? {
          id: graph.planId,
          steps: nodes
            .filter((n) => n.kind === 'step')
            .map((n) => ({ title: n.label, done: n.tone === 'success' })),
        }
      : null,
    pending: graph.pending,
  };
};
