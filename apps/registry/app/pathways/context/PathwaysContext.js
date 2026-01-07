'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useAuth } from '@/app/context/auth';
import { useJobStates } from '@/app/hooks/useJobStates';
import usePathwaysResume from '../hooks/usePathwaysResume';
import { SAMPLE_RESUME } from './sampleResume';
import {
  getSessionId,
  clearSessionId,
  getLocalJobStates,
  clearLocalJobStates,
} from './sessionUtils';
import pathwaysToast from '../utils/toastMessages';
import {
  hashResume,
  getCachedEmbedding,
  setCachedEmbedding,
} from '../utils/pathwaysCache';

// Embedding loading stages
export const EMBEDDING_STAGES = {
  IDLE: 'idle',
  CHECKING_CACHE: 'checking_cache',
  CACHE_HIT: 'cache_hit',
  GENERATING: 'generating',
  COMPLETE: 'complete',
};

const PathwaysContext = createContext(null);

export function PathwaysProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id || null;
  const username = user?.user_metadata?.user_name || null;
  const isAuthenticated = !!user;

  const [sessionId, setSessionId] = useState(null);
  const [embedding, setEmbedding] = useState(null);
  const [isEmbeddingLoading, setIsEmbeddingLoading] = useState(false);
  const [embeddingStage, setEmbeddingStage] = useState(EMBEDDING_STAGES.IDLE);
  const [graphVersion, setGraphVersion] = useState(0);
  const lastResumeHashRef = useRef(null);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Use the new Pathways resume persistence hook
  const {
    resume: dbResume,
    isLoading: isResumeLoading,
    isSaving: isResumeSaving,
    saveChanges: saveResumeChanges,
    applyAndSave,
    setFullResume,
    updateLocal: updateResumeLocal,
  } = usePathwaysResume({ sessionId, userId });

  // Derive resume state - use DB resume if it has content, otherwise sample
  // Note: empty object {} from DB should show sample, only populated resumes should override
  const hasResumeContent = dbResume && Object.keys(dbResume).length > 0;
  const resume = hasResumeContent ? dbResume : SAMPLE_RESUME;
  const [resumeJson, setResumeJson] = useState(() =>
    JSON.stringify(SAMPLE_RESUME, null, 2)
  );

  // Sync resumeJson when resume changes
  useEffect(() => {
    if (resume) {
      setResumeJson(JSON.stringify(resume, null, 2));
    }
  }, [resume]);

  const jobStatesHook = useJobStates({
    sessionId,
    username,
    isAuthenticated,
  });

  // Update resume locally (for immediate UI feedback)
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

  const refreshEmbedding = useCallback(
    async (forceRefresh = false) => {
      if (!resume) return null;

      const resumeHash = hashResume(resume);
      setIsEmbeddingLoading(true);
      setEmbeddingStage(EMBEDDING_STAGES.CHECKING_CACHE);

      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cached = await getCachedEmbedding(resumeHash);
        if (cached) {
          setEmbeddingStage(EMBEDDING_STAGES.CACHE_HIT);
          // Small delay so user sees cache hit
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

        // Cache the embedding
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

  const triggerGraphRefresh = useCallback(() => {
    setGraphVersion((v) => v + 1);
  }, []);

  const migrateToUser = useCallback(
    async (newUsername) => {
      if (!sessionId)
        return { success: false, message: 'No session to migrate' };

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
        console.error('Migration error:', error);
        return { success: false, message: error.message };
      }
    },
    [sessionId]
  );

  // Resume loading is now handled by usePathwaysResume hook

  // Generate initial embedding when resume is set
  useEffect(() => {
    if (resume && !embedding && !isEmbeddingLoading) {
      refreshEmbedding();
    }
  }, [resume, embedding, isEmbeddingLoading, refreshEmbedding]);

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
    saveResumeChanges, // Save diff to DB with history
    applyAndSave, // Apply locally + save to DB
    setFullResume, // For file uploads
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    refreshEmbedding,
    ...jobStatesHook,
    graphVersion,
    triggerGraphRefresh,
    migrateToUser,
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
