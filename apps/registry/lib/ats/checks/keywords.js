/**
 * ATS Check: Keywords & Content
 */

import { extractAllText } from '../utils/helpers.js';

/**
 * Check keyword optimization
 * @param {Object} resume - JSON Resume object
 * @returns {Object} Check result with score and issues
 */
export function checkKeywords(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 15;

  // Check summary/about - 5 points
  const summary = resume.basics?.summary || '';
  if (summary.length >= 50) {
    score += 5;
  } else if (summary.length > 0) {
    score += 2;
    issues.push({
      severity: 'info',
      category: 'keywords',
      message: 'Summary is too short - aim for 50+ characters',
      fix: 'Expand basics.summary with relevant keywords and achievements',
    });
  } else {
    issues.push({
      severity: 'warning',
      category: 'keywords',
      message: 'Missing professional summary',
      fix: 'Add a summary to basics.summary with key skills and experience',
    });
  }

  // Check work highlights - 5 points
  const work = resume.work || [];
  const totalHighlights = work.reduce(
    (sum, job) => sum + (job.highlights || []).length,
    0
  );
  if (totalHighlights >= 5) {
    score += 5;
  } else if (totalHighlights > 0) {
    score += 2;
    issues.push({
      severity: 'info',
      category: 'keywords',
      message: 'Add more work highlights for better keyword matching',
      fix: 'Include at least 5 highlights across work experiences',
    });
  }

  // Check for keyword density - 5 points
  const allText = extractAllText(resume);
  const wordCount = allText.split(/\s+/).length;
  if (wordCount >= 200) {
    score += 5;
  } else {
    issues.push({
      severity: 'info',
      category: 'keywords',
      message: 'Resume content is light - aim for 200+ words',
      fix: 'Add more detail to work experience, skills, and summary',
    });
  }

  return {
    name: 'Keywords & Content',
    score,
    maxScore,
    issues,
    passed: score >= maxScore * 0.6,
  };
}
