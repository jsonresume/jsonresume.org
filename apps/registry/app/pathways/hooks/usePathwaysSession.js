'use client';

import { useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { usePathways } from '../context/PathwaysContext';

/**
 * Hook that handles automatic migration of anonymous session data
 * when a user logs in to Pathways.
 *
 * This should be called in a component that renders after authentication
 * state is determined.
 */
export default function usePathwaysSession() {
  const { sessionId, isAuthenticated, username, migrateToUser } = usePathways();
  const hasMigrated = useRef(false);

  useEffect(() => {
    // Only migrate once when transitioning from anonymous to authenticated
    if (
      isAuthenticated &&
      username &&
      sessionId &&
      !hasMigrated.current &&
      migrateToUser
    ) {
      // Check if there's anything to migrate
      const hasLocalData = hasLocalStorageData();

      if (hasLocalData) {
        migrateToUser(username)
          .then((result) => {
            if (result.success) {
              logger.info(
                { migrated: result.migrated || 0 },
                'Job states migrated to account'
              );
            }
          })
          .catch((error) => {
            logger.error({ error: error.message }, 'Migration failed');
          });
      }

      hasMigrated.current = true;
    }
  }, [isAuthenticated, username, sessionId, migrateToUser]);

  return { sessionId, isAuthenticated, username };
}

/**
 * Check if there's any Pathways data in localStorage that needs migration
 */
function hasLocalStorageData() {
  if (typeof window === 'undefined') return false;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('pathways_job_')) {
      return true;
    }
  }

  return false;
}
