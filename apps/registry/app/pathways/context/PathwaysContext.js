'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useAuth } from '@/app/context/auth';
import { useJobStates } from '@/app/hooks/useJobStates';
import usePathwaysResume from '../hooks/usePathwaysResume';
import { useEmbedding } from '../hooks/useEmbedding';
import { useMigration } from '../hooks/useMigration';
import { SAMPLE_RESUME } from './sampleResume';
import { getSessionId } from './sessionUtils';

// Re-export for consumers
export { EMBEDDING_STAGES } from '../hooks/useEmbedding';

const PathwaysContext = createContext(null);

export function PathwaysProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const username = user?.user_metadata?.user_name || null;
  const isAuthenticated = !!user;

  const [sessionId, setSessionId] = useState(null);
  const [pendingJobFeedback, setPendingJobFeedback] = useState(null);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Resume persistence
  const {
    resume: dbResume,
    isLoading: isResumeLoading,
    isSaving: isResumeSaving,
    saveChanges: saveResumeChanges,
    applyAndSave,
    setFullResume,
    updateLocal: updateResumeLocal,
  } = usePathwaysResume({ sessionId, userId });

  // Derive resume state
  const hasResumeContent = dbResume && Object.keys(dbResume).length > 0;
  const resume = hasResumeContent ? dbResume : SAMPLE_RESUME;
  const [resumeJson, setResumeJson] = useState(() =>
    JSON.stringify(SAMPLE_RESUME, null, 2)
  );

  useEffect(() => {
    if (resume) {
      setResumeJson(JSON.stringify(resume, null, 2));
    }
  }, [resume]);

  // Embedding management
  const {
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    graphVersion,
    refreshEmbedding,
    triggerGraphRefresh,
  } = useEmbedding(resume);

  // Job states
  const jobStatesHook = useJobStates({
    sessionId,
    username,
    userId,
    isAuthenticated,
  });

  // Session migration
  const { migrateToUser } = useMigration(sessionId);

  // Update resume locally (immediate UI feedback)
  const updateResume = useCallback(
    (newResume) => {
      updateResumeLocal(newResume);
      setResumeJson(JSON.stringify(newResume, null, 2));
    },
    [updateResumeLocal]
  );

  // Update resume JSON string (from editor)
  const updateResumeJson = useCallback(
    (json) => {
      setResumeJson(json);
      try {
        const parsed = JSON.parse(json);
        updateResumeLocal(parsed);
      } catch {
        // Invalid JSON, don't update object
      }
    },
    [updateResumeLocal]
  );

  const promptJobFeedback = useCallback((jobInfo, sentiment) => {
    setPendingJobFeedback({ jobInfo, sentiment });
  }, []);

  const clearPendingJobFeedback = useCallback(() => {
    setPendingJobFeedback(null);
  }, []);

  const value = {
    sessionId,
    userId,
    isAuthenticated,
    username,
    resume,
    resumeJson,
    isResumeLoading,
    isResumeSaving,
    updateResume,
    updateResumeJson,
    saveResumeChanges,
    applyAndSave,
    setFullResume,
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    refreshEmbedding,
    ...jobStatesHook,
    graphVersion,
    triggerGraphRefresh,
    migrateToUser,
    pendingJobFeedback,
    promptJobFeedback,
    clearPendingJobFeedback,
  };

  return (
    <PathwaysContext.Provider value={value}>
      {children}
    </PathwaysContext.Provider>
  );
}

export function usePathways() {
  const context = useContext(PathwaysContext);
  if (!context) {
    throw new Error('usePathways must be used within a PathwaysProvider');
  }
  return context;
}

export default PathwaysContext;
