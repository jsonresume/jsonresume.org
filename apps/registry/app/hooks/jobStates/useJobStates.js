import { useState, useEffect, useCallback } from 'react';
import { loadFromLocalStorage, clearLocalStorage } from './localStorage';
import { fetchJobStates, postMigrate } from './api';
import { useJobStateActions } from './useJobStateActions';
import { useJobStateQueries } from './useJobStateQueries';

/**
 * Unified hook for managing job states (read/interested/hidden)
 * - Uses localStorage for anonymous users
 * - Syncs to Supabase for logged-in users
 * - Handles migration on signup
 *
 * @param {Object} options
 * @param {string} options.sessionId - Session ID (always present)
 * @param {string|null} options.username - Username (if authenticated)
 * @param {string|null} options.userId - User ID UUID (if authenticated)
 * @param {boolean} options.isAuthenticated - Whether user is logged in
 * @returns {Object} Job states and management functions
 */
export function useJobStates({ sessionId, username, userId, isAuthenticated }) {
  const [jobStates, setJobStates] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load states on mount or when auth changes
  useEffect(() => {
    const loadStates = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isAuthenticated && userId) {
          // Load from Supabase for authenticated users
          const states = await fetchJobStates(userId);
          setJobStates(states);
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
  }, [isAuthenticated, userId, sessionId]);

  const actions = useJobStateActions({
    jobStates,
    setJobStates,
    sessionId,
    userId,
    isAuthenticated,
  });

  const queries = useJobStateQueries(jobStates);

  // Migration function for signup
  const migrateToUser = useCallback(
    async (newUserId) => {
      if (!sessionId) return { success: false, error: 'No session ID' };

      try {
        const response = await postMigrate(sessionId, newUserId);

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
    ...actions,

    // Queries + filtering sets
    ...queries,

    // Migration
    migrateToUser,
  };
}

export default useJobStates;
