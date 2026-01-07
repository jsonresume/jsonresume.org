'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useJobStates } from '@/app/hooks/useJobStates';
import { SAMPLE_RESUME } from './sampleResume';
import {
  getSessionId,
  clearSessionId,
  getLocalJobStates,
  clearLocalJobStates,
} from './sessionUtils';
import pathwaysToast from '../utils/toastMessages';

const PathwaysContext = createContext(null);

export function PathwaysProvider({
  children,
  username = null,
  isAuthenticated = false,
}) {
  const [sessionId, setSessionId] = useState(null);
  const [resume, setResume] = useState(SAMPLE_RESUME);
  const [resumeJson, setResumeJson] = useState(() =>
    JSON.stringify(SAMPLE_RESUME, null, 2)
  );
  const [isResumeLoading, setIsResumeLoading] = useState(false);
  const [embedding, setEmbedding] = useState(null);
  const [isEmbeddingLoading, setIsEmbeddingLoading] = useState(false);
  const [graphVersion, setGraphVersion] = useState(0);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const jobStatesHook = useJobStates({
    sessionId,
    username,
    isAuthenticated,
  });

  const updateResume = useCallback((newResume) => {
    setResume(newResume);
    setResumeJson(JSON.stringify(newResume, null, 2));
  }, []);

  const updateResumeJson = useCallback((json) => {
    setResumeJson(json);
    try {
      const parsed = JSON.parse(json);
      setResume(parsed);
    } catch {
      // Invalid JSON, don't update object
    }
  }, []);

  const refreshEmbedding = useCallback(async () => {
    if (!resume) return null;

    setIsEmbeddingLoading(true);
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
      setEmbedding(data.embedding);
      setGraphVersion((v) => v + 1);
      return data.embedding;
    } catch (error) {
      pathwaysToast.embeddingError();
      return null;
    } finally {
      setIsEmbeddingLoading(false);
    }
  }, [resume]);

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

  // Load user's resume on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && username) {
      setIsResumeLoading(true);
      fetch(`/api/resumes?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.resume) {
            const parsed =
              typeof data.resume === 'string'
                ? JSON.parse(data.resume)
                : data.resume;
            setResume(parsed);
            setResumeJson(JSON.stringify(parsed, null, 2));
          }
        })
        .catch((err) => console.error('Failed to load resume:', err))
        .finally(() => setIsResumeLoading(false));
    }
  }, [isAuthenticated, username]);

  // Generate initial embedding when resume is set
  useEffect(() => {
    if (resume && !embedding && !isEmbeddingLoading) {
      refreshEmbedding();
    }
  }, [resume, embedding, isEmbeddingLoading, refreshEmbedding]);

  const value = {
    sessionId,
    isAuthenticated,
    username,
    resume,
    resumeJson,
    isResumeLoading,
    updateResume,
    updateResumeJson,
    setResume,
    setResumeJson,
    embedding,
    isEmbeddingLoading,
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
