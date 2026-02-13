'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathwaysPreferences } from './usePathwaysPreferences';

/**
 * Hook to manage graph filter/viewport preferences with persistence.
 */
export function useGraphPreferences() {
  const { preferences, savePreferences } = usePathwaysPreferences();
  const initializedRef = useRef(false);

  // UI state
  const [filterText, setFilterText] = useState('');
  const [showSalaryGradient, setShowSalaryGradient] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [hideFiltered, setHideFiltered] = useState(false);
  const [timeRange, setTimeRange] = useState('1m');
  const [initialViewport, setInitialViewport] = useState(null);

  // Initialize state from persisted preferences
  useEffect(() => {
    if (preferences && !initializedRef.current) {
      initializedRef.current = true;
      setFilterText(preferences.filterText || '');
      setShowSalaryGradient(preferences.showSalaryGradient || false);
      setRemoteOnly(preferences.remoteOnly || false);
      setHideFiltered(preferences.hideFiltered || false);
      setTimeRange(preferences.timeRange || '1m');
      if (preferences.viewport) {
        setInitialViewport(preferences.viewport);
      }
    }
  }, [preferences]);

  // Save preferences when filters change
  useEffect(() => {
    if (!initializedRef.current) return;
    savePreferences({
      filterText,
      showSalaryGradient,
      remoteOnly,
      hideFiltered,
      timeRange,
    });
  }, [
    filterText,
    showSalaryGradient,
    remoteOnly,
    hideFiltered,
    timeRange,
    savePreferences,
  ]);

  const handleClearFilters = useCallback(() => {
    setFilterText('');
    setRemoteOnly(false);
    setHideFiltered(false);
    setTimeRange('1m');
  }, []);

  const handleMoveEnd = useCallback(
    (_, viewport) => {
      if (!initializedRef.current) return;
      savePreferences({ viewport });
    },
    [savePreferences]
  );

  return {
    filterText,
    setFilterText,
    showSalaryGradient,
    setShowSalaryGradient,
    remoteOnly,
    setRemoteOnly,
    hideFiltered,
    setHideFiltered,
    timeRange,
    setTimeRange,
    initialViewport,
    initializedRef,
    handleClearFilters,
    handleMoveEnd,
  };
}
