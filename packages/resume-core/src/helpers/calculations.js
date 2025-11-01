/**
 * Resume Data Calculation Helpers
 *
 * Pure functions for computing metrics and insights from JSON Resume data.
 * Use these helpers in themes to display calculated metrics, statistics, and insights.
 *
 * @module @resume/core/helpers/calculations
 */

/**
 * Calculate total years of professional experience from work history
 * @param {Array} work - Array of work experience objects with startDate and endDate
 * @returns {number} Total years of experience (rounded to nearest year)
 *
 * @example
 * const years = calculateTotalExperience(resume.work);
 * // => 8 (years)
 */
export function calculateTotalExperience(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  const totalYears = work.reduce((acc, job) => {
    if (!job.startDate) return acc;

    const start = new Date(job.startDate);
    const end = job.endDate ? new Date(job.endDate) : new Date();
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25); // Use 365.25 for leap years

    return acc + years;
  }, 0);

  return Math.round(totalYears);
}

/**
 * Calculate years of experience for the current/most recent role
 * @param {Array} work - Array of work experience objects
 * @returns {number} Years in current role (rounded to 1 decimal)
 *
 * @example
 * const currentYears = calculateCurrentRoleExperience(resume.work);
 * // => 2.5 (years)
 */
export function calculateCurrentRoleExperience(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  // Assume first item is most recent (no endDate or latest endDate)
  const currentRole = work.find((job) => !job.endDate) || work[0];
  if (!currentRole || !currentRole.startDate) return 0;

  const start = new Date(currentRole.startDate);
  const end = currentRole.endDate ? new Date(currentRole.endDate) : new Date();
  const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);

  return Math.round(years * 10) / 10; // Round to 1 decimal
}

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

/**
 * Calculate total volunteer hours (if duration data is available)
 * @param {Array} volunteer - Array of volunteer objects with startDate and endDate
 * @returns {number} Total volunteer years
 *
 * @example
 * const volunteerYears = calculateVolunteerYears(resume.volunteer);
 * // => 4
 */
export function calculateVolunteerYears(volunteer = []) {
  if (!Array.isArray(volunteer) || volunteer.length === 0) return 0;

  const totalYears = volunteer.reduce((acc, vol) => {
    if (!vol.startDate) return acc;

    const start = new Date(vol.startDate);
    const end = vol.endDate ? new Date(vol.endDate) : new Date();
    const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);

    return acc + years;
  }, 0);

  return Math.round(totalYears);
}

/**
 * Calculate total education years
 * @param {Array} education - Array of education objects with startDate and endDate
 * @returns {number} Total years of education
 *
 * @example
 * const eduYears = calculateEducationYears(resume.education);
 * // => 6
 */
export function calculateEducationYears(education = []) {
  if (!Array.isArray(education) || education.length === 0) return 0;

  const totalYears = education.reduce((acc, edu) => {
    if (!edu.startDate) return acc;

    const start = new Date(edu.startDate);
    const end = edu.endDate ? new Date(edu.endDate) : new Date();
    const years = (end - start) / ((1000 * 60 * 60 * 24) / 365.25);

    return acc + years;
  }, 0);

  return Math.round(totalYears);
}

/**
 * Get highest education level
 * @param {Array} education - Array of education objects with studyType
 * @returns {string} Highest degree (PhD, Master's, Bachelor's, etc.)
 *
 * @example
 * const degree = getHighestDegree(resume.education);
 * // => "PhD"
 */
export function getHighestDegree(education = []) {
  if (!Array.isArray(education) || education.length === 0) return '';

  const degreeRanking = {
    phd: 5,
    doctorate: 5,
    doctoral: 5,
    master: 4,
    mba: 4,
    bachelor: 3,
    associate: 2,
    diploma: 1,
    certificate: 1,
  };

  let highest = { level: 0, studyType: '' };

  education.forEach((edu) => {
    if (!edu.studyType) return;

    const studyTypeLower = edu.studyType.toLowerCase();
    for (const [key, level] of Object.entries(degreeRanking)) {
      if (studyTypeLower.includes(key) && level > highest.level) {
        highest = { level, studyType: edu.studyType };
      }
    }
  });

  return highest.studyType;
}

/**
 * Calculate career trajectory (promotions/role changes)
 * @param {Array} work - Array of work experience objects with position
 * @returns {number} Number of distinct positions held
 *
 * @example
 * const positions = countCareerPositions(resume.work);
 * // => 7
 */
