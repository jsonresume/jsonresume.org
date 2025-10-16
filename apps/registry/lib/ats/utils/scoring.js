/**
 * ATS Score Rating and Summary Utilities
 */

/**
 * Get rating based on score
 * @param {number} score - ATS score (0-100)
 * @returns {string} Rating label
 */
export function getScoreRating(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Needs Improvement';
}

/**
 * Generate summary text based on score and checks
 * @param {number} score - ATS score (0-100)
 * @param {Array} checks - Array of check results
 * @returns {string} Summary message
 */
export function generateSummary(score, checks) {
  const failedChecks = checks.filter((c) => !c.passed);

  if (score >= 90) {
    return 'Your resume is highly optimized for ATS! Great job!';
  }

  if (score >= 75) {
    return 'Your resume is well-optimized for ATS with minor improvements needed.';
  }

  if (score >= 60) {
    return `Your resume needs some improvements for better ATS compatibility. Focus on: ${failedChecks
      .map((c) => c.name)
      .join(', ')}`;
  }

  return `Your resume needs significant improvements for ATS compatibility. Priority areas: ${failedChecks
    .slice(0, 3)
    .map((c) => c.name)
    .join(', ')}`;
}
