/**
 * Comprehensive tests for salary normalization
 * Covers all possible human-typed salary formats
 */

/* eslint-env jest */
/* global describe, test, expect */

const { normalizeSalary } = require('./index');

// Mock exchange rates for testing (USD base)
const mockRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.53,
  CAD: 1.36,
  JPY: 149,
  INR: 83,
  CHF: 0.88,
  SEK: 10.5,
  NZD: 1.64,
  SGD: 1.34,
  HKD: 7.82,
  CNY: 7.24,
  KRW: 1320,
  MXN: 17.2,
  BRL: 4.97,
  PLN: 4.02,
  RUB: 92,
  PHP: 56,
  THB: 35,
  ZAR: 18.5,
  AED: 3.67,
  ILS: 3.7,
};

describe('Salary Normalizer', () => {
  // ===========================================
  // PLAIN NUMBERS
  // ===========================================
  describe('Plain numbers', () => {
    test.each([
      ['100000', 100000],
      ['150000', 150000],
      ['75000', 75000],
      ['200000', 200000],
      ['50000', 50000],
    ])('parses "%s" as $%d USD', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // K NOTATION (120k, 150K, etc)
  // ===========================================
  describe('K notation', () => {
    test.each([
      ['100k', 100000],
      ['120K', 120000],
      ['75k', 75000],
      ['200K', 200000],
      ['50k', 50000],
      ['150k', 150000],
      ['85K', 85000],
    ])('parses "%s" as $%d USD', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // USD FORMATS
  // ===========================================
  describe('USD formats', () => {
    test.each([
      ['$100,000', 100000],
      ['$150,000', 150000],
      ['$75000', 75000],
      ['$120k', 120000],
      ['$85K', 85000],
      ['USD 100000', 100000],
      ['USD100,000', 100000],
      ['100,000 USD', 100000],
      ['US$150,000', 150000],
      ['$100K', 100000],
      ['$100k/year', 100000],
      ['$100,000/yr', 100000],
      ['$100000 annually', 100000],
      ['$100,000 per year', 100000],
      ['$100,000 p.a.', 100000],
      ['$100,000 PA', 100000],
    ])('parses "%s" as $%d USD', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // RANGES (most common format)
  // ===========================================
  describe('Salary ranges', () => {
    test.each([
      ['$100,000 - $150,000', 125000, 100000, 150000],
      ['$100k - $150k', 125000, 100000, 150000],
      ['$100K-$150K', 125000, 100000, 150000],
      ['100k-150k', 125000, 100000, 150000],
      ['100,000-150,000', 125000, 100000, 150000],
      ['$80,000 to $120,000', 100000, 80000, 120000],
      ['$80k to $120k', 100000, 80000, 120000],
      ['80-120k', 100000, 80000, 120000],
      ['$100,000 — $150,000', 125000, 100000, 150000], // em dash
      ['$100,000 – $150,000', 125000, 100000, 150000], // en dash
      ['100000 - 150000', 125000, 100000, 150000],
      ['from $100k to $150k', 125000, 100000, 150000],
      ['between $100,000 and $150,000', 125000, 100000, 150000],
      ['$100-150k', 125000, 100000, 150000],
      ['$100-$150k', 125000, 100000, 150000],
      ['100-150K', 125000, 100000, 150000],
    ])(
      'parses "%s" as avg $%d (min: $%d, max: $%d)',
      (input, expectedAvg, expectedMin, expectedMax) => {
        const result = normalizeSalary(input, mockRates);
        expect(result.salaryUsd).toBe(expectedAvg);
        expect(result.salaryMin).toBe(expectedMin);
        expect(result.salaryMax).toBe(expectedMax);
      }
    );
  });

  // ===========================================
  // EUROPEAN FORMATS (EUR, GBP, etc)
  // ===========================================
  describe('European currencies', () => {
    test.each([
      ['€100,000', Math.round(100000 / 0.92 / 1000) * 1000],
      ['€100.000', Math.round(100000 / 0.92 / 1000) * 1000], // European decimal
      ['100,000€', Math.round(100000 / 0.92 / 1000) * 1000],
      ['100000 EUR', Math.round(100000 / 0.92 / 1000) * 1000],
      ['EUR 100,000', Math.round(100000 / 0.92 / 1000) * 1000],
      ['£80,000', Math.round(80000 / 0.79 / 1000) * 1000],
      ['£80k', Math.round(80000 / 0.79 / 1000) * 1000],
      ['80,000 GBP', Math.round(80000 / 0.79 / 1000) * 1000],
      ['GBP 80,000', Math.round(80000 / 0.79 / 1000) * 1000],
      ['CHF 120,000', Math.round(120000 / 0.88 / 1000) * 1000],
      ['120,000 CHF', Math.round(120000 / 0.88 / 1000) * 1000],
      ['SEK 1,000,000', Math.round(1000000 / 10.5 / 1000) * 1000],
    ])('parses "%s" and converts to USD', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // ASIA-PACIFIC CURRENCIES
  // ===========================================
  describe('Asia-Pacific currencies', () => {
    test.each([
      ['¥15,000,000', Math.round(15000000 / 149 / 1000) * 1000], // JPY
      ['JPY 15,000,000', Math.round(15000000 / 149 / 1000) * 1000],
      ['₹2,500,000', Math.round(2500000 / 83 / 1000) * 1000], // INR
      ['INR 25,00,000', Math.round(2500000 / 83 / 1000) * 1000], // Indian lakhs format
      ['25 LPA', Math.round(2500000 / 83 / 1000) * 1000], // Lakhs per annum
      ['25LPA', Math.round(2500000 / 83 / 1000) * 1000],
      ['A$150,000', Math.round(150000 / 1.53 / 1000) * 1000], // AUD
      ['AUD 150,000', Math.round(150000 / 1.53 / 1000) * 1000],
      ['AU$150k', Math.round(150000 / 1.53 / 1000) * 1000],
      ['NZ$120,000', Math.round(120000 / 1.64 / 1000) * 1000], // NZD
      ['SGD 150,000', Math.round(150000 / 1.34 / 1000) * 1000], // SGD
      ['S$150,000', Math.round(150000 / 1.34 / 1000) * 1000],
      ['HK$1,200,000', Math.round(1200000 / 7.82 / 1000) * 1000], // HKD
      ['HKD 1,200,000', Math.round(1200000 / 7.82 / 1000) * 1000],
      ['CNY 800,000', Math.round(800000 / 7.24 / 1000) * 1000], // CNY
      ['¥800,000 CNY', Math.round(800000 / 7.24 / 1000) * 1000],
      ['₩150,000,000', Math.round(150000000 / 1320 / 1000) * 1000], // KRW
      ['KRW 150,000,000', Math.round(150000000 / 1320 / 1000) * 1000],
    ])('parses "%s" and converts to USD', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // OTHER WORLD CURRENCIES
  // ===========================================
  describe('Other world currencies', () => {
    test.each([
      ['C$130,000', Math.round(130000 / 1.36 / 1000) * 1000], // CAD
      ['CAD 130,000', Math.round(130000 / 1.36 / 1000) * 1000],
      ['CA$130k', Math.round(130000 / 1.36 / 1000) * 1000],
      ['MXN 2,000,000', Math.round(2000000 / 17.2 / 1000) * 1000], // MXN
      ['R$500,000', Math.round(500000 / 4.97 / 1000) * 1000], // BRL
      ['BRL 500,000', Math.round(500000 / 4.97 / 1000) * 1000],
      ['PLN 500,000', Math.round(500000 / 4.02 / 1000) * 1000], // PLN
      ['zł500,000', Math.round(500000 / 4.02 / 1000) * 1000],
      ['RUB 5,000,000', Math.round(5000000 / 92 / 1000) * 1000], // RUB
      ['₽5,000,000', Math.round(5000000 / 92 / 1000) * 1000],
      ['PHP 2,500,000', Math.round(2500000 / 56 / 1000) * 1000], // PHP
      ['₱2,500,000', Math.round(2500000 / 56 / 1000) * 1000],
      ['THB 3,000,000', Math.round(3000000 / 35 / 1000) * 1000], // THB
      ['฿3,000,000', Math.round(3000000 / 35 / 1000) * 1000],
      ['ZAR 2,000,000', Math.round(2000000 / 18.5 / 1000) * 1000], // ZAR
      ['R2,000,000', Math.round(2000000 / 18.5 / 1000) * 1000], // South African Rand
      ['AED 500,000', Math.round(500000 / 3.67 / 1000) * 1000], // AED
      ['ILS 500,000', Math.round(500000 / 3.7 / 1000) * 1000], // ILS
      ['₪500,000', Math.round(500000 / 3.7 / 1000) * 1000],
    ])('parses "%s" and converts to USD', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // HOURLY RATES
  // ===========================================
  describe('Hourly rates', () => {
    test.each([
      ['$50/hr', 104000], // 50 * 40 * 52
      ['$50/hour', 104000],
      ['$50 per hour', 104000],
      ['$50 hourly', 104000],
      ['$75/hr', 156000],
      ['50/hr', 104000],
      ['$100/hr', 208000],
      ['€50/hr', Math.round((50 * 40 * 52) / 0.92 / 1000) * 1000],
      ['£40/hour', Math.round((40 * 40 * 52) / 0.79 / 1000) * 1000],
    ])('parses hourly "%s" as $%d annual', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });

    test.each([
      ['$50-$75/hr', 130000, 104000, 156000],
      ['$50 - $100 per hour', 156000, 104000, 208000],
    ])(
      'parses hourly range "%s" as avg $%d (min: $%d, max: $%d)',
      (input, expected, min, max) => {
        const result = normalizeSalary(input, mockRates);
        expect(result.salaryUsd).toBe(expected);
        expect(result.salaryMin).toBe(min);
        expect(result.salaryMax).toBe(max);
      }
    );
  });

  // ===========================================
  // MONTHLY RATES
  // ===========================================
  describe('Monthly rates', () => {
    test.each([
      ['$8,000/month', 96000], // 8000 * 12
      ['$8,000/mo', 96000],
      ['$8000 per month', 96000],
      ['$10,000 monthly', 120000],
      ['8000/month', 96000],
      ['€8,000/month', Math.round((8000 * 12) / 0.92 / 1000) * 1000],
      ['£6,000/month', Math.round((6000 * 12) / 0.79 / 1000) * 1000],
    ])('parses monthly "%s" as $%d annual', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });

    test.each([['$8,000 - $12,000/month', 120000, 96000, 144000]])(
      'parses monthly range "%s" as avg $%d (min: $%d, max: $%d)',
      (input, expected, min, max) => {
        const result = normalizeSalary(input, mockRates);
        expect(result.salaryUsd).toBe(expected);
        expect(result.salaryMin).toBe(min);
        expect(result.salaryMax).toBe(max);
      }
    );
  });

  // ===========================================
  // WEEKLY/DAILY RATES
  // ===========================================
  describe('Weekly and daily rates', () => {
    test.each([
      ['$2,000/week', 104000], // 2000 * 52
      ['$2000 per week', 104000],
      ['$2000 weekly', 104000],
      ['$400/day', 104000], // 400 * 5 * 52
      ['$400 per day', 104000],
      ['$500 daily', 130000],
      ['£1,500/week', Math.round((1500 * 52) / 0.79 / 1000) * 1000],
    ])('parses "%s" and annualizes', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // MESSY/INFORMAL FORMATS
  // ===========================================
  describe('Messy/informal formats', () => {
    test.each([
      ['around 100k', 100000],
      ['about $120,000', 120000],
      ['~$150k', 150000],
      ['approx 100000', 100000],
      ['approximately $100k', 100000],
      ['up to $150,000', 150000],
      ['up to 150k', 150000],
      ['starting at $100k', 100000],
      ['from $100k', 100000],
      ['$100k+', 100000],
      ['$100,000+', 100000],
      ['100k plus', 100000],
      ['minimum $80k', 80000],
      ['min 80k', 80000],
      ['max $150k', 150000],
      ['base salary $100k', 100000],
      ['base: $100,000', 100000],
      ['OTE $150k', 150000], // On Target Earnings
      ['$100k OTE', 100000],
      ['total comp $200k', 200000],
      ['TC: $200,000', 200000],
    ])('parses informal "%s"', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // NUMBERS WITH COMMAS/PERIODS (locale variations)
  // ===========================================
  describe('Number format variations', () => {
    test.each([
      ['100,000', 100000], // US format
      ['100.000', 100000], // European format (period as thousands separator)
      ['100 000', 100000], // Space as thousands separator
      ["100'000", 100000], // Swiss format
      ['1,00,000', 100000], // Indian format (1 lakh)
      ['10,00,000', 1000000], // Indian format (10 lakhs)
      ['€100.000,00', 100000], // European with cents
      ['$100,000.00', 100000], // US with cents
    ])('parses "%s" correctly', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      // For EUR, convert; for USD, expect directly
      if (input.includes('€')) {
        expect(result.salaryUsd).toBe(
          Math.round(expected / 0.92 / 1000) * 1000
        );
      } else {
        expect(result.salaryUsd).toBe(expected);
      }
    });
  });

  // ===========================================
  // EQUITY/STOCK MENTIONS (should extract cash only)
  // ===========================================
  describe('Salary with equity mentions', () => {
    test.each([
      ['$150k base + equity', 150000],
      ['$150,000 + stock options', 150000],
      ['$120k salary + RSUs', 120000],
      ['Base: $100k, Equity: $50k', 100000],
      ['$150k cash + $50k equity', 150000],
      ['$100k-$150k + equity', 125000],
    ])('extracts base salary from "%s"', (input, expected) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBe(expected);
    });
  });

  // ===========================================
  // NON-NUMERIC / INVALID (should return null)
  // ===========================================
  describe('Non-numeric/invalid values', () => {
    test.each([
      ['Competitive'],
      ['competitive salary'],
      ['Negotiable'],
      ['DOE'], // Depends on experience
      ['Market rate'],
      ['TBD'],
      ['N/A'],
      ['Not specified'],
      ['Depends on experience'],
      ['Based on experience'],
      ['Commensurate with experience'],
      [''],
      [null],
      [undefined],
    ])('returns null for "%s"', (input) => {
      const result = normalizeSalary(input, mockRates);
      expect(result.salaryUsd).toBeNull();
    });
  });

  // ===========================================
  // STRUCTURED SALARY OBJECTS
  // ===========================================
  describe('Structured salary objects', () => {
    test('handles {min, max} object', () => {
      const result = normalizeSalary({ min: 100000, max: 150000 }, mockRates);
      expect(result.salaryUsd).toBe(125000);
      expect(result.salaryMin).toBe(100000);
      expect(result.salaryMax).toBe(150000);
    });

    test('handles {min, max, currency} object', () => {
      const result = normalizeSalary(
        { min: 80000, max: 100000, currency: 'GBP' },
        mockRates
      );
      expect(result.salaryUsd).toBe(Math.round(90000 / 0.79 / 1000) * 1000);
    });

    test('handles {amount} object', () => {
      const result = normalizeSalary({ amount: 120000 }, mockRates);
      expect(result.salaryUsd).toBe(120000);
    });

    test('handles {value, currency} object', () => {
      const result = normalizeSalary(
        { value: 100000, currency: 'EUR' },
        mockRates
      );
      expect(result.salaryUsd).toBe(Math.round(100000 / 0.92 / 1000) * 1000);
    });

    test('handles hourly object', () => {
      const result = normalizeSalary({ amount: 50, period: 'hour' }, mockRates);
      expect(result.salaryUsd).toBe(104000);
    });

    test('handles monthly object', () => {
      const result = normalizeSalary(
        { amount: 10000, period: 'month' },
        mockRates
      );
      expect(result.salaryUsd).toBe(120000);
    });
  });

  // ===========================================
  // EDGE CASES
  // ===========================================
  describe('Edge cases', () => {
    test('handles very large salaries', () => {
      const result = normalizeSalary('$1,000,000', mockRates);
      expect(result.salaryUsd).toBe(1000000);
    });

    test('handles very small salaries (probably hourly)', () => {
      const result = normalizeSalary('50', mockRates);
      // Should detect as hourly and annualize
      expect(result.salaryUsd).toBe(104000);
    });

    test('handles salary with benefits mention', () => {
      const result = normalizeSalary('$100k + benefits', mockRates);
      expect(result.salaryUsd).toBe(100000);
    });

    test('handles salary with bonus mention', () => {
      const result = normalizeSalary('$100k + 20% bonus', mockRates);
      expect(result.salaryUsd).toBe(100000);
    });

    test('rounds to nearest thousand', () => {
      const result = normalizeSalary('$123,456', mockRates);
      expect(result.salaryUsd).toBe(123000);
    });

    test('handles mixed currency indicators', () => {
      // When there's conflicting info, should use most explicit
      const result = normalizeSalary('$100,000 AUD', mockRates);
      expect(result.salaryCurrency).toBe('AUD');
    });
  });
});
