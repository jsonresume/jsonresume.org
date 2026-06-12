/**
 * Resume Key Metrics Aggregation Helper
 *
 * Composes the focused calculation helpers into a dashboard-ready summary
 * of key metrics derived from a complete JSON Resume object.
 *
 * @module @resume/core/helpers/keyMetrics
 */

import { calculateTotalExperience } from './experience.js';
import {
  countCompanies,
  countProjects,
  countTotalSkills,
  countPublications,
  countAwards,
  countLanguages,
} from './counts.js';
import { getHighestDegree } from './education.js';

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
