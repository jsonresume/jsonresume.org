import { describe, it, expect } from 'vitest';
import { formatLocation, normalizeResume } from '../resume.js';

describe('formatLocation', () => {
  it('joins city, region, countryCode with ", "', () => {
    expect(
      formatLocation({ city: 'Berlin', region: 'BE', countryCode: 'DE' })
    ).toBe('Berlin, BE, DE');
  });

  it('drops empty / missing parts', () => {
    expect(formatLocation({ city: 'Berlin', countryCode: 'DE' })).toBe(
      'Berlin, DE'
    );
    expect(formatLocation({ region: 'CA' })).toBe('CA');
  });

  it('returns empty string for falsy / non-object input', () => {
    expect(formatLocation()).toBe('');
    expect(formatLocation(null)).toBe('');
    expect(formatLocation('x')).toBe('');
    expect(formatLocation({})).toBe('');
  });
});

describe('normalizeResume', () => {
  it('defaults all eleven array sections to [] and basics to {}', () => {
    const out = normalizeResume({});
    expect(out.basics).toEqual({});
    for (const section of [
      'work',
      'volunteer',
      'education',
      'awards',
      'certificates',
      'publications',
      'skills',
      'languages',
      'interests',
      'references',
      'projects',
    ]) {
      expect(out[section]).toEqual([]);
    }
  });

  it('preserves existing sections and basics', () => {
    const resume = {
      basics: { name: 'A' },
      work: [{ name: 'Co' }],
    };
    const out = normalizeResume(resume);
    expect(out.basics).toEqual({ name: 'A' });
    expect(out.work).toEqual([{ name: 'Co' }]);
    expect(out.education).toEqual([]);
  });

  it('coerces non-array section values to []', () => {
    expect(normalizeResume({ work: 'nope' }).work).toEqual([]);
    expect(normalizeResume({ skills: { a: 1 } }).skills).toEqual([]);
  });

  it('handles falsy / non-object input by returning fully-defaulted shape', () => {
    expect(normalizeResume().basics).toEqual({});
    expect(normalizeResume(null).work).toEqual([]);
  });

  it('does not mutate the input', () => {
    const resume = { basics: { name: 'A' } };
    const out = normalizeResume(resume);
    expect(resume.work).toBeUndefined();
    expect(out).not.toBe(resume);
  });

  it('preserves unknown extra fields', () => {
    expect(normalizeResume({ custom: 1 }).custom).toBe(1);
  });
});
