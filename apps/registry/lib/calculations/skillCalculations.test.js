import { describe, it, expect, vi } from 'vitest';
import { countSkillsAndKeywords, skillEvolution } from './skillCalculations';

// Mock compromise
vi.mock('compromise', () => ({
  default: vi.fn((text) => ({
    nouns: () => ({
      out: () => {
        // Simple mock: extract words that might be skills
        const words = text
          .split(/\s+/)
          .filter((word) => word.length > 3)
          .slice(0, 3);
        return words;
      },
    }),
  })),
}));

describe('countSkillsAndKeywords', () => {
  it('counts skills and keywords correctly', () => {
    const resume = {
      skills: [
        { name: 'JavaScript', keywords: ['React', 'Node.js', 'Express'] },
        { name: 'Python', keywords: ['Django', 'Flask'] },
        { name: 'DevOps', keywords: ['Docker'] },
      ],
    };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(3);
    expect(result.totalKeywords).toBe(6);
  });

  it('handles skills without keywords', () => {
    const resume = {
      skills: [
        { name: 'JavaScript', keywords: ['React', 'Node.js'] },
        { name: 'Python' }, // No keywords
        { name: 'Go', keywords: [] }, // Empty keywords
      ],
    };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(3);
    expect(result.totalKeywords).toBe(2);
  });

  it('returns zero for empty skills array', () => {
    const resume = { skills: [] };
    const result = countSkillsAndKeywords(resume);
    expect(result).toEqual({ totalSkills: 0, totalKeywords: 0 });
  });

  it('handles missing skills property', () => {
    const resume = {};
    const result = countSkillsAndKeywords(resume);
    expect(result).toEqual({ totalSkills: 0, totalKeywords: 0 });
  });

  it('handles single skill with multiple keywords', () => {
    const resume = {
      skills: [
        {
          name: 'Web Development',
          keywords: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React'],
        },
      ],
    };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(1);
    expect(result.totalKeywords).toBe(5);
  });
});

describe('skillEvolution', () => {
  it('extracts skills from work history by year', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          summary: 'Built applications using JavaScript and React',
        },
        {
          position: 'Engineer',
          startDate: '2021-06-01',
          summary: 'Developed microservices with Node.js and Docker',
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result).toHaveLength(2);
    expect(result[0].year).toBe(2020);
    expect(result[1].year).toBe(2021);
    expect(Array.isArray(result[0].skills)).toBe(true);
    expect(Array.isArray(result[1].skills)).toBe(true);
  });

  it('handles highlights in addition to summary', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
          summary: 'Built applications',
          highlights: [
            'Used React and TypeScript',
            'Implemented testing with Jest',
          ],
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2020);
    expect(result[0].skills.length).toBeGreaterThan(0);
  });

  it('sorts evolution by year ascending', () => {
    const resume = {
      work: [
        {
          position: 'Senior Dev',
          startDate: '2022-01-01',
          summary: 'Advanced development',
        },
        {
          position: 'Junior Dev',
          startDate: '2020-01-01',
          summary: 'Basic development',
        },
        {
          position: 'Mid Dev',
          startDate: '2021-01-01',
          summary: 'Intermediate development',
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result[0].year).toBe(2020);
    expect(result[1].year).toBe(2021);
    expect(result[2].year).toBe(2022);
  });

  it('handles jobs without summary or highlights', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-01-01',
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2020);
    expect(result[0].skills).toBeDefined();
  });

  it('groups multiple jobs from same year', () => {
    const resume = {
      work: [
        {
          position: 'Developer',
          startDate: '2020-03-01',
          summary: 'JavaScript development',
        },
        {
          position: 'Consultant',
          startDate: '2020-08-01',
          summary: 'Python consulting',
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2020);
    // Should contain skills from both jobs
    expect(result[0].skills.length).toBeGreaterThan(0);
  });
});
