import { useCallback, useMemo } from 'react';
import { jobIdsInState } from './stateHelpers';

/**
 * Read-side derivations over the job-states map: per-job state lookups and
 * the memoized id Sets used for filtering. Kept as its own hook so it
 * composes into useJobStates without inflating the shell.
 *
 * @param {Object} jobStates - Current states map { jobId: state }
 */
export function useJobStateQueries(jobStates) {
  const getJobState = useCallback(
    (jobId) => jobStates[String(jobId)] || null,
    [jobStates]
  );

  const isRead = useCallback(
    (jobId) => getJobState(jobId) === 'read',
    [getJobState]
  );

  const isInterested = useCallback(
    (jobId) => getJobState(jobId) === 'interested',
    [getJobState]
  );

  const isHidden = useCallback(
    (jobId) => getJobState(jobId) === 'hidden',
    [getJobState]
  );

  // Get sets for filtering (backwards compatible with useReadJobs)
  const readJobIds = useMemo(
    () => jobIdsInState(jobStates, 'read'),
    [jobStates]
  );

  const interestedJobIds = useMemo(
    () => jobIdsInState(jobStates, 'interested'),
    [jobStates]
  );

  const hiddenJobIds = useMemo(
    () => jobIdsInState(jobStates, 'hidden'),
    [jobStates]
  );

  return {
    getJobState,
    isRead,
    isInterested,
    isHidden,
    readJobIds,
    interestedJobIds,
    hiddenJobIds,
  };
}
