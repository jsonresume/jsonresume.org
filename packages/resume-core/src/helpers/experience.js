/**
 * Resume Experience Calculation Helpers
 *
 * Pure functions for computing work tenure and career progression metrics
 * from JSON Resume work history.
 *
 * @module @resume/core/helpers/experience
 */

/**
 * Calculate total years of professional experience from work history
 * @param {Array} work - Array of work experience objects with startDate and endDate
 * @returns {number} Total years of experience (rounded to nearest year)
 *
 * @example
 * const years = calculateTotalExperience(resume.work);
 * // => 8 (years)
 */
export function calculateTotalExperience(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  const totalYears = work.reduce((acc, job) => {
    if (!job.startDate) return acc;

    const start = new Date(job.startDate);
    const end = job.endDate ? new Date(job.endDate) : new Date();
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25); // Use 365.25 for leap years

    return acc + years;
  }, 0);

  return Math.round(totalYears);
}

/**
 * Calculate years of experience for the current/most recent role
 * @param {Array} work - Array of work experience objects
 * @returns {number} Years in current role (rounded to 1 decimal)
 *
 * @example
 * const currentYears = calculateCurrentRoleExperience(resume.work);
 * // => 2.5 (years)
 */
export function calculateCurrentRoleExperience(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  // Assume first item is most recent (no endDate or latest endDate)
  const currentRole = work.find((job) => !job.endDate) || work[0];
  if (!currentRole || !currentRole.startDate) return 0;

  const start = new Date(currentRole.startDate);
  const end = currentRole.endDate ? new Date(currentRole.endDate) : new Date();
  const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);

  return Math.round(years * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate career trajectory (promotions/role changes)
 * @param {Array} work - Array of work experience objects with position
 * @returns {number} Number of distinct positions held
 *
 * @example
 * const positions = countCareerPositions(resume.work);
 * // => 7
 */
export function countCareerPositions(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  const uniquePositions = new Set(
    work.map((job) => job.position).filter(Boolean)
  );

  return uniquePositions.size;
}

/**
 * Get career progression rate (positions per year)
 * @param {Array} work - Array of work experience objects
 * @returns {number} Average years per position
 *
 * @example
 * const rate = getCareerProgressionRate(resume.work);
 * // => 2.3 (years per position)
 */
export function getCareerProgressionRate(work = []) {
  const totalYears = calculateTotalExperience(work);
  const positions = countCareerPositions(work);

  if (totalYears === 0 || positions === 0) return 0;

  return Math.round((totalYears / positions) * 10) / 10;
}

/**
 * Calculate total highlights/achievements across work experience
 * @param {Array} work - Array of work experience objects with highlights
 * @returns {number} Total number of highlights
 *
 * @example
 * const achievements = countTotalHighlights(resume.work);
 * // => 28
 */
export function countTotalHighlights(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  return work.reduce((total, job) => {
    const highlights = job.highlights || [];
    return total + highlights.length;
  }, 0);
}
