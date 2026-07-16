/**
 * Pure helpers for reading and enriching a job's `gpt_content` JSON blob.
 * Shared by the /api/v1/jobs/[id] handlers (GET/PUT/PATCH).
 */

/**
 * Safely parse a job's gpt_content JSON. Returns {} on any parse failure so
 * callers can spread it without guarding.
 * @param {string} gptContent - Raw gpt_content string
 * @returns {Object} Parsed object (or {} on failure)
 */
export const parseGptContent = (gptContent) => {
  try {
    return JSON.parse(gptContent);
  } catch {
    return {};
  }
};

/** Field values treated as "empty" and therefore safe to fill from enrichment. */
const EMPTY_VALUES = new Set([
  null,
  undefined,
  '',
  'Not listed',
  'Not specified',
]);

/** Fields the dossier enrichment is allowed to fill in. */
export const ENRICHABLE_FIELDS = [
  'salary',
  'remote',
  'location',
  'experience',
  'type',
  'description',
  'skills',
  'qualifications',
  'responsibilities',
];

/**
 * Fill missing/empty fields on a parsed job from an enrichment object.
 * Never overwrites existing data. Returns a new object plus whether anything
 * changed.
 * @param {Object} parsed - Existing parsed gpt_content
 * @param {Object} enriched - Enrichment values keyed by field
 * @returns {{ merged: Object, updated: boolean }}
 */
export const mergeEnrichedFields = (parsed, enriched) => {
  const merged = { ...parsed };
  let updated = false;

  for (const field of ENRICHABLE_FIELDS) {
    if (enriched[field] === undefined || enriched[field] === null) continue;
    if (EMPTY_VALUES.has(merged[field])) {
      merged[field] = enriched[field];
      updated = true;
    }
  }

  return { merged, updated };
};
