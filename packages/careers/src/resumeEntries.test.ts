import { expect, it } from 'vitest';
import {
  entryTexts,
  resumeEntries,
  resumeFoundations,
  resumeKey,
} from './resumeEntries';
import { resume } from './test/fakes';

it('reads every entry with its years, current ones still open', () => {
  expect(resumeEntries(resume)).toEqual([
    {
      key: 'work:0',
      section: 'work',
      label: 'Acme',
      detail: 'Staff Engineer',
      startYear: 2021,
      endYear: null,
      family: null,
      seniority: null,
    },
    expect.objectContaining({ key: 'work:1', startYear: 2015, endYear: 2021 }),
    expect.objectContaining({
      key: 'projects:0',
      detail: 'A Haskell toy compiler',
    }),
    expect.objectContaining({
      key: 'education:0',
      detail: 'Bachelors Computer Science',
      endYear: 2014,
    }),
    // A certificate is dated by one day.
    expect.objectContaining({
      key: 'certificates:0',
      startYear: 2022,
      endYear: 2022,
    }),
  ]);
  expect(entryTexts(resume).get('work:0')).toContain(
    'billing pipeline on PostgreSQL'
  );
});

it('reads education, certificates and languages as foundations', () => {
  expect(
    resumeFoundations(resume).map((f) => [f.kind, f.label, f.detail])
  ).toEqual([
    ['education', 'UQ', 'Bachelors Computer Science'],
    ['certificate', 'CKA', 'CNCF'],
    ['language', 'English', 'Native'],
  ]);
});

it('keys a resume version by what it says, not its theme', () => {
  const key = resumeKey(resume);
  expect(resumeKey({ ...resume, meta: { theme: 'even' } })).toBe(key);
  expect(resumeKey({ ...resume, work: [] })).not.toBe(key);
  expect(resumeEntries(null)).toEqual([]);
});
