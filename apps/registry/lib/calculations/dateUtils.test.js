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

  it('handles one year duration', () => {
    const start = new Date('2020-01-01');
    const end = new Date('2021-01-01');

    const result = calculateDurationInDays(start, end);

    expect(result).toBe(366); // 2020 was a leap year
  });

  it('uses current date when end not provided', () => {
    const start = new Date('2020-01-01');

    const result = calculateDurationInDays(start);

    expect(result).toBeGreaterThan(0);
  });

  it('handles same start and end date', () => {
    const date = new Date('2020-01-01');

    const result = calculateDurationInDays(date, date);

    expect(result).toBe(0);
  });

  it('handles dates in same month', () => {
    const start = new Date('2020-05-10');
    const end = new Date('2020-05-20');

    const result = calculateDurationInDays(start, end);

    expect(result).toBe(10);
  });
});

describe('daysToYearsMonthsDays', () => {
  it('converts days to years', () => {
    const result = daysToYearsMonthsDays(365);

    expect(result.years).toBe(1);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('converts days to years and months', () => {
    const result = daysToYearsMonthsDays(395);

    expect(result.years).toBe(1);
    expect(result.months).toBe(1);
    expect(result.days).toBe(0);
  });

  it('converts days to years, months, and days', () => {
    const result = daysToYearsMonthsDays(400);

    expect(result.years).toBe(1);
    expect(result.months).toBe(1);
    expect(result.days).toBe(5);
  });

  it('handles zero days', () => {
    const result = daysToYearsMonthsDays(0);

    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('handles less than one year', () => {
    const result = daysToYearsMonthsDays(200);

    expect(result.years).toBe(0);
    expect(result.months).toBe(6);
    expect(result.days).toBe(20);
  });

  it('handles less than one month', () => {
    const result = daysToYearsMonthsDays(15);

    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(15);
  });

  it('rounds days to nearest integer', () => {
    const result = daysToYearsMonthsDays(365.7);

    expect(result.days).toBe(Math.round(0.7));
  });

  it('handles large day values', () => {
    const result = daysToYearsMonthsDays(1000);

    expect(result.years).toBe(2);
    expect(result.months).toBeGreaterThan(0);
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

    expect(result).toHaveLength(1);
  });

  it('merges overlapping ranges', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-06-30') },
      { startDate: new Date('2020-04-01'), endDate: new Date('2020-12-31') },
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
  });

  it('sorts ranges before merging', () => {
    const ranges = [
      { startDate: new Date('2021-01-01'), endDate: new Date('2021-12-31') },
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-12-31') },
    ];

    const result = mergeOverlappingRanges(ranges);

    expect(result[0].startDate).toEqual(new Date('2020-01-01'));
  });

  it('merges adjacent ranges', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-06-30') },
      { startDate: new Date('2020-06-30'), endDate: new Date('2020-12-31') },
    ];

    const result = mergeOverlappingRanges(ranges);

    expect(result).toHaveLength(1);
  });

  it('handles multiple overlapping ranges', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-04-01') },
      { startDate: new Date('2020-03-01'), endDate: new Date('2020-06-01') },
      { startDate: new Date('2020-05-01'), endDate: new Date('2020-08-01') },
    ];

    const result = mergeOverlappingRanges(ranges);

    expect(result).toHaveLength(1);
  });

  it('extends range to maximum end date', () => {
    const ranges = [
      { startDate: new Date('2020-01-01'), endDate: new Date('2020-12-31') },
      { startDate: new Date('2020-06-01'), endDate: new Date('2020-08-01') },
    ];

    const result = mergeOverlappingRanges(ranges);

    expect(result[0].endDate).toEqual(new Date('2020-12-31'));
  });
});
