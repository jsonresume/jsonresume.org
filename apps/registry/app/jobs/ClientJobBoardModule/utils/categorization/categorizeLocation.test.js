import { describe, it, expect } from 'vitest';
import { categorizeLocation } from './categorizeLocation';

describe('categorizeLocation', () => {
  it('returns Not Specified for null/undefined', () => {
    expect(categorizeLocation(null)).toBe('Not Specified');
    expect(categorizeLocation(undefined)).toBe('Not Specified');
    expect(categorizeLocation('')).toBe('Not Specified');
  });

  it('returns location as-is if it contains comma', () => {
    expect(categorizeLocation('New York, NY, USA')).toBe('New York, NY, USA');
    expect(categorizeLocation('London, UK')).toBe('London, UK');
    expect(categorizeLocation('San Francisco, CA')).toBe('San Francisco, CA');
  });

  it('categorizes remote locations', () => {
    expect(categorizeLocation('Remote')).toBe('Remote');
    expect(categorizeLocation('remote work')).toBe('Remote');
    expect(categorizeLocation('100% Remote')).toBe('Remote');
  });

  it('categorizes hybrid locations', () => {
    expect(categorizeLocation('Hybrid')).toBe('Hybrid');
    expect(categorizeLocation('hybrid work')).toBe('Hybrid');
  });

  it('categorizes on-site locations', () => {
    expect(categorizeLocation('On-site')).toBe('On-site');
    expect(categorizeLocation('onsite')).toBe('On-site');
    expect(categorizeLocation('office')).toBe('On-site');
    expect(categorizeLocation('Office Work')).toBe('On-site');
  });

  it('returns original location for unrecognized formats', () => {
    expect(categorizeLocation('New York')).toBe('New York');
    expect(categorizeLocation('USA')).toBe('USA');
    expect(categorizeLocation('Headquarters')).toBe('Headquarters');
  });

  it('is case insensitive for categorization', () => {
    expect(categorizeLocation('REMOTE')).toBe('Remote');
    expect(categorizeLocation('HyBrId')).toBe('Hybrid');
  });

  it('handles special characters in categorization', () => {
    expect(categorizeLocation('Remote!')).toBe('Remote');
    expect(categorizeLocation('On-site@HQ')).toBe('On-site');
  });

  it('prioritizes comma format over keywords', () => {
    expect(categorizeLocation('Remote, CA')).toBe('Remote, CA');
    expect(categorizeLocation('Hybrid, TX')).toBe('Hybrid, TX');
  });

  it('preserves original casing for passthrough', () => {
    expect(categorizeLocation('NEW YORK')).toBe('NEW YORK');
    expect(categorizeLocation('San Diego')).toBe('San Diego');
  });

  it('handles whitespace-only string', () => {
    expect(categorizeLocation('  Remote  ')).toBe('Remote');
    expect(categorizeLocation('  ')).toBe('  '); // Whitespace is truthy, returned as-is
  });
});
