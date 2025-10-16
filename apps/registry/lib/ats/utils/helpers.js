/**
 * ATS Scoring Helper Utilities
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Extract all text from resume for analysis
 * @param {Object} resume - JSON Resume object
 * @returns {string} Combined text from all resume sections
 */
export function extractAllText(resume) {
  const texts = [];

  if (resume.basics?.summary) texts.push(resume.basics.summary);
  if (resume.basics?.label) texts.push(resume.basics.label);

  (resume.work || []).forEach((job) => {
    if (job.position) texts.push(job.position);
    if (job.summary) texts.push(job.summary);
    if (job.highlights) texts.push(...job.highlights);
  });

  (resume.education || []).forEach((edu) => {
    if (edu.studyType) texts.push(edu.studyType);
    if (edu.area) texts.push(edu.area);
  });

  (resume.skills || []).forEach((skill) => {
    if (skill.name) texts.push(skill.name);
    if (skill.keywords) texts.push(...skill.keywords);
  });

  return texts.join(' ');
}
