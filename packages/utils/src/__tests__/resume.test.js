import { describe, it, expect } from 'vitest';
import {
  formatLocation,
  normalizeResume,
  withStringLocations,
} from '../resume.js';

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

describe('withStringLocations', () => {
  it('formats structured entry locations and keeps strings', () => {
    const out = withStringLocations({
      basics: { location: { city: 'Berlin', countryCode: 'DE' } },
      work: [
        {
          name: 'A',
          location: { city: 'Oslo', region: 'Oslo', countryCode: 'NO' },
        },
        { name: 'B', location: 'Remote' },
        { name: 'C' },
      ],
      volunteer: [{ location: { city: 'Lagos', countryCode: 'NG' } }],
      education: [{ location: {} }],
    });

    expect(out.work.map((w) => w.location)).toEqual([
      'Oslo, Oslo, NO',
      'Remote',
      undefined,
    ]);
    expect(out.volunteer[0].location).toBe('Lagos, NG');
    expect(out.education[0].location).toBe('');
    expect(out.basics.location).toEqual({ city: 'Berlin', countryCode: 'DE' });
  });

  it('does not mutate the input', () => {
    const resume = { work: [{ location: { city: 'Oslo' } }] };
    withStringLocations(resume);
    expect(resume.work[0].location).toEqual({ city: 'Oslo' });
  });

  it('tolerates missing or malformed input', () => {
    expect(withStringLocations(undefined)).toBeUndefined();
    expect(withStringLocations({ work: 'nope' })).toEqual({ work: 'nope' });
  });
});
