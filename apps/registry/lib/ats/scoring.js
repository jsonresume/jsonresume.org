/**
 * ATS (Applicant Tracking System) Scoring Utilities
 *
 * Analyzes resume data and rendering for ATS compatibility
 * Returns a score (0-100) and specific recommendations
 */

import { checkContactInformation } from './checks/contactInfo.js';
import { checkWorkExperience } from './checks/workExperience.js';
import { checkEducation } from './checks/education.js';
import { checkSkills } from './checks/skills.js';
import { checkKeywords } from './checks/keywords.js';
import { checkDates } from './checks/dates.js';
import { checkThemeCompatibility } from './checks/theme.js';
import { getScoreRating, generateSummary } from './utils/scoring.js';

/**
 * Calculate ATS compatibility score for resume data
 *
 * @param {Object} resume - JSON Resume object
 * @param {Object} options - Analysis options
 * @param {string} options.theme - Theme name being used
 * @param {string} options.html - Rendered HTML (optional)
 * @returns {Object} Score and recommendations
 */
export function calculateATSScore(resume, options = {}) {
  const checks = [];
  let totalScore = 0;
  let maxScore = 0;

  // 1. Contact Information (20 points)
  const contactScore = checkContactInformation(resume);
  checks.push(contactScore);
  totalScore += contactScore.score;
  maxScore += contactScore.maxScore;

  // 2. Work Experience Structure (20 points)
  const workScore = checkWorkExperience(resume);
  checks.push(workScore);
  totalScore += workScore.score;
  maxScore += workScore.maxScore;

  // 3. Education Structure (15 points)
  const educationScore = checkEducation(resume);
  checks.push(educationScore);
  totalScore += educationScore.score;
  maxScore += educationScore.maxScore;

  // 4. Skills Section (15 points)
  const skillsScore = checkSkills(resume);
  checks.push(skillsScore);
  totalScore += skillsScore.score;
  maxScore += skillsScore.maxScore;

  // 5. Keywords and Content (15 points)
  const keywordScore = checkKeywords(resume);
  checks.push(keywordScore);
  totalScore += keywordScore.score;
  maxScore += keywordScore.maxScore;

  // 6. Date Formatting (10 points)
  const dateScore = checkDates(resume);
  checks.push(dateScore);
  totalScore += dateScore.score;
  maxScore += dateScore.maxScore;

  // 7. Theme ATS Compatibility (5 points)
  const themeScore = checkThemeCompatibility(options.theme);
  checks.push(themeScore);
  totalScore += themeScore.score;
  maxScore += themeScore.maxScore;

  // Calculate final score (0-100)
  const finalScore = Math.round((totalScore / maxScore) * 100);

  // Determine overall rating
  const rating = getScoreRating(finalScore);

  // Generate recommendations
  const recommendations = checks
    .filter((check) => check.issues.length > 0)
    .flatMap((check) => check.issues);

  return {
    score: finalScore,
    rating,
    checks,
    recommendations,
    summary: generateSummary(finalScore, checks),
  };
}
