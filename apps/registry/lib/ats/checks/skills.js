/**
 * ATS Check: Skills
 */

/**
 * Check skills section
 * @param {Object} resume - JSON Resume object
 * @returns {Object} Check result with score and issues
 */
export function checkSkills(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 15;

  const skills = resume.skills || [];

  // Has skills listed - 5 points
  if (skills.length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'skills',
      message: 'No skills listed - critical for ATS keyword matching',
      fix: 'Add relevant skills to the skills array',
    });
  }

  // Has multiple skill categories - 5 points
  if (skills.length >= 3) {
    score += 5;
  } else if (skills.length > 0) {
    issues.push({
      severity: 'info',
      category: 'skills',
      message: 'Consider adding more skill categories for better ATS matching',
      fix: 'Add at least 3 skill categories (e.g., Languages, Frameworks, Tools)',
    });
  }

  // Skills have keywords - 5 points
  const totalKeywords = skills.reduce(
    (sum, skill) => sum + (skill.keywords || []).length,
    0
  );
  if (totalKeywords >= 10) {
    score += 5;
  } else if (totalKeywords > 0) {
    score += 2;
    issues.push({
      severity: 'info',
      category: 'skills',
      message: 'Add more skill keywords for better ATS matching',
      fix: 'Include at least 10 specific skills across categories',
    });
  }

  return {
    name: 'Skills',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.7,
  };
}
