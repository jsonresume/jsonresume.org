import { useState, useEffect } from 'react';
import { calculateSalaryRangeWithPercentiles } from '../utils/salaryParser';

/**
 * Hook to calculate and manage salary range from job data
 * Uses percentile-based range to handle outliers gracefully
 * @param {Object} jobInfo - Job info map
 * @returns {Object} { min, max, p5, p95 } salary range with percentile bounds
 */
export const useSalaryRange = (jobInfo) => {
  const [salaryRange, setSalaryRange] = useState({
    min: 0,
    max: 0,
    p5: 0,
    p95: 0,
  });

  useEffect(() => {
    if (!jobInfo) return;

    const range = calculateSalaryRangeWithPercentiles(jobInfo);
    if (range.min !== 0 || range.max !== 0) {
      setSalaryRange(range);
    }
  }, [jobInfo]);

  return salaryRange;
};
