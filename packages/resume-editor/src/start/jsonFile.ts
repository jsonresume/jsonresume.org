import { Predicate } from 'effect';
import type { Json } from '../values';

/** The top-level sections of a JSON Resume, to recognise one. */
const SECTIONS = [
  'basics',
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
  'meta',
];

const isJsonFile = (file: File) =>
  file.type === 'application/json' || /\.json$/i.test(file.name);

/** A file's text; FileReader, since some runtimes lack Blob.text(). */
const textOf = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      Predicate.isString(reader.result) ? resolve(reader.result) : reject();
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });

/**
 * A resume.json the visitor already has, read in the browser as it is:
 * nothing to guess, so no import call. Null when the file isn't JSON or
 * isn't a resume, for the import to read as text instead.
 */
export const readResumeJson = async (file: File): Promise<Json | null> => {
  if (!isJsonFile(file)) return null;
  try {
    const parsed: unknown = JSON.parse(await textOf(file));
    if (!Predicate.isObject(parsed) || Array.isArray(parsed)) return null;
    // A resume wrapped as { resume: {…} }, as some exports give it.
    const inner = parsed['resume'];
    const resume =
      Predicate.isObject(inner) && !Array.isArray(inner) ? inner : parsed;
    return SECTIONS.some((key) => key in resume) ? resume : null;
  } catch {
    return null;
  }
};
