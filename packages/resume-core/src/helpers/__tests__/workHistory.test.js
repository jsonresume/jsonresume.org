import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateVolunteerYears,
  getUniqueIndustries,
  getCurrentEmployer,
  isCurrentlyEmployed,
} from '../workHistory.js';
import { work, volunteer, FIXED_NOW } from './fixtures.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateVolunteerYears', () => {
  it('sums volunteer tenure, skipping entries without a startDate', () => {
    // 3 years at Code Club; Food Bank entry has no startDate
    expect(calculateVolunteerYears(volunteer)).toBe(3);
  });

  it('uses the current date for ongoing roles (no endDate)', () => {
    expect(calculateVolunteerYears([{ startDate: '2024-01-01' }])).toBe(2);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(calculateVolunteerYears([])).toBe(0);
    expect(calculateVolunteerYears()).toBe(0);
    expect(calculateVolunteerYears(null)).toBe(0);
    expect(calculateVolunteerYears('not-an-array')).toBe(0);
  });
});

describe('getUniqueIndustries', () => {
  it('returns unique industries in insertion order, skipping missing ones', () => {
    expect(getUniqueIndustries(work)).toEqual(['Technology', 'Finance']);
  });

  it('deduplicates repeated industries', () => {
    expect(
      getUniqueIndustries([
        { industry: 'Technology' },
        { industry: 'Technology' },
        { industry: 'Healthcare' },
      ])
    ).toEqual(['Technology', 'Healthcare']);
  });

  it('returns an empty array for empty, missing, or non-array input', () => {
    expect(getUniqueIndustries([])).toEqual([]);
    expect(getUniqueIndustries()).toEqual([]);
    expect(getUniqueIndustries(null)).toEqual([]);
  });
});

describe('getCurrentEmployer', () => {
  it('returns the first job without an endDate', () => {
    expect(getCurrentEmployer(work)).toBe(work[0]);
  });

  it('finds the current job even when it is not first in the array', () => {
    const current = { name: 'Now Co', startDate: '2024-01-01' };
    expect(
      getCurrentEmployer([
        { name: 'Old Co', startDate: '2018-01-01', endDate: '2021-01-01' },
        current,
      ])
    ).toBe(current);
  });

  it('falls back to the first entry when every job has ended', () => {
    const jobs = [
      { name: 'A', startDate: '2018-01-01', endDate: '2021-01-01' },
      { name: 'B', startDate: '2016-01-01', endDate: '2018-01-01' },
    ];
    expect(getCurrentEmployer(jobs)).toBe(jobs[0]);
  });

  it('returns null for empty, missing, or non-array input', () => {
    expect(getCurrentEmployer([])).toBeNull();
    expect(getCurrentEmployer()).toBeNull();
    expect(getCurrentEmployer(null)).toBeNull();
  });
});

describe('isCurrentlyEmployed', () => {
  it('returns true when any job has no endDate', () => {
    expect(isCurrentlyEmployed(work)).toBe(true);
  });

  it('returns false when every job has ended', () => {
    expect(
      isCurrentlyEmployed([
        { name: 'A', startDate: '2018-01-01', endDate: '2021-01-01' },
      ])
    ).toBe(false);
  });

  it('returns false for empty, missing, or non-array input', () => {
    expect(isCurrentlyEmployed([])).toBe(false);
    expect(isCurrentlyEmployed()).toBe(false);
    expect(isCurrentlyEmployed(null)).toBe(false);
  });
});
