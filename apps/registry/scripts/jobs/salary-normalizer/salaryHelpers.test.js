/**
 * Unit tests for the individual salary-normalizer helpers that the existing
 * salaryNormalizer.test.js only exercises indirectly through normalizeSalary:
 * detectCurrency, detectPeriod, extractNumbers, annualize, roundToThousand.
 * These are characterization tests of current behavior.
 */
import { describe, it, expect } from 'vitest';

const {
  detectCurrency,
  detectPeriod,
  extractNumbers,
  annualize,
  roundToThousand,
} = require('./index');

describe('detectCurrency', () => {
  it('reads explicit ISO codes (case-insensitive)', () => {
    expect(detectCurrency('100000 EUR')).toBe('EUR');
    expect(detectCurrency('gbp 80,000')).toBe('GBP');
    expect(detectCurrency('100k USD')).toBe('USD');
  });

  it('disambiguates prefixed dollar symbols longest-first', () => {
    expect(detectCurrency('US$150,000')).toBe('USD');
    expect(detectCurrency('CA$130k')).toBe('CAD');
    expect(detectCurrency('C$130k')).toBe('CAD');
    expect(detectCurrency('AU$150k')).toBe('AUD');
    expect(detectCurrency('A$150,000')).toBe('AUD');
    expect(detectCurrency('NZ$120,000')).toBe('NZD');
    expect(detectCurrency('HK$1,200,000')).toBe('HKD');
    expect(detectCurrency('S$150,000')).toBe('SGD');
  });

  it('reads single-character currency symbols', () => {
    expect(detectCurrency('€100,000')).toBe('EUR');
    expect(detectCurrency('£80,000')).toBe('GBP');
    expect(detectCurrency('₹2,500,000')).toBe('INR');
    expect(detectCurrency('₩150,000,000')).toBe('KRW');
    expect(detectCurrency('₽5,000,000')).toBe('RUB');
    expect(detectCurrency('₱2,500,000')).toBe('PHP');
    expect(detectCurrency('฿3,000,000')).toBe('THB');
    expect(detectCurrency('₪500,000')).toBe('ILS');
  });

  it('treats ¥ as JPY by default but CNY when hinted', () => {
    expect(detectCurrency('¥15,000,000')).toBe('JPY');
    expect(detectCurrency('¥800,000 CNY')).toBe('CNY');
    expect(detectCurrency('¥800,000 rmb')).toBe('CNY');
  });

  it('recognizes South African Rand via R prefix', () => {
    expect(detectCurrency('R2,000,000')).toBe('ZAR');
  });

  it('recognizes Indian LPA notation as INR', () => {
    expect(detectCurrency('25 LPA')).toBe('INR');
  });

  it('defaults to USD when only a $ or no symbol is present', () => {
    expect(detectCurrency('$100,000')).toBe('USD');
    expect(detectCurrency('100000')).toBe('USD');
  });
});

describe('detectPeriod', () => {
  it('detects hourly variants', () => {
    expect(detectPeriod('$50/hr')).toBe('hour');
    expect(detectPeriod('$50 per hour')).toBe('hour');
    expect(detectPeriod('$50 hourly')).toBe('hour');
  });

  it('detects daily / weekly / monthly variants', () => {
    expect(detectPeriod('$400/day')).toBe('day');
    expect(detectPeriod('$2000 per week')).toBe('week');
    expect(detectPeriod('$8000/mo')).toBe('month');
    expect(detectPeriod('$8000 monthly')).toBe('month');
  });

  it('detects yearly variants', () => {
    expect(detectPeriod('$100k/yr')).toBe('year');
    expect(detectPeriod('$100k per year')).toBe('year');
    expect(detectPeriod('$100k annual')).toBe('year');
    expect(detectPeriod('$100k p.a.')).toBe('year');
  });

  it('defaults to year when no period word is present', () => {
    expect(detectPeriod('$100,000')).toBe('year');
  });
});

