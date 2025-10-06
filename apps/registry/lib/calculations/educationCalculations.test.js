import { describe, it, expect } from 'vitest';
import { getEducationLevel } from './educationCalculations';

describe('getEducationLevel', () => {
  it('returns highest education level based on latest end date', () => {
    const resume = {
      education: [
        {
          studyType: "Bachelor's Degree",
          endDate: '2018-05-15',
        },
        {
          studyType: "Master's Degree",
          endDate: '2020-12-20',
        },
        {
          studyType: 'High School Diploma',
          endDate: '2014-06-01',
        },
      ],
    };
    const result = getEducationLevel(resume);
    expect(result).toBe("Master's Degree");
  });

  it('returns first education if only one exists', () => {
    const resume = {
      education: [
        {
          studyType: "Bachelor's Degree",
          endDate: '2020-05-15',
        },
      ],
    };
    const result = getEducationLevel(resume);
    expect(result).toBe("Bachelor's Degree");
  });

  it('handles missing education array', () => {
    const resume = {};
    const result = getEducationLevel(resume);
    expect(result).toBe('No education information available');
  });

  it('handles empty education array', () => {
    const resume = { education: [] };
    const result = getEducationLevel(resume);
    expect(result).toBe('No education information available');
  });

  it('compares dates correctly when year is same', () => {
    const resume = {
      education: [
        {
          studyType: "Bachelor's Degree",
          endDate: '2020-05-15',
        },
        {
          studyType: "Master's Degree",
          endDate: '2020-12-20',
        },
      ],
    };
    const result = getEducationLevel(resume);
    expect(result).toBe("Master's Degree");
  });

  it('handles education with same end dates', () => {
    const resume = {
      education: [
        {
          studyType: 'Computer Science',
          endDate: '2020-05-15',
        },
        {
          studyType: 'Mathematics',
          endDate: '2020-05-15',
        },
      ],
    };
    const result = getEducationLevel(resume);
    // Should return first one when dates are equal
    expect(result).toBe('Computer Science');
  });

  it('handles education entries in chronological order', () => {
    const resume = {
      education: [
        {
          studyType: 'High School',
          endDate: '2014-06-01',
        },
        {
          studyType: "Bachelor's",
          endDate: '2018-05-15',
        },
        {
          studyType: "Master's",
          endDate: '2020-12-20',
        },
      ],
    };
    const result = getEducationLevel(resume);
    expect(result).toBe("Master's");
  });

  it('handles education entries in reverse chronological order', () => {
    const resume = {
      education: [
        {
          studyType: "Master's",
          endDate: '2020-12-20',
        },
        {
          studyType: "Bachelor's",
          endDate: '2018-05-15',
        },
        {
          studyType: 'High School',
          endDate: '2014-06-01',
        },
      ],
    };
    const result = getEducationLevel(resume);
    expect(result).toBe("Master's");
  });
});
