/**
 * ATS Check: Work Experience
 */

/**
 * Check work experience structure
 * @param {Object} resume - JSON Resume object
 * @returns {Object} Check result with score and issues
 */
export function checkWorkExperience(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 20;

  const work = resume.work || [];

  // Has work experience - 5 points
  if (work.length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'experience',
      message: 'No work experience listed',
      fix: 'Add work experience to the work array',
    });
  }

  // Check work entry quality
  work.forEach((job, index) => {
    const jobIssues = [];

    // Company name - 3 points
    if (job.name && job.name.trim().length > 0) {
      score += 3;
    } else {
      jobIssues.push('Missing company name');
    }

    // Position/title - 3 points
    if (job.position && job.position.trim().length > 0) {
      score += 3;
    } else {
      jobIssues.push('Missing job title');
    }

    // Start date - 3 points
    if (job.startDate) {
      score += 3;
    } else {
      jobIssues.push('Missing start date');
    }

    // Description or highlights - 3 points
    if (
      (job.summary && job.summary.trim().length > 0) ||
      (job.highlights && job.highlights.length > 0)
    ) {
      score += 3;
    } else {
      jobIssues.push('Missing job description or highlights');
    }

    if (jobIssues.length > 0) {
      issues.push({
        severity: 'warning',
        category: 'experience',
        message: `Work entry #${index + 1}: ${jobIssues.join(', ')}`,
        fix: `Complete all required fields for work entry #${index + 1}`,
      });
    }
  });

  // Cap score at maxScore
  score = Math.min(score, maxScore);

  return {
    name: 'Work Experience',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.8,
  };
}
