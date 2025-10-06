import { describe, it, expect } from 'vitest';
import {
  totalExperience,
  averageJobDuration,
  careerProgression,
} from './experienceCalculations';

describe('totalExperience', () => {
  it('calculates total experience for single job', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
    };
    const result = totalExperience(resume);
    expect(result.years).toBe(1);
  });

  it('handles ongoing jobs without endDate', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          // No endDate means current job
        },
      ],
    };
    const result = totalExperience(resume);
    expect(result.years).toBeGreaterThanOrEqual(4); // At least 4 years from 2020
  });

  it('merges overlapping work periods', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2020-12-31',
        },
        {
          position: 'Consultant',
          startDate: '2020-06-01',
          endDate: '2021-06-30',
        },
      ],
    };
    const result = totalExperience(resume);
    // Should be ~1.5 years, not 2.5 years (overlapping 6 months)
    expect(result.years).toBe(1);
    expect(result.months).toBeGreaterThanOrEqual(5);
  });

  it('handles non-overlapping jobs correctly', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2020-06-30',
        },
        {
          position: 'Manager',
          startDate: '2021-01-01',
          endDate: '2021-12-31',
        },
      ],
    };
    const result = totalExperience(resume);
    // 6 months (Jan-Jun 2020) + 12 months (2021) = 18 months = 1 year 6 months
    expect(result.years).toBe(1);
    expect(result.months).toBe(6);
  });

  it('returns zero experience for empty work history', () => {
    const resume = { work: [] };
    const result = totalExperience(resume);
    expect(result).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('handles missing work property', () => {
    const resume = {};
    const result = totalExperience(resume);
    expect(result).toEqual({ years: 0, months: 0, days: 0 });
  });
});

describe('averageJobDuration', () => {
  it('calculates average duration for single job', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
    };
    const result = averageJobDuration(resume);
    expect(result.years).toBe(1);
  });

  it('calculates average across multiple jobs', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
        {
          position: 'Manager',
          startDate: '2021-01-01',
          endDate: '2024-01-01',
        },
      ],
    };
    const result = averageJobDuration(resume);
    // Average of 1 year and 3 years = 2 years
    expect(result.years).toBe(2);
  });

  it('includes ongoing jobs in average', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
        {
          position: 'Manager',
          startDate: '2023-01-01',
          // No endDate
        },
      ],
    };
    const result = averageJobDuration(resume);
    expect(result.years).toBeGreaterThanOrEqual(1);
  });

  it('returns zero for empty work history', () => {
    const resume = { work: [] };
    const result = averageJobDuration(resume);
    expect(result).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('handles missing work property', () => {
    const resume = {};
    const result = averageJobDuration(resume);
    expect(result).toEqual({ years: 0, months: 0, days: 0 });
  });

  it('calculates fractional years as months', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2020-07-01',
        },
        {
          position: 'Manager',
          startDate: '2021-01-01',
          endDate: '2021-07-01',
        },
      ],
    };
    const result = averageJobDuration(resume);
    expect(result.years).toBe(0);
    expect(result.months).toBeGreaterThanOrEqual(5);
  });
});

describe('careerProgression', () => {
  it('maps single position to duration', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
    };
    const result = careerProgression(resume);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Developer');
    expect(result[0].duration.years).toBe(1);
  });

  it('sums durations for same position across multiple jobs', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
        {
          position: 'Developer',
          startDate: '2022-01-01',
          endDate: '2024-01-01',
        },
      ],
    };
    const result = careerProgression(resume);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Developer');
    expect(result[0].duration.years).toBe(3);
  });

  it('tracks multiple different positions', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
        {
          position: 'Manager',
          startDate: '2021-01-01',
          endDate: '2023-01-01',
        },
      ],
    };
    const result = careerProgression(resume);
    expect(result).toHaveLength(2);
    const developerRole = result.find((r) => r.title === 'Developer');
    const managerRole = result.find((r) => r.title === 'Manager');
    expect(developerRole.duration.years).toBe(1);
    expect(managerRole.duration.years).toBe(2);
  });

  it('normalizes months to years', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2020-07-01',
        },
        {
          position: 'Developer',
          startDate: '2021-01-01',
          endDate: '2021-09-01',
        },
      ],
    };
    const result = careerProgression(resume);
    expect(result).toHaveLength(1);
    // 6 months + 8 months = 14 months = 1 year 2 months
    expect(result[0].duration.years).toBe(1);
    expect(result[0].duration.months).toBeLessThan(12);
  });

  it('handles ongoing positions', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          // No endDate
        },
      ],
    };
    const result = careerProgression(resume);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Developer');
    expect(result[0].duration.years).toBeGreaterThanOrEqual(4);
  });

  it('returns empty array for empty work history', () => {
    const resume = { work: [] };
    const result = careerProgression(resume);
    expect(result).toEqual([]);
  });

  it('handles missing work property', () => {
    const resume = {};
    const result = careerProgression(resume);
    expect(result).toEqual([]);
  });
});
