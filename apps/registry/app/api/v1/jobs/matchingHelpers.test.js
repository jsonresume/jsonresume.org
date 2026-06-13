/**
 * Characterization tests for the pure vector / scoring helpers exported by
 * matchingHelpers.js. The async functions in this module (generateHydeEmbedding,
 * rerankJobs, matchJobs, getResumeEmbedding) hit OpenAI / Supabase and are not
 * unit-tested here — only the deterministic pure logic is covered.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  normalize,
  interpolate,
  subtractDirection,
  timeDecayScore,
  averageEmbeddings,
} from './matchingHelpers';

const mag = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));

describe('normalize', () => {
  it('scales a vector to unit length', () => {
    const out = normalize([3, 4]);
    expect(mag(out)).toBeCloseTo(1, 10);
    expect(out[0]).toBeCloseTo(0.6, 10);
    expect(out[1]).toBeCloseTo(0.8, 10);
  });

  it('already-unit vector stays unit length', () => {
    const out = normalize([1, 0, 0]);
    expect(out).toEqual([1, 0, 0]);
  });

  it('returns the zero vector unchanged (no divide-by-zero)', () => {
    const zero = [0, 0, 0];
    const out = normalize(zero);
    expect(out).toBe(zero); // returns same reference
    expect(out).toEqual([0, 0, 0]);
  });

  it('handles negative components and preserves direction', () => {
    const out = normalize([-3, -4]);
    expect(mag(out)).toBeCloseTo(1, 10);
    expect(out[0]).toBeLessThan(0);
    expect(out[1]).toBeLessThan(0);
  });

  it('normalizes a single-element vector to sign-only', () => {
    expect(normalize([5])).toEqual([1]);
    expect(normalize([-5])).toEqual([-1]);
  });

  it('does not mutate the input array', () => {
    const input = [3, 4];
    normalize(input);
    expect(input).toEqual([3, 4]);
  });
});

describe('interpolate', () => {
  it('alpha=1 returns normalized vecA direction', () => {
    const out = interpolate([3, 4], [0, 1], 1);
    expect(mag(out)).toBeCloseTo(1, 10);
    expect(out[0]).toBeCloseTo(0.6, 10);
    expect(out[1]).toBeCloseTo(0.8, 10);
  });

  it('alpha=0 returns normalized vecB direction', () => {
    const out = interpolate([3, 4], [0, 5], 0);
    expect(out).toEqual([0, 1]);
  });

  it('output is always unit length for a blend', () => {
    const out = interpolate([1, 0], [0, 1], 0.5);
    expect(mag(out)).toBeCloseTo(1, 10);
    // 0.5 of each then normalized => equal components
    expect(out[0]).toBeCloseTo(out[1], 10);
  });

  it('blends proportionally before normalizing', () => {
    // alpha 0.75 of [1,0] + 0.25 of [0,1] => [0.75, 0.25] normalized
    const out = interpolate([1, 0], [0, 1], 0.75);
    const expectedMag = Math.sqrt(0.75 * 0.75 + 0.25 * 0.25);
    expect(out[0]).toBeCloseTo(0.75 / expectedMag, 10);
    expect(out[1]).toBeCloseTo(0.25 / expectedMag, 10);
  });

  it('does not mutate inputs', () => {
    const a = [1, 2];
    const b = [3, 4];
    interpolate(a, b, 0.5);
    expect(a).toEqual([1, 2]);
    expect(b).toEqual([3, 4]);
  });
});

describe('subtractDirection', () => {
  it('moves the vector away from the negative direction', () => {
    // base pointing +x, subtract a +x negative direction => still +x but unit
    const out = subtractDirection([1, 0], [1, 0], 0.15);
    expect(mag(out)).toBeCloseTo(1, 10);
    expect(out[0]).toBeCloseTo(1, 10);
  });

  it('default weight is 0.15', () => {
    const explicit = subtractDirection([1, 0], [0, 1], 0.15);
    const defaulted = subtractDirection([1, 0], [0, 1]);
    expect(defaulted).toEqual(explicit);
  });

  it('larger weight pushes further from the negative vector', () => {
    const small = subtractDirection([1, 0], [0, 1], 0.1);
    const large = subtractDirection([1, 0], [0, 1], 0.5);
    // negative y component grows with weight
    expect(large[1]).toBeLessThan(small[1]);
    expect(mag(large)).toBeCloseTo(1, 10);
  });

  it('result is unit length', () => {
    const out = subtractDirection([2, 3, 6], [1, 1, 1], 0.2);
    expect(mag(out)).toBeCloseTo(1, 10);
  });

  it('does not mutate inputs', () => {
    const v = [1, 0];
    const n = [0, 1];
    subtractDirection(v, n);
    expect(v).toEqual([1, 0]);
    expect(n).toEqual([0, 1]);
  });
});

describe('timeDecayScore', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the raw similarity when postedAt is missing', () => {
    expect(timeDecayScore(0.7, null)).toBe(0.7);
    expect(timeDecayScore(0.42, undefined)).toBe(0.42);
  });

  it('a job posted right now gets the full recency boost', () => {
    vi.useFakeTimers();
    const now = new Date('2026-01-01T00:00:00Z');
    vi.setSystemTime(now);
    // recencyBoost = 0.5^0 = 1 => 0.85*sim + 0.15*1
    const out = timeDecayScore(0.5, now.toISOString());
    expect(out).toBeCloseTo(0.85 * 0.5 + 0.15 * 1, 10);
  });

  it('halves the recency boost after one half-life (14 days)', () => {
    vi.useFakeTimers();
    const now = new Date('2026-01-15T00:00:00Z');
    vi.setSystemTime(now);
    const posted = new Date('2026-01-01T00:00:00Z'); // 14 days earlier
    const out = timeDecayScore(0.5, posted.toISOString());
    // recencyBoost = 0.5^1 = 0.5
    expect(out).toBeCloseTo(0.85 * 0.5 + 0.15 * 0.5, 6);
  });

  it('older jobs decay toward 0.85*similarity', () => {
    vi.useFakeTimers();
    const now = new Date('2026-06-01T00:00:00Z');
    vi.setSystemTime(now);
    const posted = new Date('2025-06-01T00:00:00Z'); // ~1 year old
    const out = timeDecayScore(0.6, posted.toISOString());
    expect(out).toBeGreaterThan(0.85 * 0.6 - 0.001);
    expect(out).toBeLessThan(0.85 * 0.6 + 0.01);
  });

  it('recent jobs score higher than identical-similarity old jobs', () => {
    vi.useFakeTimers();
    const now = new Date('2026-06-01T00:00:00Z');
    vi.setSystemTime(now);
    const recent = new Date('2026-05-30T00:00:00Z').toISOString();
    const old = new Date('2026-01-01T00:00:00Z').toISOString();
    expect(timeDecayScore(0.5, recent)).toBeGreaterThan(
      timeDecayScore(0.5, old)
    );
  });
});

describe('averageEmbeddings', () => {
  it('returns null for an empty list', () => {
    expect(averageEmbeddings([])).toBeNull();
  });

  it('averages then normalizes a single embedding to unit length', () => {
    const out = averageEmbeddings([[3, 4]]);
    expect(mag(out)).toBeCloseTo(1, 10);
    expect(out[0]).toBeCloseTo(0.6, 10);
  });

  it('averages component-wise across multiple embeddings before normalizing', () => {
    // average of [1,0] and [0,1] is [0.5,0.5] -> normalized equal components
    const out = averageEmbeddings([
      [1, 0],
      [0, 1],
    ]);
    expect(out[0]).toBeCloseTo(out[1], 10);
    expect(mag(out)).toBeCloseTo(1, 10);
  });

  it('opposing vectors average to the zero vector and stay zero', () => {
    const out = averageEmbeddings([
      [1, 0],
      [-1, 0],
    ]);
    expect(out).toEqual([0, 0]);
  });

  it('does not mutate the input embeddings', () => {
    const a = [1, 2];
    const b = [3, 4];
    averageEmbeddings([a, b]);
    expect(a).toEqual([1, 2]);
    expect(b).toEqual([3, 4]);
  });
});
