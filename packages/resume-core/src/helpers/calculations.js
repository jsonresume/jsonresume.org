/**
 * Resume Data Calculation Helpers
 *
 * Pure functions for computing metrics and insights from JSON Resume data.
 * Use these helpers in themes to display calculated metrics, statistics, and insights.
 *
 * This module is a thin re-export barrel. The implementations live in focused
 * sibling modules grouped by concern:
 *   - ./experience.js   work tenure & career progression
 *   - ./counts.js       simple section tallies
 *   - ./education.js    education years & highest degree
 *   - ./workHistory.js  employment status, industries, volunteer tenure
 *   - ./keyMetrics.js   dashboard metrics aggregation
 *
 * @module @resume/core/helpers/calculations
 */

export {
  calculateTotalExperience,
  calculateCurrentRoleExperience,
  countCareerPositions,
  getCareerProgressionRate,
  countTotalHighlights,
} from './experience.js';

export {
  countCompanies,
  countProjects,
  countPublications,
  countAwards,
  countTotalSkills,
  countSkillCategories,
  countLanguages,
} from './counts.js';

export { calculateEducationYears, getHighestDegree } from './education.js';

export {
  calculateVolunteerYears,
  getUniqueIndustries,
  getCurrentEmployer,
  isCurrentlyEmployed,
} from './workHistory.js';

export { calculateKeyMetrics } from './keyMetrics.js';
