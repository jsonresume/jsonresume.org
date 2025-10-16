/**
 * ATS Check: Date Formatting
 */

/**
 * Check date formatting consistency
 * @param {Object} resume - JSON Resume object
 * @returns {Object} Check result with score and issues
 */
export function checkDates(resume) {
  const issues = [];
  let score = 10; // Start with perfect score
  const maxScore = 10;

  const work = resume.work || [];
  const education = resume.education || [];

  // Check for missing dates
  work.forEach((job, index) => {
    if (!job.startDate) {
      score -= 2;
      issues.push({
        severity: 'warning',
        category: 'dates',
        message: `Work entry #${index + 1} missing start date`,
        fix: 'Add startDate in YYYY-MM-DD format',
      });
    }
  });

  education.forEach((edu, index) => {
    if (!edu.startDate && !edu.endDate) {
      score -= 1;
      issues.push({
        severity: 'info',
        category: 'dates',
        message: `Education entry #${index + 1} missing dates`,
        fix: 'Add dates to improve ATS parsing',
      });
    }
  });

  score = Math.max(0, score); // Don't go below 0

  return {
    name: 'Date Formatting',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.8,
  };
}
