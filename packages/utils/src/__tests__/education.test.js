import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateEducationYears,
  getHighestDegree,
} from '../metrics/education.js';
import { education, FIXED_NOW } from './fixtures.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateEducationYears (BUGFIX: ms-per-year)', () => {
  // The original implementation divided by ((ms-per-day) / 365.25) instead of
  // (ms-per-day * 365.25), inflating results ~133M-fold. The fixture spans ~5.5
  // real years of study; the fix now reports a sane, rounded number of years.
  it('returns a realistic number of years for the fixture', () => {
    expect(calculateEducationYears(education)).toBe(5);
  });

  it('returns realistic years for a single entry (~3.75y => 4)', () => {
    expect(
      calculateEducationYears([
        { startDate: '2012-09-01', endDate: '2016-06-01' },
      ])
    ).toBe(4);
  });

  it('is the same order of magnitude as the real elapsed years (not inflated)', () => {
    // Guards against a regression to the old (end-start)/(ms-per-day/365.25)
    // formula, which returned 733057 for this fixture.
    expect(calculateEducationYears(education)).toBeLessThan(20);
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
