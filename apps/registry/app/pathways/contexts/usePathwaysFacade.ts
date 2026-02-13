'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/auth';
import { useResume } from './ResumeContext';
import { useJobGraph } from './JobGraphContext';
import { useKeyboard } from './KeyboardContext';
import {
  getSessionId,
  clearSessionId,
  getLocalJobStates,
  clearLocalJobStates,
} from '../context/sessionUtils';

/**
 * Combined hook that provides access to all Pathways state.
 * Maintains backwards compatibility with the old usePathways() hook.
 */
export function usePathways() {
  const { user } = useAuth();
  const resume = useResume();
  const jobGraph = useJobGraph();
  const keyboard = useKeyboard();

  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

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

      if (!response.ok) throw new Error('Migration failed');

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

    // Resume
    resume: resume.resume,
    resumeJson: resume.resumeJson,
    isResumeLoading: resume.isResumeLoading,
    isResumeSaving: resume.isResumeSaving,
    updateResume: resume.updateResume,
    updateResumeJson: resume.updateResumeJson,
    saveResumeChanges: resume.saveResumeChanges,
    applyAndSave: resume.applyAndSave,
    setFullResume: resume.setFullResume,

    // Embedding
    embedding: jobGraph.embedding,
    isEmbeddingLoading: jobGraph.isEmbeddingLoading,
    embeddingStage: jobGraph.embeddingStage,
    refreshEmbedding: jobGraph.refreshEmbedding,

    // Job States
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

    // Graph
    graphVersion: jobGraph.graphVersion,
    triggerGraphRefresh: jobGraph.triggerGraphRefresh,

    // Job Feedback
    pendingJobFeedback: jobGraph.pendingJobFeedback,
    promptJobFeedback: jobGraph.promptJobFeedback,
    clearPendingJobFeedback: jobGraph.clearPendingJobFeedback,

    // Keyboard
    focusArea: keyboard.focusArea,
    setFocusArea: keyboard.setFocusArea,
    isHelpOpen: keyboard.isHelpOpen,
    setIsHelpOpen: keyboard.setIsHelpOpen,
    shortcuts: keyboard.shortcuts,

    // Migration
    migrateToUser,
  };
}
