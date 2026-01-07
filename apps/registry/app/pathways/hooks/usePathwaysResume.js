'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import applyResumeChanges from '../utils/applyResumeChanges';

/**
 * Hook for managing Pathways resume persistence
 * Loads resume from DB and provides save functionality
 */
export default function usePathwaysResume({ sessionId, userId }) {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  // Track which IDs we've fetched with to know when to re-fetch
  const fetchedWithRef = useRef({ sessionId: null, userId: null });

  // Load resume when sessionId or userId changes
  useEffect(() => {
    // Skip if no identifiers available
    if (!sessionId && !userId) {
      setIsLoading(false);
      return;
    }

    // Skip if we've already fetched with these exact IDs
    const alreadyFetched =
      fetchedWithRef.current.sessionId === sessionId &&
      fetchedWithRef.current.userId === userId;

    if (alreadyFetched) {
      return;
    }

    // Track what we're fetching with
    fetchedWithRef.current = { sessionId, userId };

    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (userId) {
      params.set('userId', userId);
    } else {
      params.set('sessionId', sessionId);
    }

    fetch(`/api/pathways/resume?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        // data.resume is the full record, resume.resume is the actual data
        if (data.resume?.resume) {
          setResume(data.resume.resume);
        } else {
          // No resume exists yet, start with null (will show sample in context)
          setResume(null);
        }
      })
      .catch((err) => {
        console.error('Failed to load resume:', err);
        setError(err.message);
        // Start with null on error (will show sample in context)
        setResume(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sessionId, userId]);

  /**
   * Save changes to resume
   * @param {object} diff - The changes to apply
   * @param {string} explanation - AI explanation of changes
   * @param {string} source - Source of changes: 'ai_update', 'file_upload', 'manual_edit'
   */
  const saveChanges = useCallback(
    async (diff, explanation, source) => {
      if (!sessionId && !userId) {
        return { success: false, error: 'No session or user' };
      }

      setIsSaving(true);
      setError(null);

      try {
        const body = {
          diff,
          explanation,
          source,
        };

        if (userId) {
          body.userId = userId;
        } else {
          body.sessionId = sessionId;
        }

        const response = await fetch('/api/pathways/resume', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Update local state with the server's version
        if (data.resume?.resume) {
          setResume(data.resume.resume);
        }
        setLastSaved(new Date());

        return { success: true, resume: data.resume?.resume };
      } catch (err) {
        console.error('Failed to save resume:', err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsSaving(false);
      }
    },
    [sessionId, userId]
  );

  /**
   * Apply changes locally and save to server
   * Combines applyResumeChanges + saveChanges for convenience
   */
  const applyAndSave = useCallback(
    async (diff, explanation, source) => {
      // Apply locally first for immediate UI feedback
      const updated = applyResumeChanges(resume || {}, diff);
      setResume(updated);

      // Then persist to server
      const result = await saveChanges(diff, explanation, source);

      // If save failed, the local state is still updated
      // Server state will be reconciled on next load
      return result;
    },
    [resume, saveChanges]
  );

  /**
   * Set full resume (for file uploads or resets)
   * @param {object} newResume - Full resume object
   * @param {string} source - Source of changes
   */
  const setFullResume = useCallback(
    async (newResume, source = 'file_upload') => {
      if (!sessionId && !userId) {
        return { success: false, error: 'No session or user' };
      }

      setIsSaving(true);
      setError(null);

      try {
        const body = {
          diff: newResume, // Full resume as diff for initial creation
          explanation: 'Full resume upload/import',
          source,
        };

        if (userId) {
          body.userId = userId;
        } else {
          body.sessionId = sessionId;
        }

        const response = await fetch('/api/pathways/resume', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.resume?.resume) {
          setResume(data.resume.resume);
        }
        setLastSaved(new Date());

        return { success: true, resume: data.resume?.resume };
      } catch (err) {
        console.error('Failed to set resume:', err);
        setError(err.message);
        return { success: false, error: err.message };
      } finally {
        setIsSaving(false);
      }
    },
    [sessionId, userId]
  );

  /**
   * Update local resume state without saving
   * Useful for optimistic updates before save
   */
  const updateLocal = useCallback((newResume) => {
    setResume(newResume);
  }, []);

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
