import { describe, it, expect } from 'vitest';
import { formatLocation } from './formatters';

describe('formatLocation', () => {
  it('returns default message when location is null', () => {
    expect(formatLocation(null)).toBe('Location not provided');
  });

  it('returns default message when location is undefined', () => {
    expect(formatLocation(undefined)).toBe('Location not provided');
  });

  it('returns default message when all location fields are empty', () => {
    expect(
      formatLocation({
        city: '',
        region: '',
        postalCode: '',
        countryCode: '',
      })
    ).toBe('Location not provided');
  });

  it('formats location with only city', () => {
    expect(formatLocation({ city: 'San Francisco' })).toBe('San Francisco');
  });

  it('formats location with city and region', () => {
    expect(formatLocation({ city: 'San Francisco', region: 'CA' })).toBe(
      'San Francisco, CA'
    );
  });

  it('formats location with city, region, and country code', () => {
    expect(
      formatLocation({
        city: 'San Francisco',
        region: 'CA',
        countryCode: 'US',
      })
    ).toBe('San Francisco, CA, US');
  });

  it('formats complete location with all fields', () => {
    expect(
      formatLocation({
        city: 'San Francisco',
        region: 'CA',
        postalCode: '94102',
        countryCode: 'US',
      })
    ).toBe('San Francisco, CA, 94102, US');
  });

  it('handles location with only postal code', () => {
    expect(formatLocation({ postalCode: '94102' })).toBe('94102');
  });

  it('handles location with only country code', () => {
    expect(formatLocation({ countryCode: 'US' })).toBe('US');
  });

  it('does not trim whitespace from location fields', () => {
    // The formatter currently doesn't trim whitespace - it only filters empty strings
    expect(
      formatLocation({
        city: '  San Francisco  ',
        region: '  CA  ',
      })
    ).toBe('  San Francisco  ,   CA  ');
  });

  it('filters out empty string fields after trimming', () => {
    expect(
      formatLocation({
        city: 'San Francisco',
        region: '',
        postalCode: '   ',
        countryCode: 'US',
      })
    ).toBe('San Francisco, US');
  });

  it('handles partial location objects', () => {
    expect(formatLocation({ region: 'California' })).toBe('California');
  });
});
