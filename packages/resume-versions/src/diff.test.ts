import completeResume from '@jsonresume/sample-data/complete-resume.json';
import { describe, expect, it } from 'vitest';
import { diffResumes, sameJson } from './diff';
import {
  isRealResume,
  isSampleResume,
  savedProperties,
  sectionCount,
} from './real';

describe('diffResumes', () => {
  it('names each changed field by its path', () => {
    const before = {
      basics: { name: 'Ada', label: 'Engineer' },
      work: [{ name: 'Acme', highlights: ['Shipped'] }],
      skills: [{ name: 'Go' }],
    };
    const after = {
      basics: { name: 'Ada Lovelace', label: 'Engineer', email: 'a@b.c' },
      work: [
        { name: 'Acme', highlights: ['Shipped', 'Led'] },
        { name: 'Initech' },
      ],
    };
    expect(diffResumes(before, after)).toEqual([
      { path: 'basics.name', kind: 'changed' },
      { path: 'basics.email', kind: 'added' },
      { path: 'work[0].highlights', kind: 'changed' },
      { path: 'work[1]', kind: 'added' },
      { path: 'skills', kind: 'removed' },
    ]);
  });

  it('starts from nothing: every section is added', () => {
    expect(diffResumes(undefined, { basics: {}, work: [] })).toEqual([
      { path: 'basics', kind: 'added' },
      { path: 'work', kind: 'added' },
    ]);
  });

  it('ignores key order', () => {
    const a = { basics: { name: 'Ada', label: 'X' }, work: [] };
    const b = { work: [], basics: { label: 'X', name: 'Ada' } };
    expect(sameJson(a, b)).toBe(true);
    expect(diffResumes(a, b)).toEqual([]);
    expect(sameJson([1, 2], [2, 1])).toBe(false);
  });
});

describe('real resumes', () => {
  const own = {
    basics: { name: 'Ada Lovelace', label: 'Engineer' },
    work: [{ name: 'Analytical Engines', position: 'Programmer' }],
    skills: [{ name: 'Mathematics' }],
  };

  it('tells the sample from a resume of their own', () => {
    expect(isSampleResume(completeResume)).toBe(true);
    expect(isRealResume(completeResume)).toBe(false);
    // Still the sample under its name, even with a job changed.
    const edited = {
      ...completeResume,
      work: [{ name: 'Elsewhere', position: 'Dev' }],
    };
    expect(isRealResume(edited)).toBe(false);
    expect(isRealResume(own)).toBe(true);
  });

  it('needs a job and a skill that say something', () => {
    expect(isRealResume({ ...own, skills: [] })).toBe(false);
    expect(isRealResume({ ...own, work: [{ name: ' ' }] })).toBe(false);
    expect(isRealResume({ basics: { name: '' } })).toBe(false);
  });

  it('counts sections and builds the event properties', () => {
    expect(sectionCount(own)).toBe(3);
    expect(sectionCount({ basics: { name: '' }, work: [] })).toBe(0);
    expect(
      savedProperties(
        { version: 1, first: true, real: true, sections: 3 },
        'mcp'
      )
    ).toEqual({ source: 'mcp', real: true, first: true, sections: 3 });
  });
});
