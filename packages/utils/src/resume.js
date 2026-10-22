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

// Sections whose entries may carry a `location` (#323)
const LOCATED_SECTIONS = ['work', 'volunteer', 'education'];

/**
 * Return a copy of the resume with structured `location` objects on work,
 * volunteer and education entries formatted as display strings (via
 * formatLocation). Most themes were written when `work.location` was always
 * a string and would print an object as "[object Object]". String locations
 * and `basics.location` are left as they are. Never mutates the input.
 *
 * @param {Object} [resume] - JSON Resume object
 * @returns {Object} A resume safe for string-location themes
 *
 * @example
 * withStringLocations({ work: [{ location: { city: 'Oslo', countryCode: 'NO' } }] })
 *   .work[0].location // 'Oslo, NO'
 */
export function withStringLocations(resume) {
  if (!resume || typeof resume !== 'object') {
    return resume;
  }
  const out = { ...resume };
  for (const section of LOCATED_SECTIONS) {
    if (!Array.isArray(resume[section])) continue;
    out[section] = resume[section].map((entry) =>
      entry && typeof entry.location === 'object' && entry.location !== null
        ? { ...entry, location: formatLocation(entry.location) }
        : entry
    );
  }
  return out;
}

/**
 * Return a copy of the resume where every project has both `summary` and
 * `description` (#296). `summary` is the preferred field and wins when both
 * are set; `description` is its deprecated alias. Themes written for either
 * field then render the same text. Never mutates the input.
 *
 * @param {Object} [resume] - JSON Resume object
 * @returns {Object} A resume whose projects carry both fields when either is set
 */
export function withProjectSummaries(resume) {
  if (
    !resume ||
    typeof resume !== 'object' ||
    !Array.isArray(resume.projects)
  ) {
    return resume;
  }
  return {
    ...resume,
    projects: resume.projects.map((project) => {
      const text = project?.summary ?? project?.description;
      return text === undefined
        ? project
        : { ...project, summary: text, description: text };
    }),
  };
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
