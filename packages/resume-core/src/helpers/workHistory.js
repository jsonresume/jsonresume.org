/**
 * Resume Work History Insight Helpers
 *
 * Pure functions for deriving employment status, industries, and volunteer
 * tenure from JSON Resume data.
 *
 * @module @resume/core/helpers/workHistory
 */

/**
 * Calculate total volunteer hours (if duration data is available)
 * @param {Array} volunteer - Array of volunteer objects with startDate and endDate
 * @returns {number} Total volunteer years
 *
 * @example
 * const volunteerYears = calculateVolunteerYears(resume.volunteer);
 * // => 4
 */
export function calculateVolunteerYears(volunteer = []) {
  if (!Array.isArray(volunteer) || volunteer.length === 0) return 0;

  const totalYears = volunteer.reduce((acc, vol) => {
    if (!vol.startDate) return acc;

    const start = new Date(vol.startDate);
    const end = vol.endDate ? new Date(vol.endDate) : new Date();
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);

    return acc + years;
  }, 0);

  return Math.round(totalYears);
}

/**
 * Get all unique industries from work experience
 * @param {Array} work - Array of work experience objects with industry field
 * @returns {Array<string>} Array of unique industries
 *
 * @example
 * const industries = getUniqueIndustries(resume.work);
 * // => ["Technology", "Finance", "Healthcare"]
 */
export function getUniqueIndustries(work = []) {
  if (!Array.isArray(work) || work.length === 0) return [];

  const industries = new Set(work.map((job) => job.industry).filter(Boolean));

  return Array.from(industries);
}

/**
 * Get most recent/current employer
 * @param {Array} work - Array of work experience objects
 * @returns {Object|null} Most recent work object
 *
 * @example
 * const current = getCurrentEmployer(resume.work);
 * // => { name: "Google", position: "Senior Engineer", ... }
 */
export function getCurrentEmployer(work = []) {
  if (!Array.isArray(work) || work.length === 0) return null;

  // Find first job without endDate (current), or first in array
  return work.find((job) => !job.endDate) || work[0];
}

/**
 * Check if currently employed
 * @param {Array} work - Array of work experience objects
 * @returns {boolean} True if currently employed
 *
 * @example
 * const employed = isCurrentlyEmployed(resume.work);
 * // => true
 */
export function isCurrentlyEmployed(work = []) {
  if (!Array.isArray(work) || work.length === 0) return false;
  return work.some((job) => !job.endDate);
}