describe('extractNumbers', () => {
  it('returns a single number twice for a lone value', () => {
    expect(extractNumbers('100000')).toEqual({ min: 100000, max: 100000 });
  });

  it('expands K notation', () => {
    expect(extractNumbers('100k')).toEqual({ min: 100000, max: 100000 });
  });

  it('parses shorthand K ranges where K applies to both ends', () => {
    expect(extractNumbers('80-120k')).toEqual({ min: 80000, max: 120000 });
    expect(extractNumbers('$100-150k')).toEqual({ min: 100000, max: 150000 });
  });

  it('parses full numeric ranges with separators', () => {
    expect(extractNumbers('100,000 - 150,000')).toEqual({
      min: 100000,
      max: 150000,
    });
  });

  it('orders an out-of-order pair from the multi-number fallback path', () => {
    // No dash and no recognised separator words: both numbers fall through to
    // the generic number scan, which slices the first two and sorts them.
    expect(extractNumbers('150000 / 100000')).toEqual({
      min: 100000,
      max: 150000,
    });
  });

  // BUG (documented, not fixed in this PR): when a word separator such as
  // "and"/"between"/"to" sits between two plain numbers, the cleaner replaces
  // the word with a space, the greedy range regex captures BOTH numbers in its
  // first group, and parseNumber strips the whitespace — concatenating them
  // into one garbage value instead of producing a {min,max} range.
  it('CURRENT BEHAVIOR: word-separated plain numbers are concatenated', () => {
    expect(extractNumbers('150000 and 100000')).toEqual({
      min: 150000100000,
      max: 150000100000,
    });
  });

  it.skip('EXPECTED: word-separated plain numbers should parse as a range', () => {
    expect(extractNumbers('150000 and 100000')).toEqual({
      min: 100000,
      max: 150000,
    });
  });

  // BUG (documented, not fixed in this PR): the dash/"to" range path returns
  // numbers in their literal order and never sorts, so a descending range like
  // "150,000 - 100,000" yields min > max.
  it('CURRENT BEHAVIOR: descending dash range is not reordered (min > max)', () => {
    expect(extractNumbers('150,000 - 100,000')).toEqual({
      min: 150000,
      max: 100000,
    });
  });

  it.skip('EXPECTED: descending dash range should be reordered to min <= max', () => {
    expect(extractNumbers('150,000 - 100,000')).toEqual({
      min: 100000,
      max: 150000,
    });
  });

  it('handles Indian lakh notations', () => {
    expect(extractNumbers('25 LPA')).toEqual({ min: 2500000, max: 2500000 });
    expect(extractNumbers('19L-30L')).toEqual({ min: 1900000, max: 3000000 });
    expect(extractNumbers('35-80L')).toEqual({ min: 3500000, max: 8000000 });
  });

  it('returns nulls when there is nothing numeric to extract', () => {
    expect(extractNumbers('competitive')).toEqual({ min: null, max: null });
  });

  it('strips equity / stock additions and keeps the base', () => {
    expect(extractNumbers('$150k base + equity')).toEqual({
      min: 150000,
      max: 150000,
    });
  });
});

describe('annualize', () => {
  it('annualizes hourly at 40h * 52w', () => {
    expect(annualize(50, 'hour')).toBe(50 * 40 * 52);
  });

  it('annualizes daily at 5d * 52w', () => {
    expect(annualize(400, 'day')).toBe(400 * 5 * 52);
  });

  it('annualizes weekly at 52w', () => {
    expect(annualize(2000, 'week')).toBe(2000 * 52);
  });

  it('annualizes monthly at 12mo', () => {
    expect(annualize(8000, 'month')).toBe(96000);
  });

  it('leaves yearly and unknown periods unchanged', () => {
    expect(annualize(100000, 'year')).toBe(100000);
    expect(annualize(100000, 'decade')).toBe(100000);
  });
});

describe('roundToThousand', () => {
  it('rounds to the nearest thousand', () => {
    expect(roundToThousand(123456)).toBe(123000);
    expect(roundToThousand(123500)).toBe(124000);
    expect(roundToThousand(999)).toBe(1000);
    expect(roundToThousand(400)).toBe(0);
  });

  it('returns null for null / NaN', () => {
    expect(roundToThousand(null)).toBeNull();
    expect(roundToThousand(NaN)).toBeNull();
  });

  it('handles exact thousands', () => {
    expect(roundToThousand(100000)).toBe(100000);
  });
});
