import { describe, expect, it } from 'vitest';
import { isoTimestamp } from './types.js';

describe('isoTimestamp', () => {
  it('formats timestamptz like to_json()', () => {
    expect(isoTimestamp('2026-10-23 08:36:48.123456+00')).toBe(
      '2026-10-23T08:36:48.123456+00:00'
    );
  });

  it('keeps a minutes offset', () => {
    expect(isoTimestamp('2026-10-23 08:36:48+05:30')).toBe(
      '2026-10-23T08:36:48+05:30'
    );
  });

  it('formats timestamp without time zone', () => {
    expect(isoTimestamp('2026-10-23 08:36:48')).toBe('2026-10-23T08:36:48');
  });

  it('passes infinity through', () => {
    expect(isoTimestamp('infinity')).toBe('infinity');
  });
});
