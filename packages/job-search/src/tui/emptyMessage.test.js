import { describe, it, expect } from 'vitest';
import { describeActiveFilters, buildEmptyMessage } from './emptyMessage.js';

describe('describeActiveFilters', () => {
  it('labels each known filter type', () => {
    expect(
      describeActiveFilters(
        [
          { type: 'remote', value: true },
          { type: 'globalRemote', value: true },
          { type: 'minSalary', value: 150 },
          { type: 'days', value: 14 },
          { type: 'search', value: 'rust' },
        ],
        ''
      )
    ).toEqual(['remote', 'global remote', 'min $150k', 'last 14d', "'rust'"]);
  });
  it('appends the inline find query and survives unknown types', () => {
    expect(describeActiveFilters([{ type: 'weird', value: 9 }], 'go')).toEqual([
      'weird: 9',
      "'go'",
    ]);
    expect(describeActiveFilters(null, '')).toEqual([]);
  });
});

describe('buildEmptyMessage', () => {
  it('builds the honest summary from filters + total', () => {
    expect(
      buildEmptyMessage({
        tab: 'all',
        filters: [
          { type: 'remote', value: true },
          { type: 'minSalary', value: 150 },
          { type: 'search', value: 'rust' },
        ],
        appliedQuery: '',
        totalCount: 143,
      })
    ).toEqual([
      "0 of 143 jobs match: remote + min $150k + 'rust'.",
      'Try removing a filter (f).',
    ]);
  });

  it('includes the tab name when not on the all tab', () => {
    const [summary] = buildEmptyMessage({
      tab: 'interested',
      filters: [{ type: 'remote', value: true }],
      appliedQuery: '',
      totalCount: 10,
    });
    expect(summary).toBe('0 of 10 jobs match: interested + remote.');
  });

  it('mentions clearing find when an inline query is active', () => {
    const [summary, hint] = buildEmptyMessage({
      tab: 'all',
      filters: [],
      appliedQuery: 'rust',
      totalCount: 143,
    });
    expect(summary).toBe("0 of 143 jobs match: 'rust'.");
    expect(hint).toBe('Try removing a filter (f) or clearing find (esc).');
  });

  it('returns null with no filters/query or unknown total (default message)', () => {
    expect(
      buildEmptyMessage({
        tab: 'all',
        filters: [],
        appliedQuery: '',
        totalCount: 5,
      })
    ).toBe(null);
    expect(
      buildEmptyMessage({
        tab: 'all',
        filters: [{ type: 'remote', value: true }],
        appliedQuery: '',
        totalCount: 0,
      })
    ).toBe(null);
  });
});
