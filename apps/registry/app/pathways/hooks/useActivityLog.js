'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { usePathways } from '../context/PathwaysContext';
import { useAuth } from '@/app/context/auth';

/**
 * Hook for logging and fetching user activities in Pathways
 */
export default function useActivityLog() {
  const { sessionId } = usePathways();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const offsetRef = useRef(0);
  const pendingActivities = useRef([]);
  const flushTimeoutRef = useRef(null);
  const hasFetchedRef = useRef(false);

  const userId = user?.id;

  // Log a single activity (batched for performance)
  const logActivity = useCallback(
    (activityType, details = {}) => {
      if (!sessionId && !userId) return;

      pendingActivities.current.push({ activityType, details });

      // Debounce batch flush
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }

      flushTimeoutRef.current = setTimeout(() => {
        const batch = [...pendingActivities.current];
        pendingActivities.current = [];

        if (batch.length === 0) return;

        // Fire and forget - don't await
        fetch('/api/pathways/activity', {
          method: batch.length === 1 ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            batch.length === 1
              ? {
                  sessionId,
                  userId,
                  activityType: batch[0].activityType,
                  details: batch[0].details,
                }
              : { sessionId, userId, activities: batch }
          ),
        }).catch((err) =>
          logger.error({ error: err.message }, 'Failed to log activity')
        );
      }, 500);
    },
    [sessionId, userId]
  );

  // Fetch activities with pagination
  const fetchActivities = useCallback(
    async (reset = false) => {
      if (!sessionId && !userId) return;
      if (isLoading) return;

      // Clear error on new fetch attempt
      setError(null);
      setIsLoading(true);
      hasFetchedRef.current = true;
      const offset = reset ? 0 : offsetRef.current;

      try {
        const params = new URLSearchParams({
          limit: '30',
          offset: String(offset),
        });

        if (userId) {
          params.set('userId', userId);
        } else {
          params.set('sessionId', sessionId);
        }

        const response = await fetch(`/api/pathways/activity?${params}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (reset) {
          setActivities(data.activities || []);
          offsetRef.current = (data.activities || []).length;
        } else {
          setActivities((prev) => [...prev, ...(data.activities || [])]);
          offsetRef.current += (data.activities || []).length;
        }

        setHasMore(data.hasMore ?? false);
        setTotal(data.total ?? 0);
      } catch (err) {
        logger.error({ error: err.message }, 'Failed to fetch activities');
        setError(err.message || 'Failed to load activities');
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, userId, isLoading]
  );

  // Load more activities
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      fetchActivities(false);
    }
  }, [hasMore, isLoading, fetchActivities]);

  // Refresh activities
  const refresh = useCallback(() => {
    offsetRef.current = 0;
    fetchActivities(true);
  }, [fetchActivities]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
    };
  }, []);

  return {
    activities,
    isLoading,
    hasMore,
    total,
    error,
    hasFetched: hasFetchedRef.current,
    logActivity,
    fetchActivities,
    loadMore,
    refresh,
  };
}
