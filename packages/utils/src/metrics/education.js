/**
 * Resume Education Calculation Helpers
 *
 * Pure functions for computing education metrics from JSON Resume data.
 *
 * @module @jsonresume/utils/metrics/education
 */

/**
 * Calculate total education years
 * @param {Array} education - Array of education objects with startDate and endDate
 * @returns {number} Total years of education
 *
 * @example
 * const eduYears = calculateEducationYears(resume.education);
 * // => 6
 */
export function calculateEducationYears(education = []) {
  if (!Array.isArray(education) || education.length === 0) return 0;

  const totalYears = education.reduce((acc, edu) => {
    if (!edu.startDate) return acc;

    const start = new Date(edu.startDate);
    const end = edu.endDate ? new Date(edu.endDate) : new Date();
    // Use 365.25 for leap years (matches calculateTotalExperience). Previously
    // this divided by (ms-per-day / 365.25), inflating the result ~133M-fold.
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);

    return acc + years;
  }, 0);

  return Math.round(totalYears);
}

/**
 * Get highest education level
 * @param {Array} education - Array of education objects with studyType
 * @returns {string} Highest degree (PhD, Master's, Bachelor's, etc.)
 *
 * @example
 * const degree = getHighestDegree(resume.education);
 * // => "PhD"
 */
export function getHighestDegree(education = []) {
  if (!Array.isArray(education) || education.length === 0) return '';

  const degreeRanking = {
    phd: 5,
    doctorate: 5,
    doctoral: 5,
    master: 4,
    mba: 4,
    bachelor: 3,
    associate: 2,
    diploma: 1,
    certificate: 1,
  };

  let highest = { level: 0, studyType: '' };

  education.forEach((edu) => {
    if (!edu.studyType) return;

    const studyTypeLower = edu.studyType.toLowerCase();
    for (const [key, level] of Object.entries(degreeRanking)) {
      if (studyTypeLower.includes(key) && level > highest.level) {
        highest = { level, studyType: edu.studyType };
      }
    }
  });

  return highest.studyType;
}
