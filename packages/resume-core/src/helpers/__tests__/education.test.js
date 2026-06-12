import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculateEducationYears, getHighestDegree } from '../education.js';
import { education, FIXED_NOW } from './fixtures.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateEducationYears', () => {
  // KNOWN BUG (documented, not fixed here): the implementation divides by
  // ((1000 * 60 * 60 * 24) / 365.25) instead of (1000 * 60 * 60 * 24 * 365.25),
  // so it returns days * 365.25 rather than years. The fixture spans ~5.5 real
  // years of study but the function reports 733057. These assertions lock in
  // CURRENT behavior; update them when the formula is fixed.
  it('returns the current (inflated) value for the fixture', () => {
    expect(calculateEducationYears(education)).toBe(733057);
  });

  it('returns the current (inflated) value for a single entry', () => {
    expect(
      calculateEducationYears([
        { startDate: '2012-09-01', endDate: '2016-06-01' },
      ])
    ).toBe(500027);
  });

  it('skips entries without a startDate', () => {
    expect(calculateEducationYears([{ endDate: '2016-06-01' }, {}])).toBe(0);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(calculateEducationYears([])).toBe(0);
    expect(calculateEducationYears()).toBe(0);
    expect(calculateEducationYears(null)).toBe(0);
    expect(calculateEducationYears('not-an-array')).toBe(0);
  });
});

describe('getHighestDegree', () => {
  it('returns the studyType of the highest ranked degree', () => {
    expect(getHighestDegree(education)).toBe('Master of Science');
  });

  it('ranks doctorates above masters above bachelors', () => {
    expect(
      getHighestDegree([
        { studyType: 'Bachelor of Arts' },
        { studyType: 'PhD in Physics' },
        { studyType: 'Master of Science' },
      ])
    ).toBe('PhD in Physics');
  });

  it('matches degree keywords case-insensitively', () => {
    expect(getHighestDegree([{ studyType: 'BACHELOR OF ARTS' }])).toBe(
      'BACHELOR OF ARTS'
    );
    expect(getHighestDegree([{ studyType: 'MBA' }])).toBe('MBA');
  });

  it('keeps the first entry on rank ties', () => {
    expect(
      getHighestDegree([{ studyType: 'Doctorate' }, { studyType: 'PhD' }])
    ).toBe('Doctorate');
  });

  it('returns an empty string when no studyType matches a known degree', () => {
    expect(getHighestDegree([{ studyType: 'Bootcamp' }])).toBe('');
    expect(getHighestDegree([{ institution: 'No Study Type U' }])).toBe('');
  });

  it('returns an empty string for empty, missing, or non-array input', () => {
    expect(getHighestDegree([])).toBe('');
    expect(getHighestDegree()).toBe('');
    expect(getHighestDegree(null)).toBe('');
  });
});
