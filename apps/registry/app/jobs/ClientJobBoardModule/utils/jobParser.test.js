import { describe, it, expect } from 'vitest';
import { parseJobContent, getLocationString } from './jobParser';

describe('parseJobContent', () => {
  it('parses valid JSON gpt_content', () => {
    const job = {
      gpt_content: '{"title": "Developer", "company": "Acme"}',
    };

    const result = parseJobContent(job);

    expect(result.title).toBe('Developer');
    expect(result.company).toBe('Acme');
  });

  it('returns empty object when gpt_content is FAILED', () => {
    const job = { gpt_content: 'FAILED' };

    const result = parseJobContent(job);

    expect(result).toEqual({});
  });

  it('returns empty object when gpt_content is missing', () => {
    const job = {};

    const result = parseJobContent(job);

    expect(result).toEqual({});
  });

  it('returns empty object when gpt_content is null', () => {
    const job = { gpt_content: null };

    const result = parseJobContent(job);

    expect(result).toEqual({});
  });

  it('parses complex job content', () => {
    const job = {
      gpt_content: JSON.stringify({
        title: 'Senior Engineer',
        company: 'Tech Corp',
        location: { city: 'SF', region: 'CA' },
        salary: { min: 100000, max: 150000 },
      }),
    };

    const result = parseJobContent(job);

    expect(result.title).toBe('Senior Engineer');
    expect(result.location.city).toBe('SF');
    expect(result.salary.min).toBe(100000);
  });

  it('handles empty JSON object', () => {
    const job = { gpt_content: '{}' };

    const result = parseJobContent(job);

    expect(result).toEqual({});
  });
});

describe('getLocationString', () => {
  it('formats complete location', () => {
    const gptContent = {
      location: {
        city: 'San Francisco',
        region: 'CA',
        countryCode: 'US',
      },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('San Francisco, CA, US');
  });

  it('handles missing city', () => {
    const gptContent = {
      location: {
        region: 'NY',
        countryCode: 'US',
      },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('NY, US');
  });

  it('handles missing region', () => {
    const gptContent = {
      location: {
        city: 'London',
        countryCode: 'UK',
      },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('London, UK');
  });

  it('handles only city', () => {
    const gptContent = {
      location: { city: 'Seattle' },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('Seattle');
  });

  it('handles missing location object', () => {
    const gptContent = {};

    const result = getLocationString(gptContent);

    expect(result).toBe('');
  });

  it('handles null values in location', () => {
    const gptContent = {
      location: {
        city: null,
        region: 'TX',
        countryCode: null,
      },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('TX');
  });

  it('handles empty strings in location', () => {
    const gptContent = {
      location: {
        city: '',
        region: 'CA',
        countryCode: '',
      },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('CA');
  });

  it('handles all null location', () => {
    const gptContent = {
      location: {
        city: null,
        region: null,
        countryCode: null,
      },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('');
  });

  it('filters falsy values correctly', () => {
    const gptContent = {
      location: {
        city: 'Boston',
        region: undefined,
        countryCode: 'US',
      },
    };

    const result = getLocationString(gptContent);

    expect(result).toBe('Boston, US');
  });
});
