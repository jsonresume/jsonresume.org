/**
 * Parses salary from various string formats
 * Handles: numbers, k multiplier, ranges
 * @param {string|number} salary - Salary to parse
 * @returns {number|null} Parsed salary value
 */
export const parseSalary = (salary) => {
  if (!salary) return null;
  if (typeof salary === 'number') return salary;

  const str = salary.toString().toLowerCase();
  // Extract all numbers from the string
  const numbers = str.match(/\d+(?:\.\d+)?/g);
  if (!numbers) return null;

  // Convert numbers considering k/K multiplier
  const values = numbers.map((num) => {
    const multiplier = str.includes('k') ? 1000 : 1;
    return parseFloat(num) * multiplier;
  });

  // If range, return average
  if (values.length > 1) {
    values.sort((a, b) => a - b);
    return (values[0] + values[values.length - 1]) / 2;
  }

  return values[0];
};

/**
 * Calculates min/max salary range from job data
 * @param {Object} jobInfo - Job info map
 * @returns {Object} { min, max } salary range
 */
export const calculateSalaryRange = (jobInfo) => {
  let min = Infinity;
  let max = -Infinity;

  Object.values(jobInfo).forEach((job) => {
    const salary = parseSalary(job.salary);
    if (salary) {
      min = Math.min(min, salary);
      max = Math.max(max, salary);
    }
  });

  if (min === Infinity || max === -Infinity) {
    return { min: 0, max: 0 };
  }

  return { min, max };
};
