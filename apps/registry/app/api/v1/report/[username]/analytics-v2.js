/**
 * V2 analytics — Anti-Resume, Skill Adjacency, Archetypes, Market Drift, Readiness
 *
 * Barrel re-export: the individual computations live in ./analyticsV2/* to keep
 * each module focused and under the 200-line file policy.
 */
export { computeAntiResume } from './analyticsV2/antiResume';
export {
  computeSkillAdjacency,
  computeArchetypes,
  computeMarketDrift,
} from './analyticsV2/skillTrends';
export {
  computeReadinessScores,
  computeBestMatchSimilar,
} from './analyticsV2/readiness';
