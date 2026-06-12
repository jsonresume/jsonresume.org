import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  calculateTotalExperience,
  calculateCurrentRoleExperience,
  countCareerPositions,
  getCareerProgressionRate,
  countTotalHighlights,
} from '../experience.js';
import { work, FIXED_NOW } from './fixtures.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('calculateTotalExperience', () => {
  it('sums tenure across all jobs, rounded to nearest year', () => {
    // ~5.0 (ongoing) + ~3.0 + ~2.0 years
    expect(calculateTotalExperience(work)).toBe(10);
  });

  it('uses the current date for ongoing roles (no endDate)', () => {
    expect(calculateTotalExperience([{ startDate: '2021-01-01' }])).toBe(5);
  });

  it('skips entries without a startDate', () => {
    expect(
      calculateTotalExperience([
        { startDate: '2018-01-01', endDate: '2021-01-01' },
        { endDate: '2020-01-01' },
        {},
      ])
    ).toBe(3);
  });

  it('double-counts overlapping periods (naive per-job sum)', () => {
    expect(
      calculateTotalExperience([
        { startDate: '2018-01-01', endDate: '2020-01-01' },
        { startDate: '2019-01-01', endDate: '2021-01-01' },
      ])
    ).toBe(4);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(calculateTotalExperience([])).toBe(0);
    expect(calculateTotalExperience()).toBe(0);
    expect(calculateTotalExperience(null)).toBe(0);
    expect(calculateTotalExperience('not-an-array')).toBe(0);
  });
});

describe('calculateCurrentRoleExperience', () => {
  it('measures the first role without an endDate, rounded to 1 decimal', () => {
    expect(calculateCurrentRoleExperience(work)).toBe(5);
  });

  it('finds the current role even when it is not first in the array', () => {
    expect(
      calculateCurrentRoleExperience([
        { startDate: '2018-01-01', endDate: '2021-01-01' },
        { startDate: '2023-07-01' },
      ])
    ).toBe(2.5);
  });

  it('falls back to the first entry when every role has ended', () => {
    expect(
      calculateCurrentRoleExperience([
        { startDate: '2018-01-01', endDate: '2021-01-01' },
        { startDate: '2016-01-01', endDate: '2018-01-01' },
      ])
    ).toBe(3);
  });

  it('returns 0 when the selected role has no startDate', () => {
    expect(calculateCurrentRoleExperience([{ position: 'Engineer' }])).toBe(0);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(calculateCurrentRoleExperience([])).toBe(0);
    expect(calculateCurrentRoleExperience()).toBe(0);
    expect(calculateCurrentRoleExperience(null)).toBe(0);
  });
});

describe('countCareerPositions', () => {
  it('counts unique position titles', () => {
    expect(countCareerPositions(work)).toBe(3);
  });

  it('deduplicates repeated titles and ignores missing ones', () => {
    expect(
      countCareerPositions([
        { position: 'Engineer' },
        { position: 'Engineer' },
        { name: 'No Position Inc' },
        { position: 'Manager' },
      ])
    ).toBe(2);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countCareerPositions([])).toBe(0);
    expect(countCareerPositions()).toBe(0);
    expect(countCareerPositions(null)).toBe(0);
  });
});

describe('getCareerProgressionRate', () => {
  it('returns average years per position, rounded to 1 decimal', () => {
    // 10 total years / 3 unique positions
    expect(getCareerProgressionRate(work)).toBe(3.3);
  });

  it('returns 0 when there is no work history', () => {
    expect(getCareerProgressionRate([])).toBe(0);
    expect(getCareerProgressionRate()).toBe(0);
  });

  it('returns 0 when total experience rounds down to 0 years', () => {
    expect(
      getCareerProgressionRate([
        { position: 'Intern', startDate: '2025-11-01', endDate: '2025-12-01' },
      ])
    ).toBe(0);
  });
});

describe('countTotalHighlights', () => {
  it('sums highlights across all jobs', () => {
    expect(countTotalHighlights(work)).toBe(5);
  });

  it('treats jobs without highlights as contributing 0', () => {
    expect(
      countTotalHighlights([{ highlights: ['a', 'b'] }, { name: 'None Inc' }])
    ).toBe(2);
  });

  it('returns 0 for empty, missing, or non-array input', () => {
    expect(countTotalHighlights([])).toBe(0);
    expect(countTotalHighlights()).toBe(0);
    expect(countTotalHighlights(null)).toBe(0);
  });
});
