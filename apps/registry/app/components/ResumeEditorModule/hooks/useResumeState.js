import { useState, useEffect } from 'react';
import { defaultResume } from '../data/defaultResume';

export const useResumeState = (initialResume) => {
  const [resume, setResume] = useState(() => {
    if (!initialResume) return defaultResume;
    try {
      return typeof initialResume === 'string'
        ? JSON.parse(initialResume)
        : initialResume;
    } catch (error) {
      console.error('Error parsing initial resume:', error);
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
      console.error('Error storing original resume:', error);
      return JSON.stringify(defaultResume);
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const currentResumeStr = JSON.stringify(resume, null, 2);
    setHasChanges(currentResumeStr !== originalResume);
  }, [resume, originalResume]);

  return {
    resume,
    setResume,
    originalResume,
    setOriginalResume,
    hasChanges,
    setHasChanges,
  };
};
