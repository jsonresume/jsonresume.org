import { describe, it, expect } from 'vitest';
import { formatLocation } from './formatters';

describe('formatLocation', () => {
  it('formats complete location object', () => {
    const location = {
      city: 'San Francisco',
      region: 'CA',
      postalCode: '94102',
      countryCode: 'US',
    };

    const result = formatLocation(location);

    expect(result).toBe('San Francisco, CA, 94102, US');
  });

  it('handles null location', () => {
    const result = formatLocation(null);

    expect(result).toBe('Location not provided');
  });

  it('handles undefined location', () => {
    const result = formatLocation(undefined);

    expect(result).toBe('Location not provided');
  });

  it('handles empty location object', () => {
    const result = formatLocation({});

    expect(result).toBe('Location not provided');
  });

  it('filters out empty strings', () => {
    const location = {
      city: 'Boston',
      region: '',
      postalCode: '02101',
      countryCode: '',
    };

    const result = formatLocation(location);

    expect(result).toBe('Boston, 02101');
  });

  it('handles only city', () => {
    const location = { city: 'Seattle' };

    const result = formatLocation(location);

    expect(result).toBe('Seattle');
  });

  it('handles only region', () => {
    const location = { region: 'California' };

    const result = formatLocation(location);

    expect(result).toBe('California');
  });

  it('handles city and region', () => {
    const location = { city: 'Austin', region: 'TX' };

    const result = formatLocation(location);

    expect(result).toBe('Austin, TX');
  });

  it('handles city and country', () => {
    const location = { city: 'London', countryCode: 'UK' };

    const result = formatLocation(location);

    expect(result).toBe('London, UK');
  });

  it('checks trim but keeps original values', () => {
    const location = {
      city: '  New York  ',
      region: '  NY  ',
    };

    const result = formatLocation(location);

    // Function uses trim() for checking but doesn't trim values
    expect(result).toBe('  New York  ,   NY  ');
  });

  it('handles location with only whitespace values', () => {
    const location = {
      city: '   ',
      region: '  ',
      postalCode: '',
    };

    const result = formatLocation(location);

    expect(result).toBe('Location not provided');
  });

  it('maintains order: city, region, postalCode, countryCode', () => {
    const location = {
      countryCode: 'US',
      postalCode: '12345',
      city: 'Springfield',
      region: 'IL',
    };

    const result = formatLocation(location);

    expect(result).toBe('Springfield, IL, 12345, US');
  });

  it('handles partial location with postal code', () => {
    const location = { postalCode: '90210' };

    const result = formatLocation(location);

    expect(result).toBe('90210');
  });

  it('handles international locations', () => {
    const location = {
      city: 'Paris',
      region: 'Île-de-France',
      postalCode: '75001',
      countryCode: 'FR',
    };

    const result = formatLocation(location);

    expect(result).toBe('Paris, Île-de-France, 75001, FR');
  });
});
