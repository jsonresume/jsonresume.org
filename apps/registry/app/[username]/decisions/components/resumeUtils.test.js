import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatDate, calcYearsOfExperience } from './resumeUtils';

describe('formatDate', () => {
  it('returns "Present" for a missing date', () => {
    expect(formatDate(null)).toBe('Present');
    expect(formatDate(undefined)).toBe('Present');
    expect(formatDate('')).toBe('Present');
  });

  it('formats a date as "Mon YYYY"', () => {
    expect(formatDate('2021-03-15')).toBe('Mar 2021');
  });
});

describe('calcYearsOfExperience', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for no work history', () => {
    expect(calcYearsOfExperience([])).toBe(0);
  });

  it('sums closed date ranges into whole years', () => {
    const work = [
      { startDate: '2018-01-01', endDate: '2020-01-01' }, // ~2y
      { startDate: '2020-01-01', endDate: '2023-01-01' }, // ~3y
    ];
    expect(calcYearsOfExperience(work)).toBe(5);
  });

  it('counts ongoing roles through today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
    const work = [{ startDate: '2020-01-01' }]; // no endDate -> ~4y
    expect(calcYearsOfExperience(work)).toBe(4);
  });

  it('ignores entries without a start date', () => {
    expect(calcYearsOfExperience([{ endDate: '2020-01-01' }])).toBe(0);
  });
});
