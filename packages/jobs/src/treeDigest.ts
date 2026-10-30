import type { CareerTree } from '@repo/api';

/**
 * The career tree in words, for agents: which skills hold up the most of
 * the best-fitting jobs, which missing skills would open the most, and
 * each kind of role with the experience it rests on and its jobs.
 */
export const treeDigest = (tree: CareerTree) => {
  const { nodes, edges } = tree;
  const above = (i: number) =>
    edges.filter((e) => e.from === i).map((e) => e.to);
  const below = (i: number) =>
    edges.filter((e) => e.to === i).map((e) => e.from);
  const jobsOn = (i: number) =>
    above(i).filter((j) => nodes[j]?.kind === 'job').length;
  const skills = nodes
    .map((n, i) => ({ n, i }))
    .filter(({ n }) => n.kind === 'skill' || n.kind === 'gap')
    .map(({ n, i }) => ({
      name: n.label,
      onResume: n.kind === 'skill',
      jobs: jobsOn(i),
    }))
    .filter((s) => s.jobs > 0)
    .sort((a, b) => b.jobs - a.jobs);
  const directions = nodes
    .map((n, i) => ({ n, i }))
    .filter(({ n }) => n.kind === 'direction')
    .map(({ n, i }) => ({
      name: n.label,
      evidence: below(i).flatMap((j) => {
        const e = nodes[j];
        return e?.kind === 'experience' ? [e.label] : [];
      }),
      jobs: above(i).flatMap((j) => {
        const job = nodes[j];
        return job?.kind === 'job' && job.jobId !== null
          ? [
              {
                id: job.jobId,
                company: job.label,
                role: job.detail ?? '',
                score: job.score ?? 0,
              },
            ]
          : [];
      }),
    }))
    .sort((a, b) => b.jobs.length - a.jobs.length);
  return {
    strengths: skills.filter((s) => s.onResume).slice(0, 15),
    gaps: skills.filter((s) => !s.onResume),
    directions,
  };
};
