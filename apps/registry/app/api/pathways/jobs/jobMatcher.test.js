import { describe, it, expect, vi } from 'vitest';
import { buildJobInfoMap } from './jobMatcher';

// Only test the pure function buildJobInfoMap (matchJobs requires Supabase)

describe('buildJobInfoMap', () => {
  it('builds info map from jobs with parsedContent', () => {
    const jobs = [
      {
        uuid: 'job-1',
        parsedContent: {
          title: 'Senior Engineer',
          company: 'Acme Corp',
          skills: ['React', 'Node.js'],
        },
        salary_usd: 150000,
        salary_min: 140000,
        salary_max: 160000,
        salary_currency: 'USD',
      },
      {
        uuid: 'job-2',
        parsedContent: {
          title: 'Product Manager',
          company: 'Beta Inc',
          remote: true,
        },
        salary_usd: null,
        salary_min: null,
        salary_max: null,
        salary_currency: null,
      },
    ];

    const result = buildJobInfoMap(jobs);

    expect(result['job-1']).toEqual({
      title: 'Senior Engineer',
      company: 'Acme Corp',
      skills: ['React', 'Node.js'],
      salaryUsd: 150000,
      salaryMin: 140000,
      salaryMax: 160000,
      salaryCurrency: 'USD',
    });

    expect(result['job-2']).toEqual({
      title: 'Product Manager',
      company: 'Beta Inc',
      remote: true,
      salaryUsd: null,
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: null,
    });
  });

  it('handles jobs without parsedContent', () => {
    const jobs = [{ uuid: 'bad-job' }];
    const result = buildJobInfoMap(jobs);
    expect(result['bad-job']).toEqual({
      title: 'Unknown Job',
      error: 'No content',
    });
  });

  it('handles empty array', () => {
    const result = buildJobInfoMap([]);
    expect(result).toEqual({});
  });

  it('preserves all parsedContent fields', () => {
    const jobs = [
      {
        uuid: 'rich-job',
        parsedContent: {
          title: 'Dev',
          company: 'Co',
          description: 'A long description',
          location: { city: 'NYC', region: 'NY' },
          remote: true,
          skills: ['A', 'B'],
          bonusSkills: ['C'],
          url: 'https://example.com/job',
        },
        salary_usd: 100000,
        salary_min: 90000,
        salary_max: 110000,
        salary_currency: 'USD',
      },
    ];

    const result = buildJobInfoMap(jobs);
    const info = result['rich-job'];
    expect(info.title).toBe('Dev');
    expect(info.description).toBe('A long description');
    expect(info.location).toEqual({ city: 'NYC', region: 'NY' });
    expect(info.remote).toBe(true);
    expect(info.skills).toEqual(['A', 'B']);
    expect(info.bonusSkills).toEqual(['C']);
    expect(info.url).toBe('https://example.com/job');
    expect(info.salaryUsd).toBe(100000);
  });
});
