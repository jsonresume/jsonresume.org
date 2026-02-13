'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to fetch and cache AI match insights for a job.
 */
export default function useMatchInsights({ job, resume, effectiveUserId }) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset state and check cache when job changes
  useEffect(() => {
    setInsights(null);
    setIsLoading(false);
    setError(null);
    setIsExpanded(false);

    if (!effectiveUserId || !job?.id) return;

    const checkCache = async () => {
      try {
        const res = await fetch(
          `/api/pathways/match-insights?userId=${effectiveUserId}&jobId=${job.id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.bullets) {
            setInsights(data);
            setIsExpanded(true);
          }
        }
      } catch {
        // Ignore cache check errors
      }
    };

    checkCache();
  }, [effectiveUserId, job?.id]);

  const generateInsights = useCallback(async () => {
    if (!effectiveUserId || !job || !resume) {
      setError('Missing required data');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/pathways/match-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: effectiveUserId,
          jobId: job.id,
          resume,
          job,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate insights');

      const data = await res.json();
      setInsights(data);
      setIsExpanded(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [effectiveUserId, job, resume]);

  const toggleExpanded = useCallback(() => {
    if (insights) {
      setIsExpanded((prev) => !prev);
    } else {
      generateInsights();
    }
  }, [insights, generateInsights]);

  return {
    insights,
    isLoading,
    error,
    isExpanded,
    generateInsights,
    toggleExpanded,
  };
}
