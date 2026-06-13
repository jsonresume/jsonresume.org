/**
 * @jsonresume/ats-validator
 * Machine-readable validation rules for ATS-friendly resume HTML
 *
 * Based on research:
 * - 68% of hiring managers prefer sans-serif fonts (Adobe 2025)
 * - Single-column layouts parse 3x better than multi-column
 * - Tables and complex layouts confuse 90% of ATS systems
 * - Standard fonts (Helvetica, Arial, Calibri) have 99% compatibility
 */

import * as cheerio from 'cheerio';

import { checkSemanticHTML } from './checks/semantic-html.js';
import { checkFonts } from './checks/fonts.js';
import { checkTables } from './checks/tables.js';
import { checkLayout } from './checks/layout.js';
import { checkHeadings } from './checks/headings.js';
import { checkImages } from './checks/images.js';
import { checkFontSizes } from './checks/font-sizes.js';
import { checkAccessibility } from './checks/accessibility.js';
import { getGrade } from './grade.js';
import { getRecommendations } from './recommendations.js';

/**
 * Validate HTML against ATS best practices
 * @param {string} html - HTML string to validate
 * @returns {Object} Validation results with score and issues
 */
export function validateATS(html) {
  const $ = cheerio.load(html);

  const checks = [
    checkSemanticHTML($),
    checkFonts($),
    checkTables($),
    checkLayout($),
    checkHeadings($),
    checkImages($),
    checkFontSizes($),
    checkAccessibility($),
  ];

  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
  const maxScore = checks.reduce((sum, check) => sum + check.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const issues = checks.flatMap((check) => check.issues);
  const passed = checks.filter((check) => check.passed).length;
  const failed = checks.length - passed;

  return {
    score: percentage,
    grade: getGrade(percentage),
    totalScore,
    maxScore,
    passed,
    failed,
    checks,
    issues,
    atsCompatibility:
      percentage >= 80
        ? 'excellent'
        : percentage >= 60
        ? 'good'
        : percentage >= 40
        ? 'fair'
        : 'poor',
  };
}

export { getRecommendations };

export default { validateATS, getRecommendations };
