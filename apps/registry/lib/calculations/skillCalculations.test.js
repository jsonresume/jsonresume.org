import { describe, it, expect, vi } from 'vitest';
import { countSkillsAndKeywords, skillEvolution } from './skillCalculations';

// Mock compromise
vi.mock('compromise', () => ({
  default: vi.fn((text) => ({
    nouns: () => ({
      out: () => text.split(' ').filter((w) => w.length > 3),
    }),
  })),
}));

describe('countSkillsAndKeywords', () => {
  it('counts skills and keywords', () => {
    const resume = {
      skills: [
        { name: 'JavaScript', keywords: ['React', 'Node'] },
        { name: 'Python', keywords: ['Django'] },
      ],
    };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(2);
    expect(result.totalKeywords).toBe(3);
  });

  it('handles skills without keywords', () => {
    const resume = {
      skills: [{ name: 'JavaScript' }, { name: 'Python' }],
    };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(2);
    expect(result.totalKeywords).toBe(0);
  });

  it('handles empty skills array', () => {
    const resume = { skills: [] };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(0);
    expect(result.totalKeywords).toBe(0);
  });

  it('handles missing skills', () => {
    const resume = {};

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(0);
    expect(result.totalKeywords).toBe(0);
  });

  it('counts multiple keywords', () => {
    const resume = {
      skills: [
        { name: 'Web', keywords: ['HTML', 'CSS', 'JavaScript', 'React'] },
      ],
    };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(1);
    expect(result.totalKeywords).toBe(4);
  });

  it('handles mixed skills with and without keywords', () => {
    const resume = {
      skills: [
        { name: 'Frontend', keywords: ['React', 'Vue'] },
        { name: 'Backend' },
        { name: 'Database', keywords: ['SQL'] },
      ],
    };

    const result = countSkillsAndKeywords(resume);

    expect(result.totalSkills).toBe(3);
    expect(result.totalKeywords).toBe(3);
  });

  it('returns object with expected properties', () => {
    const resume = { skills: [{ name: 'Test' }] };

    const result = countSkillsAndKeywords(resume);

    expect(result).toHaveProperty('totalSkills');
    expect(result).toHaveProperty('totalKeywords');
  });
});

describe('skillEvolution', () => {
  it('extracts skills by year', () => {
    const resume = {
      work: [
        {
          startDate: '2020-01-01',
          summary: 'Built React applications',
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2020);
    expect(result[0].skills).toBeDefined();
  });

  it('sorts evolution by year', () => {
    const resume = {
      work: [
        { startDate: '2022-01-01', summary: 'Work 2022' },
        { startDate: '2020-01-01', summary: 'Work 2020' },
        { startDate: '2021-01-01', summary: 'Work 2021' },
      ],
    };

    const result = skillEvolution(resume);

    expect(result[0].year).toBe(2020);
    expect(result[1].year).toBe(2021);
    expect(result[2].year).toBe(2022);
  });

  it('handles job without summary', () => {
    const resume = {
      work: [{ startDate: '2020-01-01' }],
    };

    const result = skillEvolution(resume);

    expect(result).toHaveLength(1);
  });

  it('includes highlights in skill extraction', () => {
    const resume = {
      work: [
        {
          startDate: '2020-01-01',
          highlights: ['Used Python', 'Built Django apps'],
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result[0].skills.length).toBeGreaterThan(0);
  });

  it('combines summary and highlights', () => {
    const resume = {
      work: [
        {
          startDate: '2020-01-01',
          summary: 'React development',
          highlights: ['Node.js backend'],
        },
      ],
    };

    const result = skillEvolution(resume);

    expect(result[0].skills.length).toBeGreaterThan(0);
  });

  it('deduplicates skills within same year', () => {
    const resume = {
      work: [
        {
          startDate: '2020-01-01',
          summary: 'React React',
        },
      ],
    };

    const result = skillEvolution(resume);

    const reactCount = result[0].skills.filter((s) => s === 'React').length;
    expect(reactCount).toBeLessThanOrEqual(1);
  });

  it('returns array of evolution objects', () => {
    const resume = {
      work: [{ startDate: '2020-01-01', summary: 'Work' }],
    };

    const result = skillEvolution(resume);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('year');
    expect(result[0]).toHaveProperty('skills');
  });
});
