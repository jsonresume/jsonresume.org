/** Checks on what the person has done: jobs, skills, results, dates. */
import { text, texts } from '@repo/resume-formats/read';
import type { AtsCheck, AtsIssue } from './report';
import { check, issue, need, type Entry } from './scoring';

/** The dates tracking systems parse: 2021, 2021-05 or 2021-05-01. */
const ISO = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
/** Whether one date is earlier, at the precision both have: 2015 is not before 2015-09. */
const before = (a: string, b: string) => {
  const n = Math.min(a.length, b.length);
  return a.slice(0, n) < b.slice(0, n);
};
const NUMBER = /\d|%|\$|€|£/;

export const experience = (work: ReadonlyArray<Entry>): AtsCheck => {
  if (work.length === 0)
    return check('experience', 'Work experience', 25, [
      [
        0,
        issue(
          'critical',
          'work',
          'No work experience',
          'Add your jobs, newest first.'
        ),
      ],
    ]);
  const missing = work.flatMap((job, i) => {
    const gaps = [
      text(job['name']) ? undefined : 'company',
      text(job['position']) ? undefined : 'job title',
      text(job['startDate']) ? undefined : 'start date',
      text(job['summary']) || texts(job['highlights']).length > 0
        ? undefined
        : 'description',
    ].filter((g) => g !== undefined);
    return gaps.length > 0 ? [{ i, gaps, name: text(job['name']) }] : [];
  });
  const complete =
    1 - missing.reduce((n, m) => n + m.gaps.length, 0) / (work.length * 4);
  return check('experience', 'Work experience', 25, [
    [8],
    [17 * complete],
    ...missing.map((m): [number, AtsIssue] => [
      0,
      issue(
        'warning',
        `work[${m.i}]`,
        `${m.name ?? `Job ${m.i + 1}`} has no ${m.gaps.join(', ')}`,
        'Fill these in: tracking systems read each job as company, title, dates and description.'
      ),
    ]),
  ]);
};

export const skills = (groups: ReadonlyArray<Entry>): AtsCheck => {
  const keywords = groups.flatMap((g) => texts(g['keywords']));
  return check('skills', 'Skills and keywords', 20, [
    need(
      groups.length > 0,
      6,
      issue(
        'critical',
        'skills',
        'No skills',
        'Add skills: they are what keyword searches match.'
      )
    ),
    need(
      groups.length >= 3,
      4,
      issue(
        'tip',
        'skills',
        'Fewer than three skill groups',
        'Group skills, e.g. languages, frameworks and tools.'
      )
    ),
    keywords.length >= 10
      ? [10]
      : [
          keywords.length,
          issue(
            'warning',
            'skills',
            `${keywords.length} skill keywords`,
            'List at least ten specific skills (TypeScript, Kubernetes, Figma…) as keywords.'
          ),
        ],
  ]);
};

export const impact = (work: ReadonlyArray<Entry>, words: number): AtsCheck => {
  const bullets = work.flatMap((j) => texts(j['highlights']));
  const counted = bullets.filter((b) => NUMBER.test(b)).length;
  return check('impact', 'Achievements', 10, [
    bullets.length >= 5
      ? [4]
      : [
          bullets.length * 0.8,
          issue(
            'warning',
            'work[].highlights',
            `${bullets.length} highlights across your jobs`,
            'Add bullet points (highlights) to each job: at least five in all.'
          ),
        ],
    counted >= 3
      ? [3]
      : [
          counted,
          issue(
            'tip',
            'work[].highlights',
            'Few highlights with numbers',
            'Measure results: "cut load time 40%", "a team of 6", "$2M a year".'
          ),
        ],
    need(
      words >= 250,
      3,
      issue(
        'tip',
        'work',
        `About ${words} words`,
        'Aim for 250 words or more, so searches have something to match.'
      )
    ),
  ]);
};

export const dates = (
  work: ReadonlyArray<Entry>,
  schools: ReadonlyArray<Entry>
): AtsCheck => {
  const odd = [
    ...work.map((e, i) => [e, `work[${i}]`] as const),
    ...schools.map((e, i) => [e, `education[${i}]`] as const),
  ].flatMap(([e, at]) =>
    ['startDate', 'endDate'].flatMap((k) => {
      const v = text(e[k]);
      return v && !ISO.test(v)
        ? [
            issue(
              'warning',
              `${at}.${k}`,
              `"${v}" is not a date systems can read`,
              'Write dates as 2021-05 or 2021-05-01.'
            ),
          ]
        : [];
    })
  );
  const backwards = work.flatMap((e, i) => {
    const [start, end] = [text(e['startDate']), text(e['endDate'])];
    return start &&
      end &&
      ISO.test(start) &&
      ISO.test(end) &&
      before(end, start)
      ? [
          issue(
            'warning',
            `work[${i}]`,
            `${text(e['name']) ?? `Job ${i + 1}`} ends before it starts`,
            'Check the start and end dates.'
          ),
        ]
      : [];
  });
  return check('dates', 'Dates', 5, [
    [5 - 1.5 * (odd.length + backwards.length)],
    ...[...odd, ...backwards].map((p): [number, AtsIssue] => [0, p]),
  ]);
};
