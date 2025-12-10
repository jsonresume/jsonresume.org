import { useState, useEffect } from 'react';

/**
 * Hook to manage job filtering based on search text and remote filter
 * @param {string} filterText - Search text
 * @param {Object} jobInfo - Job info map
 * @param {boolean} remoteOnly - Filter to remote jobs only
 * @returns {Set} Set of filtered node IDs
 */
export const useJobFiltering = (filterText, jobInfo, remoteOnly = false) => {
  const [filteredNodes, setFilteredNodes] = useState(new Set());

  useEffect(() => {
    if (!jobInfo) {
      setFilteredNodes(new Set());
      return;
    }

    // If no filters active, return empty set (shows all)
    if (!filterText.trim() && !remoteOnly) {
      setFilteredNodes(new Set());
      return;
    }

    const searchText = filterText.toLowerCase();
    const matches = new Set();

    Object.entries(jobInfo).forEach(([id, job]) => {
      // Check remote filter first
      if (remoteOnly && !job.remote) {
        return; // Skip non-remote jobs
      }

      // If only remote filter is active (no text), add all remote jobs
      if (!filterText.trim()) {
        matches.add(id);
        return;
      }

      // Check text filter
      const searchableText = [
        job.title,
        job.company,
        job.description,
        job.type,
        job.location?.city,
        job.location?.region,
        job.skills?.map((s) => s.name).join(' '),
        job.qualifications?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (searchableText.includes(searchText)) {
        matches.add(id);
      }
    });

    setFilteredNodes(matches);
  }, [filterText, jobInfo, remoteOnly]);

  return filteredNodes;
};
