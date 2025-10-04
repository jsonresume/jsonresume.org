import { normalizeString } from './normalizeString';

/**
 * Categorize location type
 * @param {string} location - Location string
 * @returns {string} Categorized location
 */
export const categorizeLocation = (location) => {
  if (!location) return 'Not Specified';

  // If it's already in the City, Region, Country format, return as is
  if (location.includes(',')) return location;

  const normalized = normalizeString(location);

  if (normalized.includes('remote')) return 'Remote';
  if (normalized.includes('hybrid')) return 'Hybrid';
  if (normalized.includes('onsite') || normalized.includes('office'))
    return 'On-site';

  return location;
};
