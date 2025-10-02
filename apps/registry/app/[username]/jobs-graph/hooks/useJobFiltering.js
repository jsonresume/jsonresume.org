import { useState, useEffect } from 'react';

/**
 * Hook to manage job filtering based on search text
 * @param {string} filterText - Search text
 * @param {Object} jobInfo - Job info map
 * @returns {Set} Set of filtered node IDs
 */
export const useJobFiltering = (filterText, jobInfo) => {
  const [filteredNodes, setFilteredNodes] = useState(new Set());

  useEffect(() => {
    if (!filterText.trim() || !jobInfo) {
      setFilteredNodes(new Set());
      return;
    }

    const searchText = filterText.toLowerCase();
    const matches = new Set();

    Object.entries(jobInfo).forEach(([id, job]) => {
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
  }, [filterText, jobInfo]);

  return filteredNodes;
};
