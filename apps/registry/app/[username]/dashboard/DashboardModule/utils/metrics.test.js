import { describe, it, expect } from 'vitest';
import { getMetrics } from './metrics';

describe('getMetrics', () => {
  it('calculates all metrics from complete resume', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
        {
          position: 'Engineer',
          startDate: '2021-01-01',
          endDate: '2022-01-01',
        },
      ],
      projects: [{ name: 'Project 1' }, { name: 'Project 2' }],
      skills: [{ name: 'JavaScript' }, { name: 'React' }],
      certifications: [{ name: 'AWS Certified' }],
      awards: [{ title: 'Best Developer' }],
      publications: [{ name: 'Research Paper' }],
      volunteer: [{ organization: 'Code for Good' }],
      education: [
        { studyType: "Bachelor's", endDate: '2018-05-01' },
        { studyType: "Master's", endDate: '2020-06-01' },
      ],
    };

    const result = getMetrics({ resume });

    expect(result.totalJobs).toBe(2);
    expect(result.totalProjects).toBe(2);
    expect(result.totalSkills).toBe(2);
    expect(result.totalCertifications).toBe(1);
    expect(result.totalAwards).toBe(1);
    expect(result.totalPublications).toBe(1);
    expect(result.totalVolunteer).toBe(1);
    expect(result.educationLevel).toBe("Master's");
    expect(result.topSkillCategories).toEqual(['JavaScript', 'React']);
    expect(result.totalExperience).toBeDefined();
    expect(result.averageJobDuration).toBeDefined();
    expect(result.careerProgression).toBeDefined();
  });

  it('handles empty resume sections', () => {
    const resume = {
      work: [],
      projects: [],
      skills: [],
    };

    const result = getMetrics({ resume });

    expect(result.totalJobs).toBe(0);
    expect(result.totalProjects).toBe(0);
    expect(result.totalSkills).toBe(0);
  });

  it('handles undefined resume sections', () => {
    const resume = {};

    const result = getMetrics({ resume });

    expect(result.totalJobs).toBeUndefined();
    expect(result.totalProjects).toBeUndefined();
    expect(result.totalSkills).toBeUndefined();
    expect(result.totalCertifications).toBeUndefined();
    expect(result.totalAwards).toBeUndefined();
    expect(result.totalPublications).toBeUndefined();
    expect(result.totalVolunteer).toBeUndefined();
  });

  it('calculates total experience correctly', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
      education: [{ studyType: "Bachelor's", endDate: '2020-05-01' }],
    };

    const result = getMetrics({ resume });

    expect(result.totalExperience.years).toBe(1);
  });

  it('returns placeholder values for hardcoded metrics', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
      ],
    };

    const result = getMetrics({ resume });

    // These are hardcoded in the implementation
    expect(result.mostFrequentJobTitle).toBe('Software Engineer');
    expect(result.mostRecentSkill).toBe('React Native');
    expect(result.topIndustries).toEqual([
      'Technology',
      'Finance',
      'Healthcare',
    ]);
    expect(result.geographicMobility).toBe(3);
  });

  it('maps skills to skill categories', () => {
    const resume = {
      skills: [{ name: 'JavaScript' }, { name: 'Python' }, { name: 'React' }],
    };

    const result = getMetrics({ resume });

    expect(result.topSkillCategories).toEqual([
      'JavaScript',
      'Python',
      'React',
    ]);
    expect(result.totalSkills).toBe(3);
  });

  it('handles resume with only work history', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
        },
        {
          position: 'Senior Developer',
          startDate: '2021-01-01',
          endDate: '2023-01-01',
        },
      ],
    };

    const result = getMetrics({ resume });

    expect(result.totalJobs).toBe(2);
    expect(result.totalExperience.years).toBe(3);
    expect(result.averageJobDuration.years).toBe(1);
  });

  it('handles education with no degree', () => {
    const resume = {
      education: [],
    };

    const result = getMetrics({ resume });

    expect(result.educationLevel).toBe('No education information available');
  });
});
