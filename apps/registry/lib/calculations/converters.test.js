import { describe, it, expect } from 'vitest';
import { convertYearsToYearsMonthsDays } from './converters';

describe('convertYearsToYearsMonthsDays', () => {
  it('converts exact years correctly', () => {
    const result = convertYearsToYearsMonthsDays(3);
    expect(result).toEqual({ years: 3, months: 0, days: 0 });
  });

  it('converts years with months correctly', () => {
    const result = convertYearsToYearsMonthsDays(2.5);
    expect(result).toEqual({ years: 2, months: 6, days: 0 });
  });

  it('converts years with partial months to days', () => {
    const result = convertYearsToYearsMonthsDays(1.1); // 1.1 * 12 = 13.2 months = 1 month + 0.2*30 = 6 days
    expect(result.years).toBe(1);
    expect(result.months).toBe(1);
    expect(result.days).toBe(6);
  });

  it('handles zero years', () => {
    const result = convertYearsToYearsMonthsDays(0);
    expect(result).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('handles fractional years less than one', () => {
    const result = convertYearsToYearsMonthsDays(0.25);
    expect(result.years).toBe(0);
    expect(result.months).toBe(3);
    expect(result.days).toBe(0);
  });

  it('converts 1.5 years to 1 year 6 months', () => {
    const result = convertYearsToYearsMonthsDays(1.5);
    expect(result).toEqual({ years: 1, months: 6, days: 0 });
  });

  it('converts 2.75 years to 2 years 9 months', () => {
    const result = convertYearsToYearsMonthsDays(2.75);
    expect(result.years).toBe(2);
    expect(result.months).toBe(9);
    expect(result.days).toBe(0);
  });

  it('handles decimal precision for days', () => {
    const result = convertYearsToYearsMonthsDays(1.05); // 1.05 * 12 = 12.6 months = 0 years + 12 months + 0.6*30 = 18 days
    expect(result.years).toBe(1);
    expect(result.months).toBe(0);
    expect(result.days).toBeGreaterThanOrEqual(17);
    expect(result.days).toBeLessThanOrEqual(19);
  });

  it('rounds days to nearest integer', () => {
    const result = convertYearsToYearsMonthsDays(1.017); // Should have fractional days
    expect(result.days).toBe(Math.round(result.days));
    expect(Number.isInteger(result.days)).toBe(true);
  });

  it('handles large year values', () => {
    const result = convertYearsToYearsMonthsDays(10.25);
    expect(result.years).toBe(10);
    expect(result.months).toBe(3);
    expect(result.days).toBe(0);
  });

  it('handles very small decimal values', () => {
    const result = convertYearsToYearsMonthsDays(0.01); // 0.12 months = 3.6 days
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBeGreaterThanOrEqual(3);
    expect(result.days).toBeLessThanOrEqual(4);
  });
});
