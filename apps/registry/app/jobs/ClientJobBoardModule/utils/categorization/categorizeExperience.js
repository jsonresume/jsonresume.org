import { normalizeString } from './normalizeString';

/**
 * Categorize experience level
 * @param {string} exp - Experience string
 * @returns {string} Categorized experience level
 */
export const categorizeExperience = (exp) => {
  const normalized = normalizeString(exp);

  if (normalized.includes('entry') || normalized.includes('junior'))
    return 'Entry Level';
  if (normalized.includes('mid') || normalized.includes('intermediate'))
    return 'Mid Level';
  if (normalized.includes('senior') || normalized.includes('sr'))
    return 'Senior Level';
  if (normalized.includes('lead') || normalized.includes('principal'))
    return 'Lead';
  if (normalized.includes('manager') || normalized.includes('head'))
    return 'Manager';
  if (normalized.includes('exec') || normalized.includes('director'))
    return 'Executive';

  return 'Not Specified';
};
