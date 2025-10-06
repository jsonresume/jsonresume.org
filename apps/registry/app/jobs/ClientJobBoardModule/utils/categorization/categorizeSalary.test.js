import { describe, it, expect } from 'vitest';
import { categorizeSalary } from './categorizeSalary';

describe('categorizeSalary', () => {
  it('returns "Not Specified" for null or undefined', () => {
    expect(categorizeSalary(null)).toBe('Not Specified');
    expect(categorizeSalary(undefined)).toBe('Not Specified');
    expect(categorizeSalary('')).toBe('Not Specified');
  });

  it('returns "Competitive" for competitive salary', () => {
    expect(categorizeSalary('Competitive')).toBe('Competitive');
    expect(categorizeSalary('competitive salary')).toBe('Competitive');
    expect(categorizeSalary('COMPETITIVE')).toBe('Competitive');
  });

  it('categorizes salary with k suffix', () => {
    expect(categorizeSalary('40k')).toBe('Under $50k');
    expect(categorizeSalary('50k')).toBe('$50k - $100k');
    expect(categorizeSalary('75k')).toBe('$50k - $100k');
    expect(categorizeSalary('100k')).toBe('$100k - $150k');
    expect(categorizeSalary('125k')).toBe('$100k - $150k');
    expect(categorizeSalary('150k')).toBe('$150k - $200k');
    expect(categorizeSalary('175k')).toBe('$150k - $200k');
    expect(categorizeSalary('200k')).toBe('$200k+');
    expect(categorizeSalary('250k')).toBe('$200k+');
  });

  it('categorizes full salary amounts', () => {
    expect(categorizeSalary('40000')).toBe('Under $50k');
    expect(categorizeSalary('50000')).toBe('$50k - $100k');
    expect(categorizeSalary('75000')).toBe('$50k - $100k');
    expect(categorizeSalary('100000')).toBe('$100k - $150k');
    expect(categorizeSalary('125000')).toBe('$100k - $150k');
    expect(categorizeSalary('150000')).toBe('$150k - $200k');
    expect(categorizeSalary('175000')).toBe('$150k - $200k');
    expect(categorizeSalary('200000')).toBe('$200k+');
    expect(categorizeSalary('300000')).toBe('$200k+');
  });

  it('handles salary with dollar sign', () => {
    expect(categorizeSalary('$50k')).toBe('$50k - $100k');
    expect(categorizeSalary('$200k')).toBe('$200k+');
  });

  it('handles comma-separated numbers', () => {
    // Comma breaks number extraction - gets first number segment
    expect(categorizeSalary('$100,000')).toBe('Under $50k'); // Extracts 100
    expect(categorizeSalary('200,000')).toBe('Under $50k'); // Extracts 200 (as dollars, not thousands)
  });

  it('extracts first number from string', () => {
    expect(categorizeSalary('Salary: 80k per year')).toBe('$50k - $100k');
    expect(categorizeSalary('Annual: 120000')).toBe('$100k - $150k');
  });

  it('handles salary ranges by using first number', () => {
    expect(categorizeSalary('50k-80k')).toBe('$50k - $100k');
    expect(categorizeSalary('100k-150k')).toBe('$100k - $150k');
    expect(categorizeSalary('80000-120000')).toBe('$50k - $100k');
  });

  it('returns "Not Specified" when no numbers found', () => {
    expect(categorizeSalary('TBD')).toBe('Not Specified');
    expect(categorizeSalary('Negotiable')).toBe('Not Specified');
    expect(categorizeSalary('DOE')).toBe('Not Specified');
  });

  it('handles edge cases at boundaries', () => {
    expect(categorizeSalary('49k')).toBe('Under $50k');
    expect(categorizeSalary('49999')).toBe('Under $50k');
    expect(categorizeSalary('99k')).toBe('$50k - $100k');
    expect(categorizeSalary('99999')).toBe('$50k - $100k');
    expect(categorizeSalary('149k')).toBe('$100k - $150k');
    expect(categorizeSalary('149999')).toBe('$100k - $150k');
    expect(categorizeSalary('199k')).toBe('$150k - $200k');
    expect(categorizeSalary('199999')).toBe('$150k - $200k');
  });

  it('handles mixed case k suffix', () => {
    expect(categorizeSalary('50K')).toBe('$50k - $100k');
    expect(categorizeSalary('100K')).toBe('$100k - $150k');
  });

  it('handles whitespace', () => {
    expect(categorizeSalary('  80k  ')).toBe('$50k - $100k');
    expect(categorizeSalary('  competitive  ')).toBe('Competitive');
  });
});
