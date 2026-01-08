'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

/**
 * Hook to fetch and manage job feedback history
 * @param {string} userId - The user ID to fetch feedback for
 * @returns {object} Feedback data, loading state, and refresh function
 */
export default function useFeedbackHistory(userId) {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/pathways/feedback?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }

      const data = await response.json();
      setFeedback(data || []);
    } catch (err) {
      logger.error({ error: err.message }, 'Error fetching feedback');
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  return {
    feedback,
    isLoading,
    error,
    refresh: fetchFeedback,
  };
}
