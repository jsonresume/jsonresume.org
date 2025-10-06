import { describe, it, expect } from 'vitest';
import {
  calculateDurationInDays,
  daysToYearsMonthsDays,
  mergeOverlappingRanges,
} from './dateUtils';

describe('calculateDurationInDays', () => {
  it('calculates duration between two dates', () => {
    const start = new Date('2020-01-01');
    const end = new Date('2020-01-31');
    const result = calculateDurationInDays(start, end);
    expect(result).toBe(30);
  });

  it('uses current date as default end date', () => {
    const start = new Date(Date.now() - 1000 * 60 * 60 * 24); // 1 day ago
    const result = calculateDurationInDays(start);
    expect(result).toBeCloseTo(1, 0);
  });

  it('calculates duration in years', () => {
    const start = new Date('2020-01-01');
    const end = new Date('2021-01-01');
    const result = calculateDurationInDays(start, end);
    expect(result).toBe(366); // 2020 was a leap year
  });

  it('handles same start and end date', () => {
    const date = new Date('2020-01-01');
    const result = calculateDurationInDays(date, date);
    expect(result).toBe(0);
  });
});

describe('daysToYearsMonthsDays', () => {
  it('converts days to years, months, and days', () => {
    const result = daysToYearsMonthsDays(400);
    expect(result).toEqual({ years: 1, months: 1, days: 5 });
  });

  it('handles exactly one year', () => {
    const result = daysToYearsMonthsDays(365);
    expect(result).toEqual({ years: 1, months: 0, days: 0 });
  });

  it('handles exactly one month', () => {
    const result = daysToYearsMonthsDays(30);
    expect(result).toEqual({ years: 0, months: 1, days: 0 });
  });

  it('handles less than one month', () => {
    const result = daysToYearsMonthsDays(15);
    expect(result).toEqual({ years: 0, months: 0, days: 15 });
  });

  it('handles zero days', () => {
    const result = daysToYearsMonthsDays(0);
    expect(result).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('handles multiple years and months', () => {
    const result = daysToYearsMonthsDays(800);
    expect(result).toEqual({ years: 2, months: 2, days: 10 });
  });
});

describe('mergeOverlappingRanges', () => {
  it('returns empty array for empty input', () => {
    const result = mergeOverlappingRanges([]);
    expect(result).toEqual([]);
  });

  it('returns single range unchanged', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-12-31') },
    ];
    const result = mergeOverlappingRanges(ranges);
    expect(result).toEqual(ranges);
  });

  it('merges overlapping ranges', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-06-30') },
      { startDate: new Date('2020-03-01'), endDate: new Date('2020-12-31') },
    ];
    const result = mergeOverlappingRanges(ranges);
    expect(result).toHaveLength(1);
    expect(result[0].startDate).toEqual(new Date('2020-01-01'));
    expect(result[0].endDate).toEqual(new Date('2020-12-31'));
  });

  it('keeps non-overlapping ranges separate', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-06-30') },
      { startDate: new Date('2021-01-01'), endDate: new Date('2021-12-31') },
    ];
    const result = mergeOverlappingRanges(ranges);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(ranges[0]);
    expect(result[1]).toEqual(ranges[1]);
  });

  it('handles ranges that touch but do not overlap', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-06-30') },
      { startDate: new Date('2020-06-30'), endDate: new Date('2020-12-31') },
    ];
    const result = mergeOverlappingRanges(ranges);
    expect(result).toHaveLength(1);
    expect(result[0].startDate).toEqual(new Date('2020-01-01'));
    expect(result[0].endDate).toEqual(new Date('2020-12-31'));
  });

  it('sorts ranges by start date before merging', () => {
    const ranges = [
      { startDate: new Date('2021-01-01'), endDate: new Date('2021-12-31') },
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-12-31') },
    ];
    const result = mergeOverlappingRanges(ranges);
    expect(result).toHaveLength(2);
    expect(result[0].startDate).toEqual(new Date('2020-01-01'));
    expect(result[1].startDate).toEqual(new Date('2021-01-01'));
  });

  it('merges multiple overlapping ranges', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-04-30') },
      { startDate: new Date('2020-03-01'), endDate: new Date('2020-07-31') },
      { startDate: new Date('2020-06-01'), endDate: new Date('2020-12-31') },
    ];
    const result = mergeOverlappingRanges(ranges);
    expect(result).toHaveLength(1);
    expect(result[0].startDate).toEqual(new Date('2020-01-01'));
    expect(result[0].endDate).toEqual(new Date('2020-12-31'));
  });
});
