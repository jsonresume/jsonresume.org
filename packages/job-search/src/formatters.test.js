import { describe, it, expect } from 'vitest';
import { normalizeLocation, formatLocation } from './formatters.js';

describe('normalizeLocation', () => {
  it('normalizes the canonical object location shape', () => {
    const job = {
      location: { city: 'Berlin', region: 'BE', countryCode: 'DE' },
      remote: 'None',
    };
    const norm = normalizeLocation(job);
    expect(norm).toEqual({
      city: 'Berlin',
      region: 'BE',
      countryCode: 'DE',
      display: 'Berlin, BE, DE',
      remote: false,
    });
  });

  it('builds display from whichever object fields are present', () => {
    expect(normalizeLocation({ location: { city: 'Seattle' } }).display).toBe(
      'Seattle'
    );
    expect(normalizeLocation({ location: { countryCode: 'US' } }).display).toBe(
      'US'
    );
    expect(normalizeLocation({ location: {} }).display).toBeNull();
  });

  it('handles a historic plain-string location', () => {
    const norm = normalizeLocation({ location: 'San Francisco, CA' });
    expect(norm.display).toBe('San Francisco, CA');
    expect(norm.city).toBeNull();
    expect(norm.remote).toBe(false);
  });

  it('detects "remote" inside a string location (historic rows)', () => {
    expect(normalizeLocation({ location: 'Remote (US)' }).remote).toBe(true);
    expect(normalizeLocation({ location: 'Fully remote' }).remote).toBe(true);
    expect(normalizeLocation({ location: 'remote' }).remote).toBe(true);
  });

  it('uses the separate remote field for object locations', () => {
    expect(
      normalizeLocation({ location: { city: 'NYC' }, remote: 'Full' }).remote
    ).toBe(true);
    expect(
      normalizeLocation({ location: { city: 'NYC' }, remote: 'Hybrid' }).remote
    ).toBe(false);
    expect(
      normalizeLocation({ location: { city: 'NYC' }, remote: 'None' }).remote
    ).toBe(false);
  });

  it('does NOT match remote on an object location (regression guard)', () => {
    // The old `/remote/i.test(j.location || '')` stringified objects to
    // "[object Object]" and never matched — but an object whose city happened
    // to contain "remote" should not flip the flag either.
    const job = { location: { city: 'Remoteville' }, remote: 'None' };
    expect(normalizeLocation(job).remote).toBe(false);
  });

  it('handles null / undefined / empty location', () => {
    expect(normalizeLocation({ location: null })).toEqual({
      city: null,
      region: null,
      countryCode: null,
      display: null,
      remote: false,
    });
    expect(normalizeLocation({ location: undefined }).display).toBeNull();
    expect(normalizeLocation({ location: '' }).display).toBeNull();
    expect(normalizeLocation(null).display).toBeNull();
    expect(normalizeLocation(undefined).remote).toBe(false);
  });

  it('accepts a bare location value (not wrapped in a job)', () => {
    expect(
      normalizeLocation({ city: 'Austin', countryCode: 'US' }).display
    ).toBe('Austin, US');
    expect(normalizeLocation('Remote').remote).toBe(true);
  });

  it('trims whitespace from string locations', () => {
    expect(normalizeLocation({ location: '  London  ' }).display).toBe(
      'London'
    );
    expect(normalizeLocation({ location: '   ' }).display).toBeNull();
  });
});

describe('formatLocation', () => {
  it('formats object locations with an explicit remote suffix', () => {
    expect(formatLocation({ city: 'Berlin', countryCode: 'DE' }, 'Full')).toBe(
      'Berlin, DE, (Full)'
    );
  });

  it('formats string locations', () => {
    expect(formatLocation('San Francisco, CA')).toBe('San Francisco, CA');
  });

  it('falls back to an em dash when empty', () => {
    expect(formatLocation(null)).toBe('—');
    expect(formatLocation({})).toBe('—');
  });
});
