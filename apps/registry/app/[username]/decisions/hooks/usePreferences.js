/**
 * usePreferences — loads a user's job-evaluation preferences, persists changes
 * to the backend, and exposes toggle / value-change handlers.
 */
import { useState, useEffect } from 'react';
import {
  buildDefaultPreferences,
  mergeWithDefaults,
} from '../components/preferencesCriteria';

export function usePreferences(user, onChange) {
  const [preferences, setPreferences] = useState({});
  const [loading, setLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const response = await fetch(
          `/api/decisions/preferences?userId=${user.id}`
        );
        if (!response.ok) throw new Error('Failed to load preferences');

        const data = await response.json();

        // Convert array to object keyed by criterion
        const prefsMap = {};
        data.forEach((pref) => {
          prefsMap[pref.criterion] = {
            enabled: pref.enabled,
            value: pref.value,
          };
        });

        setPreferences(mergeWithDefaults(prefsMap));
      } catch (error) {
        console.error('Error loading preferences:', error);
        // Initialize with defaults on error
        setPreferences(buildDefaultPreferences());
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preference to backend
  const savePreference = async (criterion, enabled, value) => {
    if (!user) return;

    try {
      const response = await fetch('/api/decisions/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          criterion,
          enabled,
          value,
        }),
      });

      if (!response.ok) throw new Error('Failed to save preference');

      // Notify parent component
      if (onChange) {
        onChange(criterion, enabled, value);
      }
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  // Toggle criterion enabled/disabled
  const handleToggle = async (criterionId) => {
    const current = preferences[criterionId];
    const newEnabled = !current.enabled;

    setPreferences((prev) => ({
      ...prev,
      [criterionId]: { ...current, enabled: newEnabled },
    }));

    await savePreference(criterionId, newEnabled, current.value);
  };

  // Update criterion value
  const handleValueChange = async (criterionId, newValue) => {
    const current = preferences[criterionId];

    setPreferences((prev) => ({
      ...prev,
      [criterionId]: { ...current, value: newValue },
    }));

    await savePreference(criterionId, current.enabled, newValue);
  };

  return { preferences, loading, handleToggle, handleValueChange };
}
