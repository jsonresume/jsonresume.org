import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage read job state with localStorage persistence
 * @param {string} username - Current username
 * @returns {Object} { readJobs, markJobAsRead }
 */
export const useReadJobs = (username) => {
  const [readJobs, setReadJobs] = useState(new Set());

  // Load read jobs from localStorage
  useEffect(() => {
    const storedReadJobs = localStorage.getItem(`readJobs_${username}`);
    if (storedReadJobs) {
      setReadJobs(new Set(JSON.parse(storedReadJobs)));
    }
  }, [username]);

  // Mark job as read and save to localStorage
  const markJobAsRead = useCallback(
    (jobId) => {
      const newReadJobs = new Set(readJobs);
      const key = `${username}_${jobId}`;
      newReadJobs.add(key);
      setReadJobs(newReadJobs);
      localStorage.setItem(
        `readJobs_${username}`,
        JSON.stringify([...newReadJobs])
      );
    },
    [readJobs, username]
  );

  return { readJobs, markJobAsRead };
};
