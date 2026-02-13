'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook to manage debounced resume saving with beforeunload safety.
 */
export default function useResumeSave({ setFullResume, userId, sessionId }) {
  const saveTimeoutRef = useRef(null);
  const lastSavedJsonRef = useRef(null);
  const pendingJsonRef = useRef(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  // Use refs for beforeunload to always have current values
  const userIdRef = useRef(userId);
  const sessionIdRef = useRef(sessionId);

  useEffect(() => {
    userIdRef.current = userId;
    sessionIdRef.current = sessionId;
  }, [userId, sessionId]);

  // Immediate save (no debounce)
  const saveNow = useCallback(
    async (json) => {
      if (!json || json === lastSavedJsonRef.current) return;
      try {
        const parsed = JSON.parse(json);
        await setFullResume(parsed, 'manual_edit');
        lastSavedJsonRef.current = json;
        pendingJsonRef.current = null;
        setHasPendingChanges(false);
      } catch {
        // Invalid JSON, don't save
      }
    },
    [setFullResume]
  );

  // Debounced save for typing
  const debouncedSave = useCallback(
    (json) => {
      pendingJsonRef.current = json;
      setHasPendingChanges(json !== lastSavedJsonRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => saveNow(json), 500);
    },
    [saveNow]
  );

  // Save pending changes before page unload via sendBeacon
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (
        pendingJsonRef.current &&
        pendingJsonRef.current !== lastSavedJsonRef.current
      ) {
        try {
          const parsed = JSON.parse(pendingJsonRef.current);
          const payload = {
            diff: parsed,
            explanation: 'Full resume replacement',
            source: 'manual_edit',
            replace: true,
          };
          if (userIdRef.current) payload.userId = userIdRef.current;
          else if (sessionIdRef.current)
            payload.sessionId = sessionIdRef.current;

          navigator.sendBeacon(
            '/api/pathways/resume',
            new Blob([JSON.stringify(payload)], { type: 'application/json' })
          );
        } catch {
          // Invalid JSON
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  return { hasPendingChanges, debouncedSave };
}
