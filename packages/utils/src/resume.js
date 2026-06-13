/**
 * Pure resume-shape utilities for JSON Resume.
 *
 * Framework-free helpers for formatting and normalizing resume data.
 *
 * @module @jsonresume/utils/resume
 */

/**
 * The eleven standard array sections of a JSON Resume. Together with `basics`
 * these make up the twelve standard sections normalizeResume guarantees.
 * @type {ReadonlyArray<string>}
 */
const STANDARD_ARRAY_SECTIONS = [
  'work',
  'volunteer',
  'education',
  'awards',
  'certificates',
  'publications',
  'skills',
  'languages',
  'interests',
  'references',
  'projects',
];

/**
 * Format a JSON Resume location into a single display line.
 * Drops empty parts and joins the rest with ', '.
 *
 * @param {Object} [location] - JSON Resume location object
 * @returns {string} e.g. 'City, Region, CC' (empty string when nothing is set)
 *
 * @example
 * formatLocation({ city: 'Berlin', region: 'BE', countryCode: 'DE' })
 * // 'Berlin, BE, DE'
 */
export function formatLocation(location) {
  if (!location || typeof location !== 'object') {
    return '';
  }

  return [location.city, location.region, location.countryCode]
    .filter(Boolean)
    .join(', ');
}

/**
 * Normalize a resume into an object with all twelve standard array sections
 * defaulted to [] and `basics` defaulted to an object. Never mutates the input.
 * Unknown extra fields are preserved (JSON Resume allows additional properties).
 *
 * @param {Object} [resume] - JSON Resume object (possibly partial)
 * @returns {Object} A new object with standard sections guaranteed present
 *
 * @example
 * normalizeResume({ basics: { name: 'A' } }).work // []
 */
export function normalizeResume(resume) {
  const source = resume && typeof resume === 'object' ? resume : {};

  const normalized = { ...source };
  normalized.basics =
    source.basics && typeof source.basics === 'object' ? source.basics : {};

  for (const section of STANDARD_ARRAY_SECTIONS) {
    normalized[section] = Array.isArray(source[section]) ? source[section] : [];
  }

  return normalized;
}