export function countCareerPositions(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  const uniquePositions = new Set(
    work.map((job) => job.position).filter(Boolean)
  );

  return uniquePositions.size;
}

/**
 * Get career progression rate (positions per year)
 * @param {Array} work - Array of work experience objects
 * @returns {number} Average years per position
 *
 * @example
 * const rate = getCareerProgressionRate(resume.work);
 * // => 2.3 (years per position)
 */
export function getCareerProgressionRate(work = []) {
  const totalYears = calculateTotalExperience(work);
  const positions = countCareerPositions(work);

  if (totalYears === 0 || positions === 0) return 0;

  return Math.round((totalYears / positions) * 10) / 10;
}

/**
 * Calculate total highlights/achievements across work experience
 * @param {Array} work - Array of work experience objects with highlights
 * @returns {number} Total number of highlights
 *
 * @example
 * const achievements = countTotalHighlights(resume.work);
 * // => 28
 */
export function countTotalHighlights(work = []) {
  if (!Array.isArray(work) || work.length === 0) return 0;

  return work.reduce((total, job) => {
    const highlights = job.highlights || [];
    return total + highlights.length;
  }, 0);
}

/**
 * Get all unique industries from work experience
 * @param {Array} work - Array of work experience objects with industry field
 * @returns {Array<string>} Array of unique industries
 *
 * @example
 * const industries = getUniqueIndustries(resume.work);
 * // => ["Technology", "Finance", "Healthcare"]
 */
export function getUniqueIndustries(work = []) {
  if (!Array.isArray(work) || work.length === 0) return [];

  const industries = new Set(work.map((job) => job.industry).filter(Boolean));

  return Array.from(industries);
}

/**
 * Get most recent/current employer
 * @param {Array} work - Array of work experience objects
 * @returns {Object|null} Most recent work object
 *
 * @example
 * const current = getCurrentEmployer(resume.work);
 * // => { name: "Google", position: "Senior Engineer", ... }
 */
export function getCurrentEmployer(work = []) {
  if (!Array.isArray(work) || work.length === 0) return null;

  // Find first job without endDate (current), or first in array
  return work.find((job) => !job.endDate) || work[0];
}

/**
 * Check if currently employed
 * @param {Array} work - Array of work experience objects
 * @returns {boolean} True if currently employed
 *
 * @example
 * const employed = isCurrentlyEmployed(resume.work);
 * // => true
 */
export function isCurrentlyEmployed(work = []) {
  if (!Array.isArray(work) || work.length === 0) return false;
  return work.some((job) => !job.endDate);
}

/**
 * Calculate comprehensive Key Metrics object for dashboard displays
 * @param {Object} resume - Complete JSON Resume object
 * @returns {Array<Object>} Array of metric objects with label and value
 *
 * @example
 * const metrics = calculateKeyMetrics(resume);
 * // => [
 * //   { label: 'Years Experience', value: 8 },
 * //   { label: 'Companies', value: 5 },
 * //   { label: 'Projects', value: 12 },
 * //   { label: 'Core Skills', value: 42 }
 * // ]
 */
export function calculateKeyMetrics(resume) {
  const metrics = [];

  const {
    work = [],
    projects = [],
    skills = [],
    publications = [],
    awards = [],
    education = [],
    volunteer = [],
    languages = [],
  } = resume;

  // Experience
  const experience = calculateTotalExperience(work);
  if (experience > 0) {
    metrics.push({ label: 'Years Experience', value: experience });
  }

  // Companies
  const companies = countCompanies(work);
  if (companies > 0) {
    metrics.push({ label: 'Companies', value: companies });
  }

  // Projects
  const projectCount = countProjects(projects);
  if (projectCount > 0) {
    metrics.push({ label: 'Projects', value: projectCount });
  }

  // Skills
  const skillCount = countTotalSkills(skills);
  if (skillCount > 0) {
    metrics.push({ label: 'Core Skills', value: skillCount });
  }

  // Publications
  const pubCount = countPublications(publications);
  if (pubCount > 0) {
    metrics.push({ label: 'Publications', value: pubCount });
  }

  // Awards
  const awardCount = countAwards(awards);
  if (awardCount > 0) {
    metrics.push({ label: 'Awards', value: awardCount });
  }

  // Education
  const degree = getHighestDegree(education);
  if (degree) {
    metrics.push({ label: 'Education', value: degree });
  }

  // Languages
  const langCount = countLanguages(languages);
  if (langCount > 1) {
    // Only show if multilingual
    metrics.push({ label: 'Languages', value: langCount });
  }

  return metrics;
}
