'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { createRetryFetch } from '@/lib/retry';
import pathwaysToast from '../utils/toastMessages';
import {
  hashResume,
  getCachedEmbedding,
  setCachedEmbedding,
} from '../utils/pathwaysCache';

const fetchWithRetry = createRetryFetch({
  maxAttempts: 3,
  retryableStatuses: [429, 500, 502, 503, 504],
});

export const EMBEDDING_STAGES = {
  IDLE: 'idle',
  CHECKING_CACHE: 'checking_cache',
  CACHE_HIT: 'cache_hit',
  GENERATING: 'generating',
  COMPLETE: 'complete',
};

/**
 * Hook to manage resume embedding generation and caching.
 */
export function useEmbedding(resume) {
  const [embedding, setEmbedding] = useState(null);
  const [isEmbeddingLoading, setIsEmbeddingLoading] = useState(false);
  const [embeddingStage, setEmbeddingStage] = useState(EMBEDDING_STAGES.IDLE);
  const [graphVersion, setGraphVersion] = useState(0);
  const lastResumeHashRef = useRef(null);

  const refreshEmbedding = useCallback(
    async (forceRefresh = false) => {
      if (!resume) return null;

      const resumeHash = hashResume(resume);
      setIsEmbeddingLoading(true);
      setEmbeddingStage(EMBEDDING_STAGES.CHECKING_CACHE);

      if (!forceRefresh) {
        const cached = await getCachedEmbedding(resumeHash);
        if (cached) {
          setEmbeddingStage(EMBEDDING_STAGES.CACHE_HIT);
          setEmbedding(cached);
          lastResumeHashRef.current = resumeHash;
          setEmbeddingStage(EMBEDDING_STAGES.COMPLETE);
          setIsEmbeddingLoading(false);
          setGraphVersion((v) => v + 1);
          return cached;
        }
      }

      setEmbeddingStage(EMBEDDING_STAGES.GENERATING);

      try {
        const response = await fetchWithRetry('/api/pathways/embedding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume }),
        });

        const data = await response.json();
        await setCachedEmbedding(resumeHash, data.embedding);
        lastResumeHashRef.current = resumeHash;

        setEmbedding(data.embedding);
        setEmbeddingStage(EMBEDDING_STAGES.COMPLETE);
        setGraphVersion((v) => v + 1);
        return data.embedding;
      } catch (error) {
        logger.error({ error: error.message }, 'Failed to generate embedding');
        pathwaysToast.embeddingError();
        setEmbeddingStage(EMBEDDING_STAGES.IDLE);
        return null;
      } finally {
        setIsEmbeddingLoading(false);
      }
    },
    [resume]
  );

  const triggerGraphRefresh = useCallback(() => {
    setGraphVersion((v) => v + 1);
  }, []);

  // Auto-refresh embedding when resume content changes
  useEffect(() => {
    if (!resume || isEmbeddingLoading) return;
    const currentHash = hashResume(resume);
    if (currentHash === lastResumeHashRef.current) return;
    refreshEmbedding();
  }, [resume, isEmbeddingLoading, refreshEmbedding]);

  return {
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    graphVersion,
    refreshEmbedding,
    triggerGraphRefresh,
  };
}
