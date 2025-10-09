import { describe, it, expect, vi } from 'vitest';
import { filterBySearchTerm } from './searchFilter';

// Mock jobParser
vi.mock('../../utils/jobParser', () => ({
  parseJobContent: vi.fn((job) => job.gptContent || {}),
}));

describe('filterBySearchTerm', () => {
  it('returns all jobs when search term is empty', () => {
    const jobs = [{ id: 1 }, { id: 2 }];

    const result = filterBySearchTerm(jobs, '');

    expect(result).toHaveLength(2);
  });

  it('returns all jobs when search term is null', () => {
    const jobs = [{ id: 1 }, { id: 2 }];

    const result = filterBySearchTerm(jobs, null);

    expect(result).toHaveLength(2);
  });

  it('filters by title', () => {
    const jobs = [
      { gptContent: { title: 'Senior Developer' } },
      { gptContent: { title: 'Junior Designer' } },
    ];

    const result = filterBySearchTerm(jobs, 'developer');

    expect(result).toHaveLength(1);
    expect(result[0].gptContent.title).toBe('Senior Developer');
  });

  it('filters by company', () => {
    const jobs = [
      { gptContent: { company: 'Acme Corp' } },
      { gptContent: { company: 'Tech Inc' } },
    ];

    const result = filterBySearchTerm(jobs, 'acme');

    expect(result).toHaveLength(1);
    expect(result[0].gptContent.company).toBe('Acme Corp');
  });

  it('filters by description', () => {
    const jobs = [
      { gptContent: { description: 'Build React applications' } },
      { gptContent: { description: 'Design user interfaces' } },
    ];

    const result = filterBySearchTerm(jobs, 'react');

    expect(result).toHaveLength(1);
  });

  it('filters by requirements', () => {
    const jobs = [
      {
        gptContent: {
          requirements: ['5 years JavaScript', '3 years React'],
        },
      },
      { gptContent: { requirements: ['Python experience'] } },
    ];

    const result = filterBySearchTerm(jobs, 'javascript');

    expect(result).toHaveLength(1);
  });

  it('filters by responsibilities', () => {
    const jobs = [
      {
        gptContent: {
          responsibilities: ['Lead team', 'Code reviews'],
        },
      },
      { gptContent: { responsibilities: ['Design systems'] } },
    ];

    const result = filterBySearchTerm(jobs, 'team');

    expect(result).toHaveLength(1);
  });

  it('is case insensitive', () => {
    const jobs = [{ gptContent: { title: 'Senior Developer' } }];

    const result = filterBySearchTerm(jobs, 'SENIOR');

    expect(result).toHaveLength(1);
  });

  it('matches partial strings', () => {
    const jobs = [{ gptContent: { title: 'JavaScript Developer' } }];

    const result = filterBySearchTerm(jobs, 'java');

    expect(result).toHaveLength(1);
  });

  it('returns empty array when no matches', () => {
    const jobs = [{ gptContent: { title: 'Developer' } }];

    const result = filterBySearchTerm(jobs, 'designer');

    expect(result).toHaveLength(0);
  });

  it('handles jobs without gpt content', () => {
    const jobs = [{ id: 1 }, { gptContent: { title: 'Developer' } }];

    const result = filterBySearchTerm(jobs, 'developer');

    expect(result).toHaveLength(1);
  });

  it('handles undefined requirements array', () => {
    const jobs = [{ gptContent: { title: 'Developer' } }];

    const result = filterBySearchTerm(jobs, 'requirement');

    expect(result).toHaveLength(0);
  });

  it('handles undefined responsibilities array', () => {
    const jobs = [{ gptContent: { title: 'Developer' } }];

    const result = filterBySearchTerm(jobs, 'responsibility');

    expect(result).toHaveLength(0);
  });

  it('matches across multiple fields', () => {
    const jobs = [
      {
        gptContent: {
          title: 'Developer',
          company: 'Acme',
          description: 'Build apps',
        },
      },
    ];

    expect(filterBySearchTerm(jobs, 'developer')).toHaveLength(1);
    expect(filterBySearchTerm(jobs, 'acme')).toHaveLength(1);
    expect(filterBySearchTerm(jobs, 'apps')).toHaveLength(1);
  });
});
