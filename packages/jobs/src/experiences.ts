import { Predicate } from 'effect';

const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const str = (v: unknown) => (Predicate.isString(v) ? v.trim() : '');

/** Work, projects and volunteering, each as a name, a line and its text. */
export const experiences = (resume: unknown) =>
  (
    [
      ['work', 'name', 'position'],
      ['projects', 'name', 'description'],
      ['volunteer', 'organization', 'position'],
    ] as const
  ).flatMap(([section, name, detail]) =>
    list(at(resume, section)).map((e) => ({
      label: str(at(e, name)) || str(at(e, 'name')),
      detail: str(at(e, detail)).slice(0, 90) || null,
      text: [
        str(at(e, 'position')),
        str(at(e, 'summary')),
        str(at(e, 'description')),
        ...list(at(e, 'highlights')).map(str),
        ...list(at(e, 'keywords')).map(str),
      ].join('\n'),
    }))
  );
