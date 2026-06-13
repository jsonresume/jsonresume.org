/**
 * Resume Count Calculation Helpers
 *
 * Pure functions for tallying simple counts across JSON Resume sections.
 *
 * @module @jsonresume/utils/metrics/counts
 */

/**
 * Count total number of companies worked at
 * @param {Array} work - Array of work experience objects
 * @returns {number} Number of unique companies
 *
 * @example
 * const companies = countCompanies(resume.work);
 * // => 5
 */
export function countCompanies(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  const uniqueCompanies = new Set(work.map((job) => job.name).filter(Boolean));

  return uniqueCompanies.size;
}

/**
 * Count total number of projects
 * @param {Array} projects - Array of project objects
 * @returns {number} Number of projects
 *
 * @example
 * const projectCount = countProjects(resume.projects);
 * // => 12
 */
export function countProjects(projects = []) {
  return Array.isArray(projects) ? projects.length : 0;
}

/**
 * Count total number of publications
 * @param {Array} publications - Array of publication objects
 * @returns {number} Number of publications
 *
 * @example
 * const pubCount = countPublications(resume.publications);
 * // => 8
 */
export function countPublications(publications = []) {
  return Array.isArray(publications) ? publications.length : 0;
}

/**
 * Count total number of awards received
 * @param {Array} awards - Array of award objects
 * @returns {number} Number of awards
 *
 * @example
 * const awardCount = countAwards(resume.awards);
 * // => 3
 */
export function countAwards(awards = []) {
  return Array.isArray(awards) ? awards.length : 0;
}

/**
 * Count total skills across all skill categories
 * @param {Array} skills - Array of skill objects with keywords
 * @returns {number} Total number of skill keywords
 *
 * @example
 * const skillCount = countTotalSkills(resume.skills);
 * // => 42
 */
export function countTotalSkills(skills = []) {
  if (!Array.isArray(skills) || skills.length === 0) return 0;

  return skills.reduce((total, skill) => {
    const keywords = skill.keywords || [];
    return total + keywords.length;
  }, 0);
}

/**
 * Count skill categories
 * @param {Array} skills - Array of skill objects
 * @returns {number} Number of skill categories
 *
 * @example
 * const categories = countSkillCategories(resume.skills);
 * // => 6
 */
export function countSkillCategories(skills = []) {
  return Array.isArray(skills) ? skills.length : 0;
}

/**
 * Count languages spoken
 * @param {Array} languages - Array of language objects
 * @returns {number} Number of languages
 *
 * @example
 * const langCount = countLanguages(resume.languages);
 * // => 3
 */
export function countLanguages(languages = []) {
  return Array.isArray(languages) ? languages.length : 0;
}
