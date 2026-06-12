import { describe, it, expect } from 'vitest';
import { getLocationString, parseGptJob } from './jobDetailUtils';

describe('getLocationString', () => {
  it('returns TBD for missing location', () => {
    expect(getLocationString(null)).toBe('Location TBD');
    expect(getLocationString(undefined)).toBe('Location TBD');
  });
  it('passes through a string location', () => {
    expect(getLocationString('Remote')).toBe('Remote');
  });
  it('joins city/region/country, skipping blanks', () => {
    expect(
      getLocationString({ city: 'Berlin', region: '', country: 'Germany' })
    ).toBe('Berlin, Germany');
  });
  it('returns TBD for an empty object', () => {
    expect(getLocationString({})).toBe('Location TBD');
  });
});

describe('parseGptJob', () => {
  it('returns {} when gpt_content is absent', () => {
    expect(parseGptJob({})).toEqual({});
    expect(parseGptJob(null)).toEqual({});
  });
  it('parses valid gpt_content JSON', () => {
    expect(parseGptJob({ gpt_content: '{"title":"Dev"}' })).toEqual({
      title: 'Dev',
    });
  });
  it('throws on invalid JSON (matches original behavior)', () => {
    expect(() => parseGptJob({ gpt_content: 'not json' })).toThrow();
  });
});
