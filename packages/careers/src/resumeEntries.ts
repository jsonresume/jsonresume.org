import { Predicate } from 'effect';
import { createHash } from 'node:crypto';
import type { Foundation, ResumeEntry } from './services';

/** Bump when what is read from a resume changes: cached insights are keyed by it. */
export const INSIGHT_VERSION = 'insight-1';

type Section = ResumeEntry['section'];

const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const str = (v: unknown) => (Predicate.isString(v) ? v.trim() : '');
const year = (v: unknown) => {
  const m = /^(\d{4})/.exec(str(v));
  return m ? Number(m[1]) : null;
};
const words = (...parts: string[]) => parts.filter(Boolean).join(' ') || null;

/** Each section's name field and its second line, as the resume writes them. */
const SECTIONS: ReadonlyArray<
  [section: Section, label: string, detail: (e: unknown) => string | null]
> = [
  ['work', 'name', (e) => words(str(at(e, 'position')))],
  [
    'projects',
    'name',
    (e) =>
      words((str(at(e, 'description')) || str(at(e, 'summary'))).slice(0, 90)),
  ],
  ['volunteer', 'organization', (e) => words(str(at(e, 'position')))],
  [
    'education',
    'institution',
    (e) => words(str(at(e, 'studyType')), str(at(e, 'area'))),
  ],
  ['certificates', 'name', (e) => words(str(at(e, 'issuer')))],
  ['publications', 'name', (e) => words(str(at(e, 'publisher')))],
  ['awards', 'title', (e) => words(str(at(e, 'awarder')))],
];

/** Sections dated by one day (a certificate, an award) rather than a span. */
const ONE_DAY: Partial<Record<Section, string>> = {
  certificates: 'date',
  awards: 'date',
  publications: 'releaseDate',
};

/**
 * Every entry of a resume worth evidence, keyed by section and position
 * ("work:0"), with its years: endYear is null while it's current.
 */
export const resumeEntries = (resume: unknown): ResumeEntry[] =>
  SECTIONS.flatMap(([section, labelField, detail]) =>
    list(at(resume, section)).flatMap((e, i): ResumeEntry[] => {
      const label = str(at(e, labelField)) || str(at(e, 'name'));
      if (!label) return [];
      const day = ONE_DAY[section];
      const start = day ? year(at(e, day)) : year(at(e, 'startDate'));
      const end = day ? start : year(at(e, 'endDate'));
      return [
        {
          key: `${section}:${i}`,
          section,
          label,
          detail: detail(e),
          startYear: start,
          endYear: end,
          family: null,
          seniority: null,
        },
      ];
    })
  );

/** Each entry's own words, for reading skills out of: titles, summaries, highlights. */
export const entryTexts = (resume: unknown): Map<string, string> => {
  const texts = new Map<string, string>();
  for (const [section] of SECTIONS) {
    list(at(resume, section)).forEach((e, i) => {
      const fields = [
        'name',
        'position',
        'organization',
        'institution',
        'area',
        'studyType',
        'title',
        'summary',
        'description',
        'issuer',
        'publisher',
      ];
      texts.set(
        `${section}:${i}`,
        [
          ...fields.map((f) => str(at(e, f))),
          ...list(at(e, 'highlights')).map(str),
          ...list(at(e, 'keywords')).map(str),
          ...list(at(e, 'courses')).map(str),
          ...list(at(e, 'roles')).map(str),
        ]
          .filter(Boolean)
          .join('\n')
      );
    });
  }
  return texts;
};

/** What the rest stands on: education, certificates, languages. */
export const resumeFoundations = (resume: unknown): Foundation[] => [
  ...list(at(resume, 'education')).flatMap((e, i): Foundation[] => {
    const label = str(at(e, 'institution'));
    return label
      ? [
          {
            key: `education:${i}`,
            kind: 'education',
            label,
            detail: words(str(at(e, 'studyType')), str(at(e, 'area'))),
          },
        ]
      : [];
  }),
  ...list(at(resume, 'certificates')).flatMap((c, i): Foundation[] => {
    const label = str(at(c, 'name'));
    return label
      ? [
          {
            key: `certificates:${i}`,
            kind: 'certificate',
            label,
            detail: words(str(at(c, 'issuer'))),
          },
        ]
      : [];
  }),
  ...list(at(resume, 'languages')).flatMap((l, i): Foundation[] => {
    const label = str(at(l, 'language'));
    return label
      ? [
          {
            key: `languages:${i}`,
            kind: 'language',
            label,
            detail: words(str(at(l, 'fluency'))),
          },
        ]
      : [];
  }),
];

/** The resume as the reader sees it: everything but meta and references. */
export const readable = (resume: unknown): Record<string, unknown> =>
  Predicate.isObject(resume)
    ? Object.fromEntries(
        Object.entries(resume).filter(
          ([k]) => k !== 'meta' && k !== 'references'
        )
      )
    : {};

/** One resume version's key: INSIGHT_VERSION and the readable resume, hashed. */
export const resumeKey = (resume: unknown): string =>
  createHash('sha256')
    .update(`${INSIGHT_VERSION}\n${JSON.stringify(readable(resume))}`)
    .digest('hex');
