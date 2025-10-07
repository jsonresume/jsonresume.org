'use client';

import { createContext, useContext } from 'react';
import { logger } from '@/lib/logger';
import { useResumeData } from './ResumeProviderModule/hooks/useResumeData';
import {
  updateGistContent,
  createNewGist,
} from './ResumeProviderModule/utils/gistOperations';

// Re-export constant for backward compatibility
export { RESUME_GIST_NAME } from './ResumeProviderModule/constants';

const ResumeContext = createContext({
  resume: null,
  gistId: null,
  loading: true,
  error: null,
  username: null,
  updateGist: async () => {},
  createGist: async () => {},
});

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

export function ResumeProvider({ children, targetUsername }) {
  const { resume, setResume, gistId, setGistId, loading, error, username } =
    useResumeData(targetUsername);

  const updateGist = async (resumeContent) => {
    try {
      await updateGistContent(resumeContent, setGistId, setResume);
    } catch (error) {
      logger.error({ error: error.message, username }, 'Error updating gist');
      throw error;
    }
  };

  const createGist = async (sampleResume) => {
    try {
      return await createNewGist(sampleResume, setGistId, setResume);
    } catch (error) {
      logger.error({ error: error.message, username }, 'Error creating gist');
      throw error;
    }
  };

  const value = {
    resume,
    gistId,
    loading,
    error,
    username,
    updateGist,
    createGist,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}
