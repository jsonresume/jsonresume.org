/**
 * @jsonresume/utils
 *
 * Framework-free pure utilities for JSON Resume. No React, no
 * styled-components — safe to use anywhere (server, CLI, browser, themes).
 *
 * Subpath exports: './dates', './metrics', './url'. The root barrel below
 * re-exports everything for convenience.
 *
 * @module @jsonresume/utils
 */

// Date utilities
export {
  formatDateRange,
  getRelativeTime,
  getDuration,
  normalizeDates,
} from './dates.js';

// Metrics / calculation helpers
export {
  calculateTotalExperience,
  calculateCurrentRoleExperience,
  countCareerPositions,
  getCareerProgressionRate,
  countTotalHighlights,
  countCompanies,
  countProjects,
  countPublications,
  countAwards,
  countTotalSkills,
  countSkillCategories,
  countLanguages,
  calculateEducationYears,
  getHighestDegree,
  calculateVolunteerYears,
  getUniqueIndustries,
  getCurrentEmployer,
  isCurrentlyEmployed,
  calculateKeyMetrics,
} from './metrics/index.js';

// URL / security utilities
export {
  safeUrl,
  getLinkRel,
  sanitizeHtml,
  isExternalUrl,
  formatUrlForDisplay,
} from './url.js';

// Resume-shape utilities
export { formatLocation, normalizeResume } from './resume.js';
