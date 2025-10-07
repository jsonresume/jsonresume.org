import { normalizeString } from './normalizeString';

/**
 * Categorize job type
 * @param {string} type - Job type string
 * @returns {string} Categorized job type
 */
export const categorizeJobType = (type) => {
  const normalized = normalizeString(type);

  if (normalized.includes('contract')) return 'Contract';
  if (normalized.includes('fulltime') || normalized.includes('full'))
    return 'Full-time';
  if (normalized.includes('parttime') || normalized.includes('part'))
    return 'Part-time';
  if (normalized.includes('intern')) return 'Internship';
  if (normalized.includes('temp')) return 'Temporary';
  if (normalized.includes('hybrid')) return 'Hybrid';
  if (normalized.includes('remote')) return 'Remote';

  return 'Other';
};
