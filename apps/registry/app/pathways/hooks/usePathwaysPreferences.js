import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathways } from '../context/PathwaysContext';

const SAVE_DEBOUNCE_MS = 1000;

/**
 * Hook to persist and restore user preferences for Pathways graph
 */
export function usePathwaysPreferences() {
  const { session } = usePathways();
  const userId = session?.user?.id;

  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef(null);
  const pendingPrefsRef = useRef(null);

  // Load preferences on mount
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const res = await fetch(`/api/pathways/preferences?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setPreferences(data);
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  // Debounced save function
  const savePreferences = useCallback(
    (newPrefs) => {
      if (!userId) return;

      // Store pending preferences
      pendingPrefsRef.current = { ...pendingPrefsRef.current, ...newPrefs };

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounce save
      saveTimeoutRef.current = setTimeout(async () => {
        const prefsToSave = pendingPrefsRef.current;
        pendingPrefsRef.current = null;

        try {
          await fetch(`/api/pathways/preferences?userId=${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prefsToSave),
          });
        } catch (error) {
          console.error('Failed to save preferences:', error);
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [userId]
  );

  // Update a specific preference
  const updatePreference = useCallback(
    (key, value) => {
      setPreferences((prev) => {
        const updated = { ...prev, [key]: value };
        savePreferences(updated);
        return updated;
      });
    },
    [savePreferences]
  );

  // Update viewport
  const updateViewport = useCallback(
    (viewport) => {
      setPreferences((prev) => {
        const updated = { ...prev, viewport };
        savePreferences(updated);
        return updated;
      });
    },
    [savePreferences]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    preferences,
    isLoading,
    updatePreference,
    updateViewport,
    savePreferences,
  };
}
