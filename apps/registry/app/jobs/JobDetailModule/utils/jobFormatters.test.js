import { describe, it, expect } from 'vitest';
import {
  parseGptContent,
  formatLocation,
  formatSalary,
  formatDate,
} from './jobFormatters';

describe('parseGptContent', () => {
  it('parses valid JSON gpt_content', () => {
    const job = {
      gpt_content: '{"title": "Developer", "company": "Tech Co"}',
    };
    const result = parseGptContent(job);
    expect(result).toEqual({
      title: 'Developer',
      company: 'Tech Co',
    });
  });

  it('returns empty object when gpt_content is FAILED', () => {
    const job = { gpt_content: 'FAILED' };
    const result = parseGptContent(job);
    expect(result).toEqual({});
  });

  it('returns empty object when gpt_content is missing', () => {
    const job = {};
    const result = parseGptContent(job);
    expect(result).toEqual({});
  });

  it('returns empty object for invalid JSON', () => {
    const job = { gpt_content: 'not valid json {' };
    const result = parseGptContent(job);
    expect(result).toEqual({});
  });

  it('returns empty object when job is null', () => {
    const result = parseGptContent(null);
    expect(result).toEqual({});
  });

  it('handles complex nested JSON', () => {
    const job = {
      gpt_content: JSON.stringify({
        title: 'Senior Engineer',
        requirements: ['5+ years', 'JavaScript'],
      }),
    };
    const result = parseGptContent(job);
    expect(result.title).toBe('Senior Engineer');
    expect(result.requirements).toEqual(['5+ years', 'JavaScript']);
  });
});

describe('formatLocation', () => {
  it('formats complete location', () => {
    const location = {
      city: 'San Francisco',
      region: 'CA',
      countryCode: 'US',
    };
    const result = formatLocation(location);
    expect(result).toBe('San Francisco, CA, US');
  });

  it('handles partial location with only city', () => {
    const location = { city: 'San Francisco' };
    const result = formatLocation(location);
    expect(result).toBe('San Francisco');
  });

  it('handles partial location with city and region', () => {
    const location = { city: 'San Francisco', region: 'CA' };
    const result = formatLocation(location);
    expect(result).toBe('San Francisco, CA');
  });

  it('returns empty string for null location', () => {
    const result = formatLocation(null);
    expect(result).toBe('');
  });

  it('returns empty string for undefined location', () => {
    const result = formatLocation(undefined);
    expect(result).toBe('');
  });

  it('filters out null/undefined fields', () => {
    const location = {
      city: 'San Francisco',
      region: null,
      countryCode: 'US',
    };
    const result = formatLocation(location);
    expect(result).toBe('San Francisco, US');
  });
});

describe('formatSalary', () => {
  it('formats salary with locale string', () => {
    const result = formatSalary(100000);
    expect(result).toBe('$100,000/year');
  });

  it('formats large salaries correctly', () => {
    const result = formatSalary(250000);
    expect(result).toBe('$250,000/year');
  });

  it('handles salary as string', () => {
    const result = formatSalary('120000');
    expect(result).toBe('$120,000/year');
  });

  it('returns "Not specified" for null salary', () => {
    const result = formatSalary(null);
    expect(result).toBe('Not specified');
  });

  it('returns "Not specified" for undefined salary', () => {
    const result = formatSalary(undefined);
    expect(result).toBe('Not specified');
  });

  it('returns "Not specified" for zero salary', () => {
    const result = formatSalary(0);
    expect(result).toBe('Not specified');
  });

  it('formats small salaries', () => {
    const result = formatSalary(50000);
    expect(result).toBe('$50,000/year');
  });
});

describe('formatDate', () => {
  it('formats valid date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toBe('January 15, 2024');
  });

  it('formats ISO date string', () => {
    const result = formatDate('2024-06-30T00:00:00.000Z');
    expect(result).toContain('2024');
    expect(result).toContain('June');
  });

  it('returns "Recently" for null date', () => {
    const result = formatDate(null);
    expect(result).toBe('Recently');
  });

  it('returns "Recently" for undefined date', () => {
    const result = formatDate(undefined);
    expect(result).toBe('Recently');
  });

  it('returns "Recently" for empty string', () => {
    const result = formatDate('');
    expect(result).toBe('Recently');
  });

  it('formats different month correctly', () => {
    const result = formatDate('2024-12-25');
    expect(result).toBe('December 25, 2024');
  });
});
