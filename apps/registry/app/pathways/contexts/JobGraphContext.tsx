'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useJobStates } from '@/app/hooks/useJobStates';
import {
  useEmbeddingState,
  EMBEDDING_STAGES,
  type EmbeddingStage,
} from './useEmbeddingState';
import type { Resume } from '../services/ResumeService';

// Re-export for consumers
export { EMBEDDING_STAGES };
export type { EmbeddingStage };

// ============================================================================
// Types
// ============================================================================

interface JobGraphContextValue {
  embedding: number[] | null;
  isEmbeddingLoading: boolean;
  embeddingStage: EmbeddingStage;
  refreshEmbedding: (forceRefresh?: boolean) => Promise<number[] | null>;
  graphVersion: number;
  triggerGraphRefresh: () => void;
  pendingJobFeedback: { jobInfo: unknown; sentiment: string } | null;
  promptJobFeedback: (jobInfo: unknown, sentiment: string) => void;
  clearPendingJobFeedback: () => void;
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
// Context & Provider
// ============================================================================

const JobGraphContext = createContext<JobGraphContextValue | null>(null);

export function JobGraphProvider({
  children,
  sessionId,
  userId,
  username,
  isAuthenticated,
  resume,
}: JobGraphProviderProps) {
  // Embedding state (extracted hook)
  const embeddingState = useEmbeddingState(resume);

  // Graph state - increment to trigger re-fetch
  const [graphVersion, setGraphVersion] = useState(0);
  const triggerGraphRefresh = useCallback(() => {
    setGraphVersion((v) => v + 1);
  }, []);

  // Job feedback state
  const [pendingJobFeedback, setPendingJobFeedback] = useState<{
    jobInfo: unknown;
    sentiment: string;
  } | null>(null);

  const promptJobFeedback = useCallback(
    (jobInfo: unknown, sentiment: string) => {
      setPendingJobFeedback({ jobInfo, sentiment });
    },
    []
  );

  const clearPendingJobFeedback = useCallback(() => {
    setPendingJobFeedback(null);
  }, []);

  // Job states hook
  const jobStatesHook = useJobStates({
    sessionId: sessionId ?? '',
    username: username ?? '',
    userId,
    isAuthenticated,
  });

  const value: JobGraphContextValue = {
    ...embeddingState,
    graphVersion,
    triggerGraphRefresh,
    pendingJobFeedback,
    promptJobFeedback,
    clearPendingJobFeedback,
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
