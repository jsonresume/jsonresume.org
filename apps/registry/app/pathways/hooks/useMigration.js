'use client';

import { useCallback } from 'react';
import { logger } from '@/lib/logger';
import {
  clearSessionId,
  getLocalJobStates,
  clearLocalJobStates,
} from '../context/sessionUtils';

/**
 * Hook to handle migration of anonymous session data to a user account.
 */
export function useMigration(sessionId) {
  const migrateToUser = useCallback(
    async (newUsername) => {
      if (!sessionId)
        return { success: false, message: 'No session to migrate' };

      try {
        const localStates = getLocalJobStates();

        const response = await fetch('/api/job-states/migrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            username: newUsername,
            states: localStates,
          }),
        });

        if (!response.ok) {
          throw new Error('Migration failed');
        }

        const result = await response.json();
        clearLocalJobStates(localStates);
        clearSessionId();
        return result;
      } catch (error) {
        logger.error({ error: error.message }, 'Migration error');
        return { success: false, message: error.message };
      }
    },
    [sessionId]
  );

  return { migrateToUser };
}
