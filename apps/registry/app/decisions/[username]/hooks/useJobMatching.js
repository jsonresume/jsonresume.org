/**
 * useJobMatching Hook
 * Handles job scoring and ranking based on candidate resume
 */

import { useMemo } from 'react';
import {
  scoreCandidateForJob,
  determineOutcome,
} from '../config/matchingCriteria';

export function useJobMatching(resume, jobs) {
  // Calculate scores and rank jobs
  const rankedJobs = useMemo(() => {
    if (!resume || !jobs || !jobs.length) return [];

    return jobs
      .map((job) => {
        const scoreResult = scoreCandidateForJob(resume, job);
        const outcome = determineOutcome(scoreResult);

        return {
          ...job,
          _score: scoreResult.score,
          _breakdown: scoreResult.breakdown,
          _outcome: outcome,
        };
      })
      .sort((a, b) => b._score - a._score); // Sort by score descending
  }, [resume, jobs]);

  // Helper to score a single job (for on-demand evaluation)
  const scoreJob = useMemo(
    () => (job) => {
      if (!resume || !job) return null;
      const scoreResult = scoreCandidateForJob(resume, job);
      const outcome = determineOutcome(scoreResult);
      return { scoreResult, outcome };
    },
    [resume]
  );

  return {
    rankedJobs,
    scoreJob,
  };
}
