/**
 * @jsonresume/sample-data
 *
 * Sample JSON Resume fixtures for tests, demos, and theme development.
 *
 * - completeResume: an every-section resume (basics + all 12 sections),
 *   the canonical fixture used by the registry theme-render QA gate.
 * - minimalResume: a small basics + work + education + skills subset,
 *   derived from completeResume.
 *
 * The JSON is loaded via createRequire so the module works as plain ESM in
 * Node without JSON import-assertion syntax.
 *
 * @module @jsonresume/sample-data
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** Every-section JSON Resume fixture. */
export const completeResume = require('./complete-resume.json');

/** A second, fuller sample resume kept alongside the complete fixture. */
export const resumeSample = require('./resume-sample.json');

/**
 * Minimal JSON Resume subset (basics + first work / education / skill),
 * derived from completeResume so it never drifts from the canonical shape.
 */
export const minimalResume = {
  basics: completeResume.basics,
  work: completeResume.work?.slice(0, 1) ?? [],
  education: completeResume.education?.slice(0, 1) ?? [],
  skills: completeResume.skills?.slice(0, 1) ?? [],
};

export default { completeResume, resumeSample, minimalResume };
