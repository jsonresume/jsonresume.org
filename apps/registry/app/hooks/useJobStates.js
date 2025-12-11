import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY_PREFIX = 'pathways_job_states';

/**
 * Get localStorage key for job states
 * @param {string} sessionId - Session ID for anonymous users
 * @returns {string} localStorage key
 */
const getStorageKey = (sessionId) => `${STORAGE_KEY_PREFIX}_${sessionId}`;

/**
 * Load job states from localStorage
 * @param {string} sessionId - Session ID
 * @returns {Object} Job states map { jobId: state }
 */
const loadFromLocalStorage = (sessionId) => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(getStorageKey(sessionId));
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load job states from localStorage:', error);
    return {};
  }
};

/**
 * Save job states to localStorage
 * @param {string} sessionId - Session ID
 * @param {Object} states - Job states map
 */
const saveToLocalStorage = (sessionId, states) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(sessionId), JSON.stringify(states));
  } catch (error) {
    console.error('Failed to save job states to localStorage:', error);
  }
};

/**
 * Clear job states from localStorage
 * @param {string} sessionId - Session ID
 */
const clearLocalStorage = (sessionId) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getStorageKey(sessionId));
  } catch (error) {
    console.error('Failed to clear job states from localStorage:', error);
  }
};

/**
 * Unified hook for managing job states (read/interested/hidden)
 * - Uses localStorage for anonymous users
 * - Syncs to Supabase for logged-in users
 * - Handles migration on signup
 *
 * @param {Object} options
 * @param {string} options.sessionId - Session ID (always present)
 * @param {string|null} options.username - Username (if authenticated)
 * @param {boolean} options.isAuthenticated - Whether user is logged in
 * @returns {Object} Job states and management functions
 */
export function useJobStates({ sessionId, username, isAuthenticated }) {
  const [jobStates, setJobStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load states on mount or when auth changes
  useEffect(() => {
    const loadStates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isAuthenticated && username) {
          // Load from Supabase for authenticated users
          const response = await fetch(`/api/job-states?username=${username}`);
          if (!response.ok) {
            throw new Error('Failed to fetch job states');
          }
          const data = await response.json();
          setJobStates(data.states || {});
        } else if (sessionId) {
          // Load from localStorage for anonymous users
          const localStates = loadFromLocalStorage(sessionId);
          setJobStates(localStates);
        }
      } catch (err) {
        console.error('Failed to load job states:', err);
        setError(err.message);
        // Fall back to localStorage
        if (sessionId) {
          const localStates = loadFromLocalStorage(sessionId);
          setJobStates(localStates);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStates();
  }, [isAuthenticated, username, sessionId]);

  // Update a single job's state
  const updateJobState = useCallback(
    async (jobId, state) => {
      const jobIdStr = String(jobId);

      // Optimistic update
      setJobStates((prev) => {
        const newStates = { ...prev };
        if (state === null) {
          delete newStates[jobIdStr];
        } else {
          newStates[jobIdStr] = state;
        }
        return newStates;
      });

      // Persist to localStorage (always, as fallback)
      if (sessionId) {
        setJobStates((current) => {
          saveToLocalStorage(sessionId, current);
          return current;
        });
      }

      // Persist to Supabase if authenticated
      if (isAuthenticated && username) {
        try {
          await fetch('/api/job-states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, jobId: jobIdStr, state }),
          });
        } catch (err) {
          console.error('Failed to sync job state to server:', err);
        }
      }
    },
    [isAuthenticated, username, sessionId]
  );

  // Batch update multiple jobs
  const updateJobStates = useCallback(
    async (updates) => {
      // updates: [{ jobId, state }]
      const newStates = { ...jobStates };

      updates.forEach(({ jobId, state }) => {
        const jobIdStr = String(jobId);
        if (state === null) {
          delete newStates[jobIdStr];
        } else {
          newStates[jobIdStr] = state;
        }
      });

      setJobStates(newStates);

      // Persist to localStorage
      if (sessionId) {
        saveToLocalStorage(sessionId, newStates);
      }

      // Persist to Supabase if authenticated
      if (isAuthenticated && username) {
        try {
          await fetch('/api/job-states/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, updates }),
          });
        } catch (err) {
          console.error('Failed to sync job states to server:', err);
        }
      }
    },
    [jobStates, isAuthenticated, username, sessionId]
  );

  // Convenience methods
  const markAsRead = useCallback(
    (jobId) => updateJobState(jobId, 'read'),
    [updateJobState]
  );

  const markAsInterested = useCallback(
    (jobId) => updateJobState(jobId, 'interested'),
    [updateJobState]
  );

  const markAsHidden = useCallback(
    (jobId) => updateJobState(jobId, 'hidden'),
    [updateJobState]
  );

  const unmarkJob = useCallback(
    (jobId) => updateJobState(jobId, null),
    [updateJobState]
  );

  // Alias for unmarkJob - clears the job state
  const clearJobState = unmarkJob;

  // Check job state
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
    () =>
      new Set(
        Object.entries(jobStates)
          .filter(([_, state]) => state === 'read')
          .map(([jobId]) => jobId)
      ),
    [jobStates]
  );

  const interestedJobIds = useMemo(
    () =>
      new Set(
        Object.entries(jobStates)
          .filter(([_, state]) => state === 'interested')
          .map(([jobId]) => jobId)
      ),
    [jobStates]
  );

  const hiddenJobIds = useMemo(
    () =>
      new Set(
        Object.entries(jobStates)
          .filter(([_, state]) => state === 'hidden')
          .map(([jobId]) => jobId)
      ),
    [jobStates]
  );

  // Migration function for signup
  const migrateToUser = useCallback(
    async (newUserId) => {
      if (!sessionId) return { success: false, error: 'No session ID' };

      try {
        const response = await fetch('/api/job-states/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, userId: newUserId }),
        });

        if (!response.ok) {
          throw new Error('Migration failed');
        }

        // Clear localStorage after successful migration
        clearLocalStorage(sessionId);

        return { success: true };
      } catch (err) {
        console.error('Failed to migrate job states:', err);
        return { success: false, error: err.message };
      }
    },
    [sessionId]
  );

  return {
    // State
    jobStates,
    isLoading,
    error,

    // Actions
    updateJobState,
    updateJobStates,
    markAsRead,
    markAsInterested,
    markAsHidden,
    unmarkJob,
    clearJobState,

    // Queries
    getJobState,
    isRead,
    isInterested,
    isHidden,

    // Sets (for filtering)
    readJobIds,
    interestedJobIds,
    hiddenJobIds,

    // Migration
    migrateToUser,
  };
}

export default useJobStates;
