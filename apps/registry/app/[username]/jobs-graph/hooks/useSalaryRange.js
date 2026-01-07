import { useState, useEffect, useCallback } from 'react';
import { calculateSalaryRangeWithPercentiles } from '../utils/salaryParser';

/**
 * Hook to calculate and manage salary range from job data
 * Uses percentile-based range to handle outliers gracefully
 * @param {Object} jobInfo - Job info map
 * @returns {Object} salary range data including histogram and filter controls
 */
export const useSalaryRange = (jobInfo) => {
  const [salaryData, setSalaryData] = useState({
    min: 0,
    max: 0,
    p5: 0,
    p95: 0,
    histogram: [],
    salaries: [],
  });

  // User-selected filter range (null means no filter)
  const [filterRange, setFilterRange] = useState(null);

  useEffect(() => {
    if (!jobInfo || Object.keys(jobInfo).length === 0) return;

    const range = calculateSalaryRangeWithPercentiles(jobInfo);
    if (range.min !== 0 || range.max !== 0) {
      setSalaryData(range);
    }
  }, [jobInfo]);

  // Reset filter when data changes
  const resetFilter = useCallback(() => {
    setFilterRange(null);
  }, []);

  // Set filter range
  const setFilter = useCallback(
    (min, max) => {
      if (min === salaryData.min && max === salaryData.max) {
        setFilterRange(null); // Full range = no filter
      } else {
        setFilterRange({ min, max });
      }
    },
    [salaryData.min, salaryData.max]
  );

  return {
    ...salaryData,
    filterRange,
    setFilterRange: setFilter,
    resetFilter,
    hasFilter: filterRange !== null,
  };
};
