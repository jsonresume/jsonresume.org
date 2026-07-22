import { describe, it, expect } from 'vitest';
import {
  tierOf,
  hasTierData,
  orderJobsByTier,
  buildTierRows,
  tierChip,
  computeDigest,
  formatDigest,
} from './tierHelpers.js';

describe('tierOf', () => {
  it('returns known tiers as-is', () => {
    expect(tierOf({ tier: 'strong' })).toBe('strong');
    expect(tierOf({ tier: 'good' })).toBe('good');
    expect(tierOf({ tier: 'stretch' })).toBe('stretch');
  });
  it('is defensive about missing/unknown tiers', () => {
    expect(tierOf({})).toBe('other');
    expect(tierOf({ tier: null })).toBe('other');
    expect(tierOf({ tier: 'amazing' })).toBe('other');
    expect(tierOf(null)).toBe('other');
  });
});

describe('hasTierData', () => {
  it('detects at least one tiered job', () => {
    expect(hasTierData([{ id: 1 }, { id: 2, tier: 'good' }])).toBe(true);
  });
  it('false for untiered lists, null tiers and non-arrays', () => {
    expect(hasTierData([{ id: 1 }, { id: 2, tier: null }])).toBe(false);
    expect(hasTierData([])).toBe(false);
    expect(hasTierData(undefined)).toBe(false);
  });
});

describe('orderJobsByTier', () => {
  it('returns the same reference when no tier data (pre-rerank/old server)', () => {
    const jobs = [{ id: 1 }, { id: 2 }];
    expect(orderJobsByTier(jobs)).toBe(jobs);
  });
  it('orders bands strong>good>stretch>other, server order within band', () => {
    const jobs = [
      { id: 1, tier: 'good' },
      { id: 2, tier: 'strong' },
      { id: 3 },
      { id: 4, tier: 'strong' },
      { id: 5, tier: 'stretch' },
      { id: 6, tier: 'good' },
    ];
    expect(orderJobsByTier(jobs).map((j) => j.id)).toEqual([2, 4, 1, 6, 5, 3]);
  });
});

describe('buildTierRows', () => {
  it('emits plain job rows with flat index === job index when no tiers', () => {
    const rows = buildTierRows([{ id: 1 }, { id: 2 }]);
    expect(rows).toEqual([
      { type: 'job', job: { id: 1 }, jobIndex: 0 },
      { type: 'job', job: { id: 2 }, jobIndex: 1 },
    ]);
  });
  it('inserts one labeled separator per band', () => {
    const jobs = orderJobsByTier([
      { id: 1, tier: 'strong' },
      { id: 2, tier: 'strong' },
      { id: 3, tier: 'stretch' },
      { id: 4 },
    ]);
    const rows = buildTierRows(jobs);
    expect(
      rows.map((r) => (r.type === 'separator' ? r.label : r.job.id))
    ).toEqual(['Strong matches', 1, 2, 'Stretch', 3, 'Other', 4]);
    expect(rows.filter((r) => r.type === 'job').map((r) => r.jobIndex)).toEqual(
      [0, 1, 2, 3]
    );
  });
});

describe('tierChip', () => {
  it('maps tiers to colored chips', () => {
    expect(tierChip('strong')).toEqual({
      char: 'S',
      color: 'green',
      dim: false,
    });
    expect(tierChip('good')).toEqual({ char: 'G', color: 'cyan', dim: false });
    expect(tierChip('stretch')).toEqual({
      char: 'T',
      color: 'yellow',
      dim: false,
    });
  });
  it('falls back to a dim dot', () => {
    expect(tierChip('other')).toEqual({
      char: '·',
      color: undefined,
      dim: true,
    });
    expect(tierChip(null)).toEqual({ char: '·', color: undefined, dim: true });
  });
});

describe('computeDigest / formatDigest', () => {
  const tiered = [
    { id: 1, tier: 'strong' },
    { id: 2, tier: 'strong' },
    { id: 3, tier: 'good' },
    { id: 4, tier: 'stretch' },
    { id: 5 },
  ];

  it('counts total, strong and good when tiers exist', () => {
    const d = computeDigest(tiered, new Set());
    expect(d).toMatchObject({ total: 5, strong: 2, good: 1, hasTiers: true });
    expect(formatDigest(d)).toBe('5 jobs · 2 strong · 1 good');
  });

  it('counts new jobs against last-seen ids (string/number safe)', () => {
    const d = computeDigest(tiered, new Set(['1', '2', '3']));
    expect(d.newCount).toBe(2);
    expect(formatDigest(d)).toBe(
      '5 jobs · 2 strong · 1 good · 2 new since last visit'
    );
  });

  it('reports 0 new on first ever visit (empty last-seen set)', () => {
    expect(computeDigest(tiered, new Set()).newCount).toBe(0);
    expect(computeDigest(tiered, undefined).newCount).toBe(0);
  });

  it('formats nothing without tiers or new jobs (falls back to current display)', () => {
    const plain = [{ id: 1 }, { id: 2 }];
    expect(formatDigest(computeDigest(plain, new Set(['1', '2'])))).toBe(null);
    expect(formatDigest(computeDigest([], new Set()))).toBe(null);
    expect(formatDigest(null)).toBe(null);
  });

  it('shows only the new count when tiers are absent', () => {
    const plain = [{ id: 1 }, { id: 2 }];
    expect(formatDigest(computeDigest(plain, new Set(['1'])))).toBe(
      '1 new since last visit'
    );
  });
});
