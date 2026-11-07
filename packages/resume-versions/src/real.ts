import completeResume from '@jsonresume/sample-data/complete-resume.json';
import resumeSample from '@jsonresume/sample-data/resume-sample.json';
import { SAMPLE_KEYS, templateKey } from '@repo/explore/listing';
import { Predicate } from 'effect';
import { sameJson } from './diff';

const SECTIONS = [
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
] as const;

const field = (value: unknown, key: string): unknown =>
  Predicate.isObject(value) && !Array.isArray(value) ? value[key] : undefined;

const filled = (value: unknown) =>
  Predicate.isString(value) && value.trim() !== '';

const entries = (resume: unknown, section: string): unknown[] => {
  const list = field(resume, section);
  return Array.isArray(list) ? list : [];
};

/**
 * Our example resume (the editor's "Start from an example"), as is or
 * still under its name and headline: Explore's sample key.
 */
export const isSampleResume = (resume: unknown): boolean => {
  if (sameJson(resume, completeResume) || sameJson(resume, resumeSample))
    return true;
  const basics = field(resume, 'basics');
  const name = field(basics, 'name');
  const label = field(basics, 'label');
  return (
    Predicate.isString(name) &&
    SAMPLE_KEYS.has(templateKey(name, Predicate.isString(label) ? label : ''))
  );
};

/**
 * Someone's own resume: not the sample, with at least one job and one
 * skill that say something.
 */
export const isRealResume = (resume: unknown): boolean =>
  !isSampleResume(resume) &&
  entries(resume, 'work').some(
    (w) => filled(field(w, 'name')) || filled(field(w, 'position'))
  ) &&
  entries(resume, 'skills').some((s) => filled(field(s, 'name')));

/** How many sections have something in them (basics counts with a name). */
export const sectionCount = (resume: unknown): number =>
  (filled(field(field(resume, 'basics'), 'name')) ? 1 : 0) +
  SECTIONS.filter((s) => entries(resume, s).length > 0).length;

/** Where a save came from, for the `resume_saved` event. */
export type SaveSource = 'editor' | 'api' | 'oauth_app' | 'mcp';

/** What a save did: the version it wrote (null when nothing changed). */
export interface SaveOutcome {
  version: number | null;
  /** The profile's first resume. */
  first: boolean;
  real: boolean;
  sections: number;
}

/** `resume_saved`'s properties: plain values, never resume text. */
export const savedProperties = (outcome: SaveOutcome, source: SaveSource) => ({
  source,
  real: outcome.real,
  first: outcome.first,
  sections: outcome.sections,
});
