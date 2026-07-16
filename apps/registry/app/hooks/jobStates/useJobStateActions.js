import { useCallback } from 'react';
import { activityLogger } from '../../pathways/utils/activityLogger';
import { saveToLocalStorage } from './localStorage';
import { postJobState, postJobStatesBatch } from './api';
import { applyStateChange, applyStateChanges } from './stateHelpers';

/**
 * Write-side actions for job states: single/batch updates, the mark-* helpers,
 * and clear. Owns the optimistic-update + localStorage + server-sync wiring so
 * useJobStates stays a thin shell.
 *
 * @param {Object} params
 * @param {Object} params.jobStates - Current states map (for batch merges)
 * @param {Function} params.setJobStates - State setter from the shell
 * @param {string} params.sessionId - Session ID
 * @param {string|null} params.userId - User ID UUID (if authenticated)
 * @param {boolean} params.isAuthenticated - Whether user is logged in
 */
export function useJobStateActions({
  jobStates,
  setJobStates,
  sessionId,
  userId,
  isAuthenticated,
}) {
  // Update a single job's state
  const updateJobState = useCallback(
    async (jobId, state) => {
      const jobIdStr = String(jobId);

      // Optimistic update
      setJobStates((prev) => applyStateChange(prev, jobId, state));

      // Persist to localStorage (always, as fallback)
      if (sessionId) {
        setJobStates((current) => {
          saveToLocalStorage(sessionId, current);
          return current;
        });
      }

      // Persist to Supabase if authenticated
      if (isAuthenticated && userId) {
        try {
          await postJobState(userId, jobIdStr, state);
        } catch (err) {
          console.error('Failed to sync job state to server:', err);
        }
      }
    },
    [setJobStates, isAuthenticated, userId, sessionId]
  );

  // Batch update multiple jobs
  const updateJobStates = useCallback(
    async (updates) => {
      // updates: [{ jobId, state }]
      const newStates = applyStateChanges(jobStates, updates);

      setJobStates(newStates);

      // Persist to localStorage
      if (sessionId) {
        saveToLocalStorage(sessionId, newStates);
      }

      // Persist to Supabase if authenticated
      if (isAuthenticated && userId) {
        try {
          await postJobStatesBatch(userId, updates);
        } catch (err) {
          console.error('Failed to sync job states to server:', err);
        }
      }
    },
    [jobStates, setJobStates, isAuthenticated, userId, sessionId]
  );

  // Convenience methods
  const markAsRead = useCallback(
    (jobId, title) => {
      updateJobState(jobId, 'read');
      activityLogger.jobRead(jobId, title);
    },
    [updateJobState]
  );

  const markAsInterested = useCallback(
    (jobId, title) => {
      updateJobState(jobId, 'interested');
      activityLogger.jobInterested(jobId, title);
    },
    [updateJobState]
  );

  const markAsHidden = useCallback(
    (jobId, title) => {
      updateJobState(jobId, 'hidden');
      activityLogger.jobHidden(jobId, title);
    },
    [updateJobState]
  );

  const unmarkJob = useCallback(
    (jobId) => updateJobState(jobId, null),
    [updateJobState]
  );

  // Alias for unmarkJob - clears the job state
  const clearJobState = unmarkJob;

  return {
    updateJobState,
    updateJobStates,
    markAsRead,
    markAsInterested,
    markAsHidden,
    unmarkJob,
    clearJobState,
  };
}
