import { useState, useEffect, useMemo } from 'react';
import { logger } from '@/lib/logger';
import { defaultResume } from '../data/defaultResume';

export const useResumeState = (initialResume) => {
  const [resume, setResume] = useState(() => {
    if (!initialResume) return defaultResume;
    try {
      return typeof initialResume === 'string'
        ? JSON.parse(initialResume)
        : initialResume;
    } catch (error) {
      logger.error({ error: error.message }, 'Error parsing initial resume');
      return defaultResume;
    }
  });

  const [originalResume, setOriginalResume] = useState(() => {
    if (!initialResume) return JSON.stringify(defaultResume);
    try {
      return typeof initialResume === 'string'
        ? initialResume
        : JSON.stringify(initialResume, null, 2);
    } catch (error) {
      logger.error({ error: error.message }, 'Error storing original resume');
      return JSON.stringify(defaultResume);
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Memoize the stringified resume to avoid repeated JSON.stringify calls
  const currentResumeStr = useMemo(
    () => JSON.stringify(resume, null, 2),
    [resume]
  );

  useEffect(() => {
    setHasChanges(currentResumeStr !== originalResume);
  }, [currentResumeStr, originalResume]);

  return {
    resume,
    setResume,
    originalResume,
    setOriginalResume,
    hasChanges,
    setHasChanges,
  };
};
