import { useState, useEffect } from 'react';
import { calculateSalaryRange } from '../utils/salaryParser';

/**
 * Hook to calculate and manage salary range from job data
 * @param {Object} jobInfo - Job info map
 * @returns {Object} { min, max } salary range
 */
export const useSalaryRange = (jobInfo) => {
  const [salaryRange, setSalaryRange] = useState({
    min: Infinity,
    max: -Infinity,
  });

  useEffect(() => {
    if (!jobInfo) return;

    const range = calculateSalaryRange(jobInfo);
    if (range.min !== Infinity && range.max !== -Infinity) {
      setSalaryRange(range);
    }
  }, [jobInfo]);

  return salaryRange;
};
