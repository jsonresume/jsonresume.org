/**
 * ATS Check: Education
 */

/**
 * Check education structure
 * @param {Object} resume - JSON Resume object
 * @returns {Object} Check result with score and issues
 */
export function checkEducation(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 15;

  const education = resume.education || [];

  // Has education - 5 points
  if (education.length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'info',
      category: 'education',
      message: 'No education listed',
      fix: 'Add education history to the education array',
    });
  }

  // Check education entry quality
  education.forEach((edu, index) => {
    // Institution name - 5 points
    if (edu.institution && edu.institution.trim().length > 0) {
      score += 5;
    }

    // Degree or study area - 5 points
    if (
      (edu.studyType && edu.studyType.trim().length > 0) ||
      (edu.area && edu.area.trim().length > 0)
    ) {
      score += 5;
    }
  });

  // Cap score at maxScore
  score = Math.min(score, maxScore);

  return {
    name: 'Education',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.6,
  };
}
