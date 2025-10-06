import { describe, it, expect } from 'vitest';
import { convertYearsToYearsMonthsDays } from './converters';

describe('convertYearsToYearsMonthsDays', () => {
  it('converts whole years', () => {
    const result = convertYearsToYearsMonthsDays(5);

    expect(result.years).toBe(5);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('converts years with months', () => {
    const result = convertYearsToYearsMonthsDays(2.5);

    expect(result.years).toBe(2);
    expect(result.months).toBe(6);
    expect(result.days).toBe(0);
  });

  it('converts years with partial months', () => {
    const result = convertYearsToYearsMonthsDays(1.25);

    expect(result.years).toBe(1);
    expect(result.months).toBe(3);
    expect(result.days).toBe(0);
  });

  it('handles zero years', () => {
    const result = convertYearsToYearsMonthsDays(0);

    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('handles decimal years with days', () => {
    const result = convertYearsToYearsMonthsDays(3.1);

    expect(result.years).toBe(3);
    expect(result.months).toBe(1);
    // 0.1 * 12 = 1.2 months, 0.2 * 30 = 6 days
    expect(result.days).toBe(6);
  });

  it('handles fractional months and days', () => {
    const result = convertYearsToYearsMonthsDays(1.55);

    expect(result.years).toBe(1);
    expect(result.months).toBe(6);
    // 0.55 * 12 = 6.6 months, 0.6 * 30 = 18 days
    expect(result.days).toBe(18);
  });

  it('rounds days to nearest integer', () => {
    const result = convertYearsToYearsMonthsDays(2.333);

    expect(result.years).toBe(2);
    expect(result.months).toBe(3);
    // 0.333 * 12 = 3.996 months, 0.996 * 30 = 29.88 ≈ 30 days
    expect(result.days).toBe(30);
  });

  it('handles less than one year', () => {
    const result = convertYearsToYearsMonthsDays(0.5);

    expect(result.years).toBe(0);
    expect(result.months).toBe(6);
    expect(result.days).toBe(0);
  });

  it('handles less than one month', () => {
    const result = convertYearsToYearsMonthsDays(0.05);

    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    // 0.05 * 12 = 0.6 months, 0.6 * 30 = 18 days
    expect(result.days).toBe(18);
  });

  it('handles large year values', () => {
    const result = convertYearsToYearsMonthsDays(25.75);

    expect(result.years).toBe(25);
    expect(result.months).toBe(9);
    expect(result.days).toBe(0);
  });

  it('returns object with years, months, days properties', () => {
    const result = convertYearsToYearsMonthsDays(1.5);

    expect(result).toHaveProperty('years');
    expect(result).toHaveProperty('months');
    expect(result).toHaveProperty('days');
  });

  it('handles very small decimals', () => {
    const result = convertYearsToYearsMonthsDays(0.01);

    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    // 0.01 * 12 = 0.12 months, 0.12 * 30 = 3.6 ≈ 4 days
    expect(result.days).toBe(4);
  });
});
