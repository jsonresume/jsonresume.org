/**
 * Shared fixtures for calculation helper tests.
 *
 * All date math in these tests pins "now" to FIXED_NOW via vi.setSystemTime
 * so that open-ended entries (no endDate) produce deterministic values.
 */

/** Pinned system time used by every date-dependent test. */
export const FIXED_NOW = new Date('2026-01-01T00:00:00Z');

/**
 * Work history (most recent first, matching JSON Resume convention):
 * - Acme Corp (current, no endDate): 2021-01-01 -> now = ~5.0 years
 * - Globex: 2018-01-01 -> 2021-01-01 = ~3.0 years
 * - Acme Corp (again, duplicate company name): 2016-01-01 -> 2018-01-01 = ~2.0 years
 * Total ~10.0 years, 2 unique companies, 3 unique positions, 5 highlights.
 */
export const work = [
  {
    name: 'Acme Corp',
    position: 'Senior Engineer',
    startDate: '2021-01-01',
    industry: 'Technology',
    highlights: ['Led platform migration', 'Mentored four engineers'],
  },
  {
    name: 'Globex',
    position: 'Engineer',
    startDate: '2018-01-01',
    endDate: '2021-01-01',
    industry: 'Finance',
    highlights: [
      'Shipped payments service',
      'Cut API latency 40%',
      'On-call rotation lead',
    ],
  },
  {
    name: 'Acme Corp',
    position: 'Junior Engineer',
    startDate: '2016-01-01',
    endDate: '2018-01-01',
  },
];

export const education = [
  {
    institution: 'State University',
    studyType: 'Bachelor of Science',
    area: 'Computer Science',
    startDate: '2012-09-01',
    endDate: '2016-06-01',
  },
  {
    institution: 'State University',
    studyType: 'Master of Science',
    area: 'Computer Science',
    startDate: '2016-09-01',
    endDate: '2018-06-01',
  },
];

export const volunteer = [
  {
    organization: 'Code Club',
    position: 'Mentor',
    startDate: '2019-01-01',
    endDate: '2022-01-01',
  },
  // No startDate: must be skipped by duration calculations.
  { organization: 'Food Bank', position: 'Helper' },
];

export const skills = [
  { name: 'Web', keywords: ['JavaScript', 'TypeScript', 'React'] },
  { name: 'Ops', keywords: ['Docker'] },
  // No keywords: contributes 0 to countTotalSkills but 1 category.
  { name: 'Soft Skills' },
];

export const projects = [{ name: 'Project One' }, { name: 'Project Two' }];

export const publications = [{ name: 'A Paper' }];

export const awards = [{ title: 'Best Engineer' }];

export const languages = [
  { language: 'English', fluency: 'Native' },
  { language: 'Spanish', fluency: 'Professional' },
];

/** A representative, fully-populated JSON Resume object. */
export const fullResume = {
  basics: { name: 'Jane Developer' },
  work,
  education,
  volunteer,
  skills,
  projects,
  publications,
  awards,
  languages,
};
