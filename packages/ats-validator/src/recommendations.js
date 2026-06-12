/**
 * Get recommendations based on validation results
 */
export function getRecommendations(validationResult) {
  const recs = [];

  if (validationResult.score < 60) {
    recs.push(
      '⚠️ Critical: Your resume has significant ATS compatibility issues. Focus on the errors below.'
    );
  }

  validationResult.checks.forEach((check) => {
    if (!check.passed) {
      recs.push(
        `📋 ${check.name}: ${check.score}/${check.maxScore} - Review and fix issues in this category`
      );
    }
  });

  const errorCount = validationResult.issues.filter(
    (i) => i.severity === 'error'
  ).length;
  if (errorCount > 0) {
    recs.push(
      `🚨 ${errorCount} critical error(s) found - these will likely prevent ATS parsing`
    );
  }

  if (validationResult.score >= 80) {
    recs.push(
      '✅ Great! Your resume is highly ATS-compatible. Minor improvements possible.'
    );
  }

  return recs;
}
