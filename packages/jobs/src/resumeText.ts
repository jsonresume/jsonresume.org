import { Predicate } from 'effect';

const MAX_CHARS = 12_000;

const str = (v: unknown): string => (Predicate.isString(v) ? v.trim() : '');
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const words = (v: unknown) => list(v).map(str).filter(Boolean).join(', ');

/**
 * A resume as lines of text: the role, skills, then experience, projects
 * and education. Location and contact details are left out; employers and
 * schools too with `employers: false`.
 */
export const resumeLines = (
  resume: unknown,
  { employers = true }: { employers?: boolean } = {}
): string[] => {
  const basics = at(resume, 'basics');
  const named = (o: unknown, key: string) => (employers ? str(at(o, key)) : '');
  return [
    str(at(basics, 'label')),
    str(at(basics, 'summary')),
    list(at(resume, 'skills'))
      .map((s) => {
        const name = str(at(s, 'name'));
        const keywords = words(at(s, 'keywords'));
        return name && keywords ? `${name}: ${keywords}` : name || keywords;
      })
      .filter(Boolean)
      .join('\n'),
    ...list(at(resume, 'work')).map((w) =>
      [
        [str(at(w, 'position')), named(w, 'name')].filter(Boolean).join(' at '),
        str(at(w, 'summary')),
        list(at(w, 'highlights')).map(str).filter(Boolean).join('\n'),
      ]
        .filter(Boolean)
        .join('\n')
    ),
    ...list(at(resume, 'projects')).map((p) =>
      [str(at(p, 'name')), str(at(p, 'description')), words(at(p, 'keywords'))]
        .filter(Boolean)
        .join(': ')
    ),
    ...list(at(resume, 'education')).map((e) =>
      [str(at(e, 'studyType')), str(at(e, 'area')), named(e, 'institution')]
        .filter(Boolean)
        .join(' ')
    ),
  ].filter(Boolean);
};

/** A resume as text to embed, shaped like a job's (see embeddingText). */
export const resumeText = (resume: unknown): string =>
  resumeLines(resume).join('\n').slice(0, MAX_CHARS);
