'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/auth';
import { ResumeProvider, useResume } from './ResumeContext';
import {
  JobGraphProvider,
  useJobGraph,
  EMBEDDING_STAGES,
} from './JobGraphContext';
import { KeyboardProvider, useKeyboard } from './KeyboardContext';
import {
  getSessionId,
  clearSessionId,
  getLocalJobStates,
  clearLocalJobStates,
} from '../context/sessionUtils';

// ============================================================================
// Re-exports
// ============================================================================

export { ResumeProvider, useResume } from './ResumeContext';
export {
  JobGraphProvider,
  useJobGraph,
  EMBEDDING_STAGES,
} from './JobGraphContext';
export { KeyboardProvider, useKeyboard } from './KeyboardContext';
export type { EmbeddingStage } from './JobGraphContext';
export type { FocusArea, KeyboardShortcut } from './KeyboardContext';

// ============================================================================
// Combined Provider
// ============================================================================

interface PathwaysProviderProps {
  children: ReactNode;
}

/**
 * Combined provider that composes all Pathways contexts.
 * Handles auth and session management, then provides context to children.
 */
export function PathwaysProvider({ children }: PathwaysProviderProps) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const username = user?.user_metadata?.user_name || null;
  const isAuthenticated = !!user;

  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize session ID on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  return (
    <KeyboardProvider>
      <ResumeProvider sessionId={sessionId} userId={userId}>
        <JobGraphProviderWrapper
          sessionId={sessionId}
          userId={userId}
          username={username}
          isAuthenticated={isAuthenticated}
        >
          {children}
        </JobGraphProviderWrapper>
      </ResumeProvider>
    </KeyboardProvider>
  );
}

/**
 * Wrapper component that accesses resume from ResumeContext
 * and passes it to JobGraphProvider.
 */
function JobGraphProviderWrapper({
  children,
  sessionId,
  userId,
  username,
  isAuthenticated,
}: {
  children: ReactNode;
  sessionId: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
}) {
  const { resume } = useResume();

  return (
    <JobGraphProvider
      sessionId={sessionId}
      userId={userId}
      username={username}
      isAuthenticated={isAuthenticated}
      resume={resume}
    >
      {children}
    </JobGraphProvider>
  );
}

// ============================================================================
// Combined Hook (Backwards Compatibility)
// ============================================================================

/**
 * Combined hook that provides access to all Pathways state.
 * This maintains backwards compatibility with the old usePathways() hook.
 */
export function usePathways() {
  const { user } = useAuth();
  const resume = useResume();
  const jobGraph = useJobGraph();
  const keyboard = useKeyboard();

  // Session state (managed at provider level, but needed here for migration)
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Migration function for backwards compatibility
  const migrateToUser = async (newUsername: string) => {
    if (!sessionId) return { success: false, message: 'No session to migrate' };

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
      return { success: false, message: (error as Error).message };
    }
  };

  return {
    // Auth/Session
    sessionId,
    userId: user?.id || null,
    isAuthenticated: !!user,
    username: user?.user_metadata?.user_name || null,

    // Resume (from ResumeContext)
    resume: resume.resume,
    resumeJson: resume.resumeJson,
    isResumeLoading: resume.isResumeLoading,
    isResumeSaving: resume.isResumeSaving,
    updateResume: resume.updateResume,
    updateResumeJson: resume.updateResumeJson,
    saveResumeChanges: resume.saveResumeChanges,
    applyAndSave: resume.applyAndSave,
    setFullResume: resume.setFullResume,

    // Embedding (from JobGraphContext)
    embedding: jobGraph.embedding,
    isEmbeddingLoading: jobGraph.isEmbeddingLoading,
    embeddingStage: jobGraph.embeddingStage,
    refreshEmbedding: jobGraph.refreshEmbedding,

    // Job States (from JobGraphContext)
    jobStates: jobGraph.jobStates,
    markAsRead: jobGraph.markAsRead,
    markAsInterested: jobGraph.markAsInterested,
    markAsHidden: jobGraph.markAsHidden,
    clearJobState: jobGraph.clearJobState,
    getJobState: jobGraph.getJobState,
    isRead: jobGraph.isRead,
    isInterested: jobGraph.isInterested,
    isHidden: jobGraph.isHidden,
    readJobIds: jobGraph.readJobIds,
    interestedJobIds: jobGraph.interestedJobIds,
    hiddenJobIds: jobGraph.hiddenJobIds,

    // Graph (from JobGraphContext)
    graphVersion: jobGraph.graphVersion,
    triggerGraphRefresh: jobGraph.triggerGraphRefresh,

    // Job Feedback (from JobGraphContext)
    pendingJobFeedback: jobGraph.pendingJobFeedback,
    promptJobFeedback: jobGraph.promptJobFeedback,
    clearPendingJobFeedback: jobGraph.clearPendingJobFeedback,

    // Keyboard (from KeyboardContext)
    focusArea: keyboard.focusArea,
    setFocusArea: keyboard.setFocusArea,
    isHelpOpen: keyboard.isHelpOpen,
    setIsHelpOpen: keyboard.setIsHelpOpen,
    shortcuts: keyboard.shortcuts,

    // Migration
    migrateToUser,
  };
}
