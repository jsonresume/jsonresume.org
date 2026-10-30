import { describe, expect, it } from 'vitest';
import { eligibility, regionCountries, resumeCountry } from './eligibility';
import { posting } from './test/fixtures';

const remote = (...remoteRegions: string[]) =>
  posting({ remote: 'remote_region', remoteRegions, countryCode: null });

describe('who can take a job, by where they live', () => {
  it('lets anyone take worldwide remote', () => {
    expect(eligibility(posting({ remote: 'remote_global' }), 'AU')).toBe('yes');
  });

  it('reads fenced remote as posts write it', () => {
    // From the October 2026 board.
    expect(eligibility(remote('US'), 'AU')).toBe('no');
    expect(eligibility(remote('US', 'Canada'), 'CA')).toBe('yes');
    expect(eligibility(remote('NAMER', 'EMEA', 'APJ', 'SF'), 'AU')).toBe('yes');
    expect(eligibility(remote('Europe'), 'DE')).toBe('yes');
    expect(eligibility(remote('EU'), 'PL')).toBe('yes');
    expect(eligibility(remote('EU'), 'GB')).toBe('no');
    expect(eligibility(remote('US - Eastern/Central Time'), 'AU')).toBe('no');
    expect(eligibility(remote('Canada (Ontario)'), 'CA')).toBe('yes');
    expect(eligibility(remote('US', 'International'), 'IN')).toBe('yes');
    expect(eligibility(remote('Texas', 'Virginia'), 'US')).toBe('yes');
  });

  it("is unclear when it can't read a region, rather than ruling them out", () => {
    expect(eligibility(remote('CET ±3'), 'AU')).toBe('unclear');
    expect(eligibility(remote(), 'AU')).toBe('unclear');
    expect(regionCountries('select countries (see the wiki)')).toBeUndefined();
  });

  it('needs an office to be in their country', () => {
    expect(eligibility(posting({ countryCode: 'DE' }), 'DE')).toBe('yes');
    expect(eligibility(posting({ countryCode: 'DE' }), 'AU')).toBe('no');
    expect(eligibility(posting({ countryCode: null }), 'AU')).toBe('unclear');
  });

  it('rules nothing out without a country', () => {
    expect(eligibility(remote('US'), undefined)).toBe('unclear');
  });

  it("reads the resume's country", () => {
    expect(resumeCountry({ basics: { location: { countryCode: 'au' } } })).toBe(
      'AU'
    );
    expect(resumeCountry({ basics: { location: { city: 'Cairns' } } })).toBe(
      undefined
    );
    expect(resumeCountry(null)).toBe(undefined);
  });
});
