'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  hashResume,
  getCachedEmbedding,
  setCachedEmbedding,
} from '../utils/pathwaysCache';
import pathwaysToast from '../utils/toastMessages';
import type { Resume } from '../services/ResumeService';

export const EMBEDDING_STAGES = {
  IDLE: 'idle',
  CHECKING_CACHE: 'checking_cache',
  CACHE_HIT: 'cache_hit',
  GENERATING: 'generating',
  COMPLETE: 'complete',
} as const;

export type EmbeddingStage =
  (typeof EMBEDDING_STAGES)[keyof typeof EMBEDDING_STAGES];

/**
 * Hook for managing embedding generation with caching.
 * Extracted from JobGraphContext to keep provider lean.
 */
export function useEmbeddingState(resume: Resume | null) {
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [isEmbeddingLoading, setIsEmbeddingLoading] = useState(false);
  const [embeddingStage, setEmbeddingStage] = useState<EmbeddingStage>(
    EMBEDDING_STAGES.IDLE
  );
  const lastResumeHashRef = useRef<string | null>(null);

  const refreshEmbedding = useCallback(
    async (forceRefresh = false): Promise<number[] | null> => {
      if (!resume) return null;

      const resumeHash = hashResume(resume);
      setIsEmbeddingLoading(true);
      setEmbeddingStage(EMBEDDING_STAGES.CHECKING_CACHE);

      // Check cache first
      if (!forceRefresh) {
        const cached = await getCachedEmbedding(resumeHash);
        if (cached) {
          setEmbeddingStage(EMBEDDING_STAGES.CACHE_HIT);
          await new Promise((resolve) => setTimeout(resolve, 200));
          setEmbedding(cached);
          lastResumeHashRef.current = resumeHash;
          setEmbeddingStage(EMBEDDING_STAGES.COMPLETE);
          setIsEmbeddingLoading(false);
          return cached;
        }
      }

      setEmbeddingStage(EMBEDDING_STAGES.GENERATING);

      try {
        const response = await fetch('/api/pathways/embedding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume }),
        });

        if (!response.ok) throw new Error('Failed to generate embedding');

        const data = await response.json();
        await setCachedEmbedding(resumeHash, data.embedding);
        lastResumeHashRef.current = resumeHash;

        setEmbedding(data.embedding);
        setEmbeddingStage(EMBEDDING_STAGES.COMPLETE);
        return data.embedding;
      } catch {
        pathwaysToast.embeddingError();
        setEmbeddingStage(EMBEDDING_STAGES.IDLE);
        return null;
      } finally {
        setIsEmbeddingLoading(false);
      }
    },
    [resume]
  );

  // Generate initial embedding when resume is set
  useEffect(() => {
    if (resume && !embedding && !isEmbeddingLoading) {
      refreshEmbedding();
    }
  }, [resume, embedding, isEmbeddingLoading, refreshEmbedding]);

  return {
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    refreshEmbedding,
  };
}
