'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import usePathwaysResume from '../hooks/usePathwaysResume';
import { SAMPLE_RESUME } from '../context/sampleResume';
import type {
  Resume,
  ResumeChanges,
  ChangeSource,
} from '../services/ResumeService';

// ============================================================================
// Types
// ============================================================================

interface ResumeContextValue {
  resume: Resume;
  resumeJson: string;
  isResumeLoading: boolean;
  isResumeSaving: boolean;
  updateResume: (resume: Resume) => void;
  updateResumeJson: (json: string) => void;
  saveResumeChanges: (
    diff: ResumeChanges,
    explanation: string,
    source: ChangeSource
  ) => Promise<{ success: boolean; error?: string }>;
  applyAndSave: (
    diff: ResumeChanges,
    explanation: string,
    source: ChangeSource
  ) => Promise<{ success: boolean; error?: string }>;
  setFullResume: (
    resume: Resume,
    source?: ChangeSource
  ) => Promise<{ success: boolean; error?: string }>;
}

interface ResumeProviderProps {
  children: ReactNode;
  sessionId: string | null;
  userId: string | null;
}

// ============================================================================
// Context
// ============================================================================

const ResumeContext = createContext<ResumeContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

export function ResumeProvider({
  children,
  sessionId,
  userId,
}: ResumeProviderProps) {
  // Use the Pathways resume persistence hook
  const {
    resume: dbResume,
    isLoading: isResumeLoading,
    isSaving: isResumeSaving,
    saveChanges: saveResumeChanges,
    applyAndSave,
    setFullResume: setFullResumeHook,
    updateLocal: updateResumeLocal,
  } = usePathwaysResume({ sessionId, userId });

  // Derive resume state - use DB resume if it has content, otherwise sample
  const hasResumeContent = dbResume && Object.keys(dbResume).length > 0;
  const resume = (hasResumeContent ? dbResume : SAMPLE_RESUME) as Resume;

  // JSON string representation for the editor
  const [resumeJson, setResumeJson] = useState(() =>
    JSON.stringify(SAMPLE_RESUME, null, 2)
  );

  // Sync resumeJson when resume changes
  useEffect(() => {
    if (resume) {
      setResumeJson(JSON.stringify(resume, null, 2));
    }
  }, [resume]);

  // Update resume locally (for immediate UI feedback)
  const updateResume = useCallback(
    (newResume: Resume) => {
      updateResumeLocal(newResume);
      setResumeJson(JSON.stringify(newResume, null, 2));
    },
    [updateResumeLocal]
  );

  // Update resume JSON string (from editor)
  const updateResumeJson = useCallback(
    (json: string) => {
      setResumeJson(json);
      try {
        const parsed = JSON.parse(json) as Resume;
        updateResumeLocal(parsed);
      } catch {
        // Invalid JSON, don't update object
      }
    },
    [updateResumeLocal]
  );

  // Wrap setFullResume to provide default source
  const setFullResume = useCallback(
    async (newResume: Resume, source: ChangeSource = 'file_upload') => {
      return setFullResumeHook(newResume, source);
    },
    [setFullResumeHook]
  );

  const value: ResumeContextValue = {
    resume,
    resumeJson,
    isResumeLoading,
    isResumeSaving,
    updateResume,
    updateResumeJson,
    saveResumeChanges,
    applyAndSave,
    setFullResume,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useResume(): ResumeContextValue {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}

export default ResumeContext;
