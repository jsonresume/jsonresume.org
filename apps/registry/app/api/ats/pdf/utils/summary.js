/**
 * PDF analysis summary generation utilities
 */

/**
 * Generate human-readable summary of PDF parseability
 * @param {number} score - Parseability score (0-100)
 * @param {Object} analysis - Field extraction analysis
 * @returns {string} Summary message
 */
export function generatePDFSummary(score, analysis) {
  const issues = [];

  // Contact info issues
  const contactMissing = Object.entries(analysis.contactInfo)
    .filter(([_, found]) => !found)
    .map(([field]) => field);

  if (contactMissing.length > 0) {
    issues.push(`Missing contact fields: ${contactMissing.join(', ')}`);
  }

  // Work experience issues
  if (
    analysis.sections.work.totalEntries > 0 &&
    analysis.sections.work.extracted < analysis.sections.work.totalEntries
  ) {
    const missing =
      analysis.sections.work.totalEntries - analysis.sections.work.extracted;
    issues.push(`${missing} work experience entries not extracted`);
  }

  // Skills issues
  if (
    analysis.sections.skills.totalSkills > 0 &&
    analysis.sections.skills.extracted < analysis.sections.skills.totalSkills
  ) {
    const missing =
      analysis.sections.skills.totalSkills - analysis.sections.skills.extracted;
    issues.push(`${missing} skills not found in PDF text`);
  }

  if (score >= 90) {
    return 'PDF is highly parseable by ATS systems! All major fields are extractable.';
  } else if (score >= 80) {
    return `PDF is parseable with minor issues: ${issues.join('; ')}`;
  } else if (score >= 70) {
    return `PDF has moderate parseability issues: ${issues.join('; ')}`;
  } else {
    return `PDF has significant parseability issues: ${issues.join('; ')}`;
  }
}
