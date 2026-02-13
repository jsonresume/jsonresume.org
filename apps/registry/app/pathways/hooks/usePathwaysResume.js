'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import applyResumeChanges from '../utils/applyResumeChanges';
import { patchResume, buildResumeParams } from './resumeApiHelpers';

/**
 * Hook for managing Pathways resume persistence.
 * Loads resume from DB and provides save functionality.
 */
export default function usePathwaysResume({ sessionId, userId }) {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const fetchedWithRef = useRef({ sessionId: null, userId: null });

  // Load resume when sessionId or userId changes
  useEffect(() => {
    if (!sessionId && !userId) {
      setIsLoading(false);
      return;
    }

    const alreadyFetched =
      fetchedWithRef.current.sessionId === sessionId &&
      fetchedWithRef.current.userId === userId;
    if (alreadyFetched) return;

    fetchedWithRef.current = { sessionId, userId };
    setIsLoading(true);
    setError(null);

    const params = buildResumeParams(userId, sessionId);

    fetch(`/api/pathways/resume?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setResume(data.resume?.resume ?? null);
      })
      .catch((err) => {
        logger.error({ error: err.message }, 'Failed to load resume');
        setError(err.message);
        setResume(null);
      })
      .finally(() => setIsLoading(false));
  }, [sessionId, userId]);

  /**
   * Save changes to resume.
   */
  const saveChanges = useCallback(
    async (diff, explanation, source) => {
      setIsSaving(true);
      setError(null);
      try {
        const data = await patchResume({
          sessionId,
          userId,
          body: { diff, explanation, source },
        });
        if (data.resume?.resume) setResume(data.resume.resume);
        setLastSaved(new Date());
        return { success: true, resume: data.resume?.resume };
      } catch (err) {
        logger.error({ error: err.message }, 'Failed to save resume');
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsSaving(false);
      }
    },
    [sessionId, userId]
  );

  /**
   * Apply changes locally and save to server.
   */
  const applyAndSave = useCallback(
    async (diff, explanation, source) => {
      const updated = applyResumeChanges(resume || {}, diff);
      setResume(updated);
      return await saveChanges(diff, explanation, source);
    },
    [resume, saveChanges]
  );

  /**
   * Set full resume (for file uploads or resets).
   */
  const setFullResume = useCallback(
    async (newResume, source = 'file_upload') => {
      setIsSaving(true);
      setError(null);
      try {
        const data = await patchResume({
          sessionId,
          userId,
          body: {
            diff: newResume,
            explanation: 'Full resume replacement',
            source,
            replace: true,
          },
        });
        if (data.resume?.resume) setResume(data.resume.resume);
        setLastSaved(new Date());
        return { success: true, resume: data.resume?.resume };
      } catch (err) {
        logger.error({ error: err.message }, 'Failed to set resume');
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsSaving(false);
      }
    },
    [sessionId, userId]
  );

  const updateLocal = useCallback((newResume) => setResume(newResume), []);

  return {
    resume,
    isLoading,
    isSaving,
    error,
    lastSaved,
    saveChanges,
    applyAndSave,
    setFullResume,
    updateLocal,
  };
}
