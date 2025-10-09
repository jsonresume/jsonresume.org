import { describe, it, expect } from 'vitest';
import { getEducationLevel } from './educationCalculations';

describe('getEducationLevel', () => {
  it('returns highest education level', () => {
    const resume = {
      education: [
        { studyType: 'Bachelor', endDate: '2020-05-01' },
        { studyType: 'Master', endDate: '2022-05-01' },
      ],
    };

    const result = getEducationLevel(resume);

    expect(result).toBe('Master');
  });

  it('returns message when no education array', () => {
    const resume = {};

    const result = getEducationLevel(resume);

    expect(result).toBe('No education information available');
  });

  it('returns message when education array is empty', () => {
    const resume = { education: [] };

    const result = getEducationLevel(resume);

    expect(result).toBe('No education information available');
  });

  it('returns first education when only one entry', () => {
    const resume = {
      education: [{ studyType: 'PhD', endDate: '2025-06-01' }],
    };

    const result = getEducationLevel(resume);

    expect(result).toBe('PhD');
  });

  it('selects education with latest endDate', () => {
    const resume = {
      education: [
        { studyType: 'Bachelor', endDate: '2018-05-01' },
        { studyType: 'High School', endDate: '2014-06-01' },
        { studyType: 'Master', endDate: '2020-05-01' },
      ],
    };

    const result = getEducationLevel(resume);

    expect(result).toBe('Master');
  });

  it('compares dates correctly', () => {
    const resume = {
      education: [
        { studyType: 'Older', endDate: '2020-01-01' },
        { studyType: 'Newer', endDate: '2020-12-31' },
      ],
    };

    const result = getEducationLevel(resume);

    expect(result).toBe('Newer');
  });

  it('handles education with same endDate', () => {
    const resume = {
      education: [
        { studyType: 'First', endDate: '2020-05-01' },
        { studyType: 'Second', endDate: '2020-05-01' },
      ],
    };

    const result = getEducationLevel(resume);

    // Should return first one since dates are equal
    expect(result).toBe('First');
  });

  it('handles various date formats', () => {
    const resume = {
      education: [
        { studyType: 'Bachelor', endDate: '2020-05-15' },
        { studyType: 'Master', endDate: '2022-06-20' },
      ],
    };

    const result = getEducationLevel(resume);

    expect(result).toBe('Master');
  });

  it('handles education without all fields', () => {
    const resume = {
      education: [
        { studyType: 'Bachelor', endDate: '2020-01-01' },
        { studyType: 'Certificate' },
      ],
    };

    const result = getEducationLevel(resume);

    expect(result).toBeDefined();
  });

  it('returns studyType from latest education', () => {
    const resume = {
      education: [
        {
          studyType: 'Bachelor of Science',
          area: 'Computer Science',
          endDate: '2020-05-01',
        },
      ],
    };

    const result = getEducationLevel(resume);

    expect(result).toBe('Bachelor of Science');
  });
});
