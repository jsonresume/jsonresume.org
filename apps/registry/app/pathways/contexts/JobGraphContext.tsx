'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { useJobStates } from '@/app/hooks/useJobStates';
import {
  hashResume,
  getCachedEmbedding,
  setCachedEmbedding,
} from '../utils/pathwaysCache';
import pathwaysToast from '../utils/toastMessages';
import type { Resume } from '../services/ResumeService';

// ============================================================================
// Types
// ============================================================================

export const EMBEDDING_STAGES = {
  IDLE: 'idle',
  CHECKING_CACHE: 'checking_cache',
  CACHE_HIT: 'cache_hit',
  GENERATING: 'generating',
  COMPLETE: 'complete',
} as const;

export type EmbeddingStage =
  (typeof EMBEDDING_STAGES)[keyof typeof EMBEDDING_STAGES];

interface JobGraphContextValue {
  // Embedding state
  embedding: number[] | null;
  isEmbeddingLoading: boolean;
  embeddingStage: EmbeddingStage;
  refreshEmbedding: (forceRefresh?: boolean) => Promise<number[] | null>;

  // Graph state
  graphVersion: number;
  triggerGraphRefresh: () => void;

  // Job feedback
  pendingJobFeedback: { jobInfo: unknown; sentiment: string } | null;
  promptJobFeedback: (jobInfo: unknown, sentiment: string) => void;
  clearPendingJobFeedback: () => void;

  // Job states (from useJobStates hook)
  jobStates: Record<string, string>;
  isJobStatesLoading: boolean;
  jobStatesError: string | null;
  markAsRead: (jobId: string, title?: string) => void;
  markAsInterested: (jobId: string, title?: string) => void;
  markAsHidden: (jobId: string, title?: string) => void;
  clearJobState: (jobId: string) => void;
  getJobState: (jobId: string) => string | null;
  isRead: (jobId: string) => boolean;
  isInterested: (jobId: string) => boolean;
  isHidden: (jobId: string) => boolean;
  readJobIds: Set<string>;
  interestedJobIds: Set<string>;
  hiddenJobIds: Set<string>;
}

interface JobGraphProviderProps {
  children: ReactNode;
  sessionId: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  resume: Resume | null;
}

// ============================================================================
// Context
// ============================================================================

const JobGraphContext = createContext<JobGraphContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function JobGraphProvider({
  children,
  sessionId,
  userId,
  username,
  isAuthenticated,
  resume,
}: JobGraphProviderProps) {
  // Embedding state
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [isEmbeddingLoading, setIsEmbeddingLoading] = useState(false);
  const [embeddingStage, setEmbeddingStage] = useState<EmbeddingStage>(
    EMBEDDING_STAGES.IDLE
  );
  const lastResumeHashRef = useRef<string | null>(null);

  // Graph state
  const [graphVersion, setGraphVersion] = useState(0);

  // Job feedback state
  const [pendingJobFeedback, setPendingJobFeedback] = useState<{
    jobInfo: unknown;
    sentiment: string;
  } | null>(null);

  // Job states hook (pass empty string for null sessionId to satisfy JSDoc types)
  const jobStatesHook = useJobStates({
    sessionId: sessionId ?? '',
    username: username ?? '',
    userId,
    isAuthenticated,
  });

  // Refresh embedding
  const refreshEmbedding = useCallback(
    async (forceRefresh = false): Promise<number[] | null> => {
      if (!resume) return null;

      const resumeHash = hashResume(resume);
      setIsEmbeddingLoading(true);
      setEmbeddingStage(EMBEDDING_STAGES.CHECKING_CACHE);

      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cached = await getCachedEmbedding(resumeHash);
        if (cached) {
          setEmbeddingStage(EMBEDDING_STAGES.CACHE_HIT);
          await new Promise((resolve) => setTimeout(resolve, 200));
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
        const response = await fetch('/api/pathways/embedding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resume }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate embedding');
        }

        const data = await response.json();
        await setCachedEmbedding(resumeHash, data.embedding);
        lastResumeHashRef.current = resumeHash;

        setEmbedding(data.embedding);
        setEmbeddingStage(EMBEDDING_STAGES.COMPLETE);
        setGraphVersion((v) => v + 1);
        return data.embedding;
      } catch (error) {
        pathwaysToast.embeddingError();
        setEmbeddingStage(EMBEDDING_STAGES.IDLE);
        return null;
      } finally {
        setIsEmbeddingLoading(false);
      }
    },
    [resume]
  );

  // Trigger graph refresh
  const triggerGraphRefresh = useCallback(() => {
    setGraphVersion((v) => v + 1);
  }, []);

  // Job feedback handlers
  const promptJobFeedback = useCallback(
    (jobInfo: unknown, sentiment: string) => {
      setPendingJobFeedback({ jobInfo, sentiment });
    },
    []
  );

  const clearPendingJobFeedback = useCallback(() => {
    setPendingJobFeedback(null);
  }, []);

  // Generate initial embedding when resume is set
  useEffect(() => {
    if (resume && !embedding && !isEmbeddingLoading) {
      refreshEmbedding();
    }
  }, [resume, embedding, isEmbeddingLoading, refreshEmbedding]);

  const value: JobGraphContextValue = {
    // Embedding
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    refreshEmbedding,

    // Graph
    graphVersion,
    triggerGraphRefresh,

    // Job feedback
    pendingJobFeedback,
    promptJobFeedback,
    clearPendingJobFeedback,

    // Job states (spread from hook)
    jobStates: jobStatesHook.jobStates,
    isJobStatesLoading: jobStatesHook.isLoading,
    jobStatesError: jobStatesHook.error,
    markAsRead: jobStatesHook.markAsRead,
    markAsInterested: jobStatesHook.markAsInterested,
    markAsHidden: jobStatesHook.markAsHidden,
    clearJobState: jobStatesHook.clearJobState,
    getJobState: jobStatesHook.getJobState,
    isRead: jobStatesHook.isRead,
    isInterested: jobStatesHook.isInterested,
    isHidden: jobStatesHook.isHidden,
    readJobIds: jobStatesHook.readJobIds,
    interestedJobIds: jobStatesHook.interestedJobIds,
    hiddenJobIds: jobStatesHook.hiddenJobIds,
  };

  return (
    <JobGraphContext.Provider value={value}>
      {children}
    </JobGraphContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useJobGraph(): JobGraphContextValue {
  const context = useContext(JobGraphContext);
  if (!context) {
    throw new Error('useJobGraph must be used within a JobGraphProvider');
  }
  return context;
}

export default JobGraphContext;
