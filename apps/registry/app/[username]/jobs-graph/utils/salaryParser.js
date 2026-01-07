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
 * Gets salary value for a job, preferring normalized database values
 * @param {Object} job - Job object with potential salaryMax/salaryUsd fields
 * @returns {number|null} Salary value (prefers salaryMax, falls back to parsing)
 */
export const getJobSalary = (job) => {
  // Prefer normalized database values
  if (job.salaryMax) return job.salaryMax;
  if (job.salaryUsd) return job.salaryUsd;
  // Fall back to parsing salary string
  return parseSalary(job.salary);
};

/**
 * Gets salary range for a job from normalized data
 * @param {Object} job - Job object
 * @returns {Object} { min, max } or null if no salary data
 */
export const getJobSalaryRange = (job) => {
  if (job.salaryMin && job.salaryMax) {
    return { min: job.salaryMin, max: job.salaryMax };
  }
  if (job.salaryUsd) {
    return { min: job.salaryUsd, max: job.salaryUsd };
  }
  const parsed = parseSalary(job.salary);
  return parsed ? { min: parsed, max: parsed } : null;
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
    const salary = getJobSalary(job);
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

/**
 * Calculates salary range with percentile boundaries for outlier handling
 * Uses percentiles to prevent extreme outliers from compressing the gradient
 * @param {Object} jobInfo - Job info map
 * @param {number} lowerPct - Lower percentile (default 5)
 * @param {number} upperPct - Upper percentile (default 95)
 * @returns {Object} { min, max, p5, p95, salaries, histogram } salary range with percentile bounds and histogram data
 */
export const calculateSalaryRangeWithPercentiles = (
  jobInfo,
  lowerPct = 5,
  upperPct = 95
) => {
  const salaries = Object.values(jobInfo)
    .map((job) => getJobSalary(job))
    .filter((s) => s !== null && s > 0)
    .sort((a, b) => a - b);

  if (salaries.length === 0) {
    return { min: 0, max: 0, p5: 0, p95: 0, salaries: [], histogram: [] };
  }

  const min = salaries[0];
  const max = salaries[salaries.length - 1];

  // Calculate percentile indices
  const p5Index = Math.floor(salaries.length * (lowerPct / 100));
  const p95Index = Math.ceil(salaries.length * (upperPct / 100)) - 1;

  const p5 = salaries[Math.max(0, p5Index)];
  const p95 = salaries[Math.min(salaries.length - 1, p95Index)];

  // Build histogram data (20 buckets) from p5 to p95 range to exclude outliers
  const salariesInRange = salaries.filter((s) => s >= p5 && s <= p95);
  const histogram = buildSalaryHistogram(salariesInRange, 20, p5, p95);

  return { min, max, p5, p95, salaries, histogram };
};

/**
 * Builds histogram data for salary distribution
 * @param {number[]} salaries - Sorted array of salaries
 * @param {number} bucketCount - Number of histogram buckets
 * @param {number} rangeMin - Explicit minimum for bucket range (optional)
 * @param {number} rangeMax - Explicit maximum for bucket range (optional)
 * @returns {Array} Array of { min, max, count } objects
 */
export const buildSalaryHistogram = (
  salaries,
  bucketCount = 20,
  rangeMin = null,
  rangeMax = null
) => {
  if (salaries.length === 0) return [];

  const min = rangeMin ?? salaries[0];
  const max = rangeMax ?? salaries[salaries.length - 1];
  const bucketSize = (max - min) / bucketCount || 1;

  const histogram = [];
  for (let i = 0; i < bucketCount; i++) {
    const bucketMin = min + i * bucketSize;
    const bucketMax = min + (i + 1) * bucketSize;
    const count = salaries.filter(
      (s) =>
        s >= bucketMin &&
        (i === bucketCount - 1 ? s <= bucketMax : s < bucketMax)
    ).length;
    histogram.push({
      min: bucketMin,
      max: bucketMax,
      count,
    });
  }

  return histogram;
};
