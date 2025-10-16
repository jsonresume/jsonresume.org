/**
 * PDF parseability scoring utilities
 */

/**
 * Calculate PDF parseability score based on field extraction analysis
 * @param {Object} analysis - Field extraction analysis results
 * @returns {number} Score from 0-100
 */
export function calculatePDFScore(analysis) {
  let score = 0;

  // Contact Information (30 points)
  const contactFields = Object.values(analysis.contactInfo);
  const contactScore =
    (contactFields.filter((f) => f).length / contactFields.length) * 30;
  score += contactScore;

  // Work Experience (25 points)
  const workScore =
    analysis.sections.work.totalEntries > 0
      ? (analysis.sections.work.extracted /
          analysis.sections.work.totalEntries) *
        25
      : 25;
  score += workScore;

  // Education (20 points)
  const eduScore =
    analysis.sections.education.totalEntries > 0
      ? (analysis.sections.education.extracted /
          analysis.sections.education.totalEntries) *
        20
      : 20;
  score += eduScore;

  // Skills (25 points)
  const skillsScore =
    analysis.sections.skills.totalSkills > 0
      ? (analysis.sections.skills.extracted /
          analysis.sections.skills.totalSkills) *
        25
      : 25;
  score += skillsScore;

  return Math.round(Math.min(score, 100));
}

/**
 * Get rating label for a score
 * @param {number} score - Score from 0-100
 * @returns {string} Rating label
 */
export function getScoreRating(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  if (score >= 60) return 'Needs Improvement';
  return 'Poor';
}
