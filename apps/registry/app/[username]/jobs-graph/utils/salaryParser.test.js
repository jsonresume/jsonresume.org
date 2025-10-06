import { describe, it, expect } from 'vitest';
import { parseSalary, calculateSalaryRange } from './salaryParser';

describe('parseSalary', () => {
  it('returns null for falsy values', () => {
    expect(parseSalary(null)).toBeNull();
    expect(parseSalary(undefined)).toBeNull();
    expect(parseSalary('')).toBeNull();
    // 0 is falsy, so it returns null
    expect(parseSalary(0)).toBeNull();
  });

  it('returns number input as-is', () => {
    expect(parseSalary(50000)).toBe(50000);
    expect(parseSalary(100000)).toBe(100000);
  });

  it('parses simple number string', () => {
    expect(parseSalary('50000')).toBe(50000);
    expect(parseSalary('100000')).toBe(100000);
  });

  it('parses salary with k multiplier', () => {
    expect(parseSalary('50k')).toBe(50000);
    expect(parseSalary('100K')).toBe(100000);
    expect(parseSalary('75k')).toBe(75000);
  });

  it('parses salary with K multiplier (uppercase)', () => {
    expect(parseSalary('50K')).toBe(50000);
    expect(parseSalary('100K')).toBe(100000);
  });

  it('parses salary ranges by averaging', () => {
    expect(parseSalary('50000-80000')).toBe(65000);
    expect(parseSalary('50k-80k')).toBe(65000);
  });

  it('parses salary ranges with spaces', () => {
    expect(parseSalary('50 - 80')).toBe(65);
    expect(parseSalary('50k - 80k')).toBe(65000);
  });

  it('handles decimal values', () => {
    expect(parseSalary('50.5k')).toBe(50500);
    expect(parseSalary('100.25k')).toBe(100250);
  });

  it('extracts numbers from text', () => {
    expect(parseSalary('Salary: 50000')).toBe(50000);
    expect(parseSalary('$50k per year')).toBe(50000);
  });

  it('returns null when no numbers found', () => {
    expect(parseSalary('No salary')).toBeNull();
    expect(parseSalary('TBD')).toBeNull();
  });

  it('handles very large numbers', () => {
    expect(parseSalary('500000')).toBe(500000);
    expect(parseSalary('500k')).toBe(500000);
  });

  it('sorts range values before averaging', () => {
    // If multiple numbers, sorts before averaging
    expect(parseSalary('80000-50000')).toBe(65000);
  });
});

describe('calculateSalaryRange', () => {
  it('returns { min: 0, max: 0 } for empty jobInfo', () => {
    expect(calculateSalaryRange({})).toEqual({ min: 0, max: 0 });
  });

  it('calculates min and max from job salaries', () => {
    const jobInfo = {
      job1: { salary: '50000' },
      job2: { salary: '100000' },
      job3: { salary: '75000' },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({
      min: 50000,
      max: 100000,
    });
  });

  it('handles k multiplier in salaries', () => {
    const jobInfo = {
      job1: { salary: '50k' },
      job2: { salary: '100k' },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({
      min: 50000,
      max: 100000,
    });
  });

  it('ignores jobs without salary', () => {
    const jobInfo = {
      job1: { salary: '50000' },
      job2: { salary: null },
      job3: { salary: '100000' },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({
      min: 50000,
      max: 100000,
    });
  });

  it('handles single job', () => {
    const jobInfo = {
      job1: { salary: '75000' },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({
      min: 75000,
      max: 75000,
    });
  });

  it('handles salary ranges', () => {
    const jobInfo = {
      job1: { salary: '50k-60k' },
      job2: { salary: '90k-100k' },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({
      min: 55000,
      max: 95000,
    });
  });

  it('returns { min: 0, max: 0 } when all salaries are null', () => {
    const jobInfo = {
      job1: { salary: null },
      job2: { salary: null },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({ min: 0, max: 0 });
  });

  it('handles mixed formats', () => {
    const jobInfo = {
      job1: { salary: 50000 },
      job2: { salary: '75k' },
      job3: { salary: '90000-100000' },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({
      min: 50000,
      max: 95000,
    });
  });

  it('handles jobs without salary field', () => {
    const jobInfo = {
      job1: { salary: '50000' },
      job2: { title: 'Developer' },
    };

    expect(calculateSalaryRange(jobInfo)).toEqual({
      min: 50000,
      max: 50000,
    });
  });
});
