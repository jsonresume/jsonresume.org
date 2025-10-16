/**
 * ATS Check: Contact Information
 */

import { isValidEmail } from '../utils/helpers.js';

/**
 * Check contact information completeness
 * @param {Object} resume - JSON Resume object
 * @returns {Object} Check result with score and issues
 */
export function checkContactInformation(resume) {
  const issues = [];
  let score = 0;
  const maxScore = 20;

  const basics = resume.basics || {};

  // Name (required) - 5 points
  if (basics.name && basics.name.trim().length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'critical',
      category: 'contact',
      message: 'Missing name - ATS requires full name',
      fix: 'Add your full name to basics.name',
    });
  }

  // Email (required) - 5 points
  if (basics.email && isValidEmail(basics.email)) {
    score += 5;
  } else {
    issues.push({
      severity: 'critical',
      category: 'contact',
      message: 'Missing or invalid email address',
      fix: 'Add a valid email to basics.email',
    });
  }

  // Phone (important) - 5 points
  if (basics.phone && basics.phone.trim().length > 0) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'contact',
      message: 'Missing phone number - recommended for ATS',
      fix: 'Add phone number to basics.phone',
    });
  }

  // Location (important) - 5 points
  if (
    basics.location &&
    (basics.location.city || basics.location.region || basics.location.country)
  ) {
    score += 5;
  } else {
    issues.push({
      severity: 'warning',
      category: 'contact',
      message: 'Missing location information',
      fix: 'Add city, region, or country to basics.location',
    });
  }

  return {
    name: 'Contact Information',
    score,
    maxScore,
    issues,
    passed: score === maxScore,
  };
}
