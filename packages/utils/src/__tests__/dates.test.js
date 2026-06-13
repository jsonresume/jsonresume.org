import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatDateRange,
  getRelativeTime,
  getDuration,
  normalizeDates,
} from '../dates.js';

const FIXED_NOW = new Date('2026-01-01T00:00:00Z');

describe('formatDateRange', () => {
  it('returns empty string when startDate is missing', () => {
    expect(formatDateRange({ startDate: '' })).toBe('');
    expect(formatDateRange({ startDate: null })).toBe('');
    expect(formatDateRange({ startDate: undefined })).toBe('');
  });

  it('BUGFIX: shows "Present" when endDate is undefined (missing)', () => {
    // Previously a missing endDate rendered a single date with no separator.
    // It now behaves like a null endDate: start + separator + present label.
    const out = formatDateRange({ startDate: '2020-01-15' });
    expect(out).toContain('2020');
    expect(out).toContain('Present');
    expect(out).toContain(' - ');
  });

  it('shows "Present" for an ongoing role when endDate is null', () => {
    const out = formatDateRange({ startDate: '2020-01-15', endDate: null });
    expect(out).toContain('2020');
    expect(out).toContain('Present');
    expect(out).toContain(' - ');
  });

  it('renders the same string for undefined and null endDate', () => {
    expect(formatDateRange({ startDate: '2020-01-15' })).toBe(
      formatDateRange({ startDate: '2020-01-15', endDate: null })
    );
  });

  it('formats a closed range with start and end', () => {
    const out = formatDateRange({
      startDate: '2018-06-01',
      endDate: '2020-03-01',
    });
    expect(out).toContain('2018');
    expect(out).toContain('2020');
    expect(out).toContain(' - ');
    expect(out).not.toContain('Present');
  });

  it('supports long and numeric month formats', () => {
    expect(
      formatDateRange({ startDate: '2020-01-15', format: 'long' })
    ).toContain('January');
    expect(
      formatDateRange({ startDate: '2020-01-15', format: 'numeric' })
    ).toMatch(/01\/2020|01\s*2020/);
  });

  it('localizes the present label (fr-FR => Présent, de => Heute)', () => {
    expect(
      formatDateRange({
        startDate: '2020-01-15',
        endDate: null,
        locale: 'fr-FR',
      })
    ).toContain('Présent');
    expect(
      formatDateRange({ startDate: '2020-01-15', endDate: null, locale: 'de' })
    ).toContain('Heute');
  });

  it('honours an explicit presentLabel override', () => {
    expect(
      formatDateRange({
        startDate: '2020-01-15',
        endDate: null,
        presentLabel: 'Now',
      })
    ).toContain('Now');
  });

  it('returns an invalid start date string as-is, still tagged Present', () => {
    expect(formatDateRange({ startDate: 'not-a-date' })).toBe(
      'not-a-date - Present'
    );
  });

  it('accepts Date objects as well as strings', () => {
    expect(
      formatDateRange({ startDate: new Date('2021-05-01'), endDate: null })
    ).toContain('2021');
  });
});

describe('getRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports whole years ago', () => {
    expect(getRelativeTime('2020-01-01')).toBe('6 years ago');
  });

  it('drops the suffix when ago=false', () => {
    expect(getRelativeTime('2025-12-01', false)).toBe('1 month');
  });

  it('returns "just now" for the present moment', () => {
    expect(getRelativeTime(FIXED_NOW)).toBe('just now');
  });
});

describe('getDuration', () => {
  it('reports years and months between two dates', () => {
    expect(getDuration('2020-01-01', '2022-07-05')).toBe('2 years, 6 months');
  });

  it('reports whole years when no extra months', () => {
    expect(getDuration('2020-01-01', '2023-01-02')).toBe('3 years');
  });

  it('reports months when under a year', () => {
    expect(getDuration('2023-01-01', '2023-04-05')).toBe('3 months');
  });

  it('reports days when under a month', () => {
    expect(getDuration('2023-01-01', '2023-01-10')).toBe('9 days');
  });
});

describe('normalizeDates', () => {
  it('stringifies Date-valued date fields across sections', () => {
    const resume = {
      basics: { name: 'A' },
      work: [{ name: 'Co', startDate: new Date('2020-01-15T00:00:00Z') }],
    };
    const out = normalizeDates(resume);
    expect(out.work[0].startDate).toBe('2020-01-15');
  });

  it('leaves string date fields untouched', () => {
    const resume = { work: [{ startDate: '2020-01' }] };
    expect(normalizeDates(resume).work[0].startDate).toBe('2020-01');
  });

  it('does not coerce non-Date object/array date fields', () => {
    const resume = { work: [{ startDate: { y: 2020 } }] };
    expect(normalizeDates(resume).work[0].startDate).toEqual({ y: 2020 });
  });

  it('does not mutate the input resume', () => {
    const start = new Date('2020-01-15T00:00:00Z');
    const resume = { work: [{ startDate: start }] };
    normalizeDates(resume);
    expect(resume.work[0].startDate).toBe(start);
  });
});
