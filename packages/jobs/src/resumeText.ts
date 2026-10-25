import { Predicate } from 'effect';

const MAX_CHARS = 12_000;

const str = (v: unknown): string => (Predicate.isString(v) ? v.trim() : '');
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const words = (v: unknown) => list(v).map(str).filter(Boolean).join(', ');

/**
 * A resume as text to embed, shaped like a job's (see embeddingText): the
 * role, skills, then experience. Location and contact details are left out.
 */
export const resumeText = (resume: unknown): string => {
  const basics = at(resume, 'basics');
  const lines = [
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
        [str(at(w, 'position')), str(at(w, 'name'))]
          .filter(Boolean)
          .join(' at '),
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
      [str(at(e, 'studyType')), str(at(e, 'area')), str(at(e, 'institution'))]
        .filter(Boolean)
        .join(' ')
    ),
  ];
  return lines.filter(Boolean).join('\n').slice(0, MAX_CHARS);
};
