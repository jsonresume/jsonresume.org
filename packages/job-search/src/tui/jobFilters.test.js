import { describe, it, expect } from 'vitest';
import {
  TABS,
  nextTab,
  filterJobsByQuery,
  computeCounts,
} from './jobFilters.js';

describe('nextTab', () => {
  it('cycles forward with wraparound', () => {
    expect(nextTab('all', 1)).toBe('new');
    expect(nextTab(TABS[TABS.length - 1], 1)).toBe('all');
  });
  it('cycles backward with wraparound', () => {
    expect(nextTab('all', -1)).toBe(TABS[TABS.length - 1]);
    expect(nextTab('new', -1)).toBe('all');
  });
});

describe('filterJobsByQuery', () => {
  const jobs = [
    { id: 1, title: 'React Dev', company: 'Acme', skills: [{ name: 'React' }] },
    { id: 2, title: 'Go Dev', company: 'Globex', skills: ['Golang'] },
    {
      id: 3,
      title: 'Designer',
      company: 'Initech',
      location: { city: 'Berlin', countryCode: 'DE' },
    },
  ];

  it('returns all jobs when query is empty', () => {
    expect(filterJobsByQuery(jobs, '')).toBe(jobs);
  });
  it('matches title case-insensitively', () => {
    expect(filterJobsByQuery(jobs, 'react').map((j) => j.id)).toEqual([1]);
  });
  it('matches object skills by name and string skills directly', () => {
    expect(filterJobsByQuery(jobs, 'golang').map((j) => j.id)).toEqual([2]);
    expect(filterJobsByQuery(jobs, 'React').map((j) => j.id)).toEqual([1]);
  });
  it('matches nested location fields (city and countryCode)', () => {
    expect(filterJobsByQuery(jobs, 'berlin').map((j) => j.id)).toEqual([3]);
    // countryCode 'DE' — use a non-substring-of-titles probe to isolate it
    const onlyHasCountry = [{ id: 7, location: { countryCode: 'NL' } }];
    expect(filterJobsByQuery(onlyHasCountry, 'nl').map((j) => j.id)).toEqual([
      7,
    ]);
  });
});

describe('computeCounts', () => {
  const none = () => null;
  it('counts all, states, new and reviewed', () => {
    const allJobs = [
      { id: 1 }, // new
      { id: 2, state: 'interested' },
      { id: 3, state: 'applied' },
      { id: 4, state: 'maybe' },
      { id: 5, state: 'not_interested' },
      { id: 6, has_dossier: true }, // reviewed (no state)
    ];
    const c = computeCounts(allJobs, none);
    expect(c.all).toBe(6);
    expect(c.new).toBe(1);
    expect(c.reviewed).toBe(1);
    expect(c.interested).toBe(1);
    expect(c.applied).toBe(1);
    expect(c.maybe).toBe(1);
    expect(c.passed).toBe(1);
  });

  it('treats a generating/done dossier status as not-new', () => {
    const allJobs = [{ id: 1 }, { id: 2 }];
    const status = (id) => (id === 1 ? 'generating' : 'done');
    const c = computeCounts(allJobs, status);
    expect(c.new).toBe(0);
    expect(c.reviewed).toBe(1); // id 2 done + no state
  });
});
