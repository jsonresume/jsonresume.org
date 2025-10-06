import { describe, it, expect } from 'vitest';
import { parseJobContent, getLocationString } from './jobParser';

describe('parseJobContent', () => {
  it('parses valid JSON gpt_content', () => {
    const job = {
      gpt_content: '{"title": "Developer", "company": "Tech Co"}',
    };
    const result = parseJobContent(job);
    expect(result).toEqual({
      title: 'Developer',
      company: 'Tech Co',
    });
  });

  it('returns empty object when gpt_content is FAILED', () => {
    const job = {
      gpt_content: 'FAILED',
    };
    const result = parseJobContent(job);
    expect(result).toEqual({});
  });

  it('returns empty object when gpt_content is missing', () => {
    const job = {};
    const result = parseJobContent(job);
    expect(result).toEqual({});
  });

  it('parses complex nested gpt_content', () => {
    const job = {
      gpt_content: JSON.stringify({
        title: 'Senior Engineer',
        location: {
          city: 'San Francisco',
          region: 'CA',
        },
        requirements: ['5+ years', 'JavaScript', 'React'],
      }),
    };
    const result = parseJobContent(job);
    expect(result).toEqual({
      title: 'Senior Engineer',
      location: {
        city: 'San Francisco',
        region: 'CA',
      },
      requirements: ['5+ years', 'JavaScript', 'React'],
    });
  });

  it('returns empty object when gpt_content is null', () => {
    const job = {
      gpt_content: null,
    };
    const result = parseJobContent(job);
    expect(result).toEqual({});
  });

  it('returns empty object when gpt_content is undefined', () => {
    const job = {
      gpt_content: undefined,
    };
    const result = parseJobContent(job);
    expect(result).toEqual({});
  });
});

describe('getLocationString', () => {
  it('formats complete location with city, region, and country', () => {
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
        region: 'CA',
        countryCode: 'US',
      },
    };
    const result = getLocationString(gptContent);
    expect(result).toBe('CA, US');
  });

  it('handles missing region', () => {
    const gptContent = {
      location: {
        city: 'San Francisco',
        countryCode: 'US',
      },
    };
    const result = getLocationString(gptContent);
    expect(result).toBe('San Francisco, US');
  });

  it('handles only city', () => {
    const gptContent = {
      location: {
        city: 'San Francisco',
      },
    };
    const result = getLocationString(gptContent);
    expect(result).toBe('San Francisco');
  });

  it('returns empty string when location is missing', () => {
    const gptContent = {};
    const result = getLocationString(gptContent);
    expect(result).toBe('');
  });

  it('returns empty string when all location fields are null', () => {
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

  it('handles partial location data', () => {
    const gptContent = {
      location: {
        city: 'Remote',
        region: null,
        countryCode: 'Global',
      },
    };
    const result = getLocationString(gptContent);
    expect(result).toBe('Remote, Global');
  });
});
