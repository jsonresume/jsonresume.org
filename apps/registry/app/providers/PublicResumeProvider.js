'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { logger } from '@/lib/logger';

const PublicResumeContext = createContext({
  resume: null,
  loading: true,
  error: null,
});

export function usePublicResume() {
  const context = useContext(PublicResumeContext);
  if (!context) {
    throw new Error(
      'usePublicResume must be used within a PublicResumeProvider'
    );
  }
  return context;
}

/**
 * PublicResumeProvider fetches resume data from the public API endpoint
 * No authentication required - suitable for public dashboard pages
 */
export function PublicResumeProvider({ username, children }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPublicResume = async () => {
      try {
        setLoading(true);
        setError(null);

        const gistname = searchParams.get('gistname');
        const url = gistname
          ? `/api/${username}.json?gistname=${encodeURIComponent(gistname)}`
          : `/api/${username}.json`;

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Resume not found');
          }
          throw new Error(`Failed to fetch resume: ${response.statusText}`);
        }

        const data = await response.json();
        setResume(data);
      } catch (err) {
        logger.error(
          {
            error: err.message,
            username,
            gistname: searchParams.get('gistname'),
          },
          'Error fetching public resume'
        );
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPublicResume();
    }
  }, [username, searchParams]);

  const value = {
    resume,
    loading,
    error,
  };

  return (
    <PublicResumeContext.Provider value={value}>
      {children}
    </PublicResumeContext.Provider>
  );
}
