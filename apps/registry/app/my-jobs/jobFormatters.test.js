import { describe, it, expect } from 'vitest';
import { formatSalary, formatLocation, filterJobs } from './jobFormatters';

describe('formatSalary', () => {
  it('prefers salary_usd rendered as $Nk', () => {
    expect(formatSalary('whatever', 150000)).toBe('$150k');
  });

  it('falls back to the raw salary string', () => {
    expect(formatSalary('$120k-$140k', null)).toBe('$120k-$140k');
  });

  it('returns null when neither is present', () => {
    expect(formatSalary(null, null)).toBe(null);
  });
});

describe('formatLocation', () => {
  it('joins city, countryCode, and remote', () => {
    expect(formatLocation({ city: 'Berlin', countryCode: 'DE' }, 'Full')).toBe(
      'Berlin, DE, Full'
    );
  });

  it('omits missing parts', () => {
    expect(formatLocation({ city: 'Berlin' }, null)).toBe('Berlin');
  });

  it('returns null when empty', () => {
    expect(formatLocation({}, null)).toBe(null);
    expect(formatLocation(null, null)).toBe(null);
  });
});

describe('filterJobs', () => {
  const jobs = [
    { id: 1, state: 'interested', remote: 'Full' },
    { id: 2, state: 'applied', remote: 'No' },
    { id: 3, state: null, remote: 'Full' },
  ];

  it('returns all jobs for the "all" state filter', () => {
    expect(
      filterJobs(jobs, { stateFilter: 'all', remote: false })
    ).toHaveLength(3);
  });

  it('filters to unmarked jobs', () => {
    const out = filterJobs(jobs, { stateFilter: 'unmarked', remote: false });
    expect(out.map((j) => j.id)).toEqual([3]);
  });

  it('filters to a specific state', () => {
    const out = filterJobs(jobs, { stateFilter: 'applied', remote: false });
    expect(out.map((j) => j.id)).toEqual([2]);
  });

  it('filters remote-only (remote === "Full")', () => {
    const out = filterJobs(jobs, { stateFilter: 'all', remote: true });
    expect(out.map((j) => j.id)).toEqual([1, 3]);
  });

  it('handles a null job list', () => {
    expect(filterJobs(null, { stateFilter: 'all', remote: false })).toEqual([]);
  });
});
