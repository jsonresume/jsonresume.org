/**
 * V1 analytics — pipeline, salary, remote index, deal-breakers, skill gaps,
 * momentum, top companies, recent activity, and second-look suggestions.
 *
 * Barrel re-export: the individual computations live in ./analyticsV1/* to keep
 * each module focused and under the 200-line file policy.
 */
export {
  computePipeline,
  computeTimeline,
  computeMomentum,
} from './analyticsV1/pipeline';
export { computeSalary, computeRemoteIndex } from './analyticsV1/salary';
export {
  computeDealBreakers,
  computeSkillGaps,
  computeTopCompanies,
  computeRecentActivity,
  findSecondLookJobs,
} from './analyticsV1/preferences';
