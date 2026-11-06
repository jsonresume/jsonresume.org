import { embedderFrom } from '@repo/jobs';
import { Effect, Layer } from 'effect';
import { InsightReader, type Reading } from '../insightReader';

/**
 * Vectors by concept: names sharing a concept word point the same way,
 * everything else its own way. All inside the dimensions skills keep.
 */
const CONCEPTS: ReadonlyArray<[concept: number, words: RegExp]> = [
  [0, /postgres/],
  [1, /kube/],
  [2, /rust/],
];
export const FakeEmbedder = embedderFrom((text) => {
  const v = new Float32Array(3072);
  const lower = text.toLowerCase();
  const concept = CONCEPTS.find(([, words]) => words.test(lower));
  if (concept) v[concept[0]] = 1;
  else {
    let h = 0;
    for (const c of lower) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    v[10 + (h % 240)] = 1;
  }
  return v;
});

/** A reader that answers `reading` (after `delay`, if given) and counts its calls. */
export const fakeReader = (
  reading: Reading,
  calls: { count: number },
  delay?: Effect.Effect<void>
) =>
  Layer.succeed(
    InsightReader,
    InsightReader.of({
      read: () =>
        Effect.sync(() => {
          calls.count += 1;
        }).pipe(Effect.andThen(delay ?? Effect.void), Effect.as(reading)),
    })
  );

/** A realistic resume: current and past work, a project, education, a certificate. */
export const resume = {
  basics: { name: 'Ada', label: 'Staff Engineer' },
  work: [
    {
      name: 'Acme',
      position: 'Staff Engineer',
      startDate: '2021-03-01',
      highlights: [
        'Led the move of every service to Kubernetes.',
        'Built the billing pipeline on PostgreSQL.',
      ],
    },
    {
      name: 'Initech',
      position: 'Developer',
      startDate: '2015-01-01',
      endDate: '2021-02-01',
      summary: 'Wrote Rust services for payments.',
    },
  ],
  projects: [
    { name: 'Toy', description: 'A Haskell toy compiler', startDate: '2024' },
  ],
  education: [
    {
      institution: 'UQ',
      studyType: 'Bachelors',
      area: 'Computer Science',
      startDate: '2010',
      endDate: '2014',
    },
  ],
  certificates: [{ name: 'CKA', issuer: 'CNCF', date: '2022-05-01' }],
  languages: [{ language: 'English', fluency: 'Native' }],
  skills: [
    { name: 'Backend', keywords: ['Rust', 'Postgres', 'Erlang'] },
    { name: 'Kubernetes' },
  ],
  meta: { theme: 'pro' },
};

export const reading: Reading = {
  entries: [
    {
      key: 'work:0',
      family: 'platform',
      seniority: 'staff_plus',
      skills: [
        {
          name: 'Kubernetes',
          strength: 3,
          quote: 'Led the move of every service to Kubernetes.',
        },
        {
          name: 'PostgreSQL',
          strength: 2,
          quote: 'Built the billing pipeline on PostgreSQL.',
        },
      ],
    },
    {
      // As the live model wrote some keys: with the line it was given.
      key: 'work:1: Initech (Developer)',
      family: 'backend',
      seniority: 'mid',
      skills: [
        {
          name: 'Rust',
          strength: 2,
          quote: 'Wrote Rust services for payments.',
        },
      ],
    },
    { key: 'work:9', family: 'backend', seniority: 'mid', skills: [] },
    {
      key: 'projects:0',
      family: 'wizard',
      seniority: 'unspecified',
      skills: [],
    },
  ],
  strengths: [
    {
      name: 'Platform migrations',
      summary: 'Moves whole fleets onto new platforms.',
      entries: ['work:0 = Acme (Staff Engineer)'],
    },
  ],
};
