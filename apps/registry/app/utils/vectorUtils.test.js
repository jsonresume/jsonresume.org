import { describe, it, expect } from 'vitest';
import {
  cosineSimilarity,
  normalizeVector,
  getAverageEmbedding,
} from './vectorUtils';

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    const vector = [1, 2, 3];
    expect(cosineSimilarity(vector, vector)).toBe(1);
  });

  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });

  it('returns 0 for opposite vectors', () => {
    const result = cosineSimilarity([1, 2, 3], [-1, -2, -3]);
    expect(result).toBe(-1);
  });

  it('calculates similarity for simple vectors', () => {
    const result = cosineSimilarity([1, 1], [1, 0]);
    expect(result).toBeCloseTo(0.7071, 4); // 1/sqrt(2) ≈ 0.7071
  });

  it('returns 0 when vectors are not arrays', () => {
    expect(cosineSimilarity('not array', [1, 2])).toBe(0);
    expect(cosineSimilarity([1, 2], 'not array')).toBe(0);
  });

  it('returns 0 when vectors have different lengths', () => {
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
  });

  it('handles zero vectors', () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBeNaN();
  });

  it('handles negative values', () => {
    const result = cosineSimilarity([1, -1], [1, -1]);
    expect(result).toBeCloseTo(1, 10);
  });

  it('handles decimal values', () => {
    const result = cosineSimilarity([0.5, 0.5], [0.5, 0.5]);
    expect(result).toBeCloseTo(1, 10);
  });
});

describe('normalizeVector', () => {
  it('normalizes a simple vector to unit length', () => {
    const normalized = normalizeVector([3, 4]);
    expect(normalized).toEqual([0.6, 0.8]);
  });

  it('returns same vector when already normalized', () => {
    const input = [0.6, 0.8];
    const normalized = normalizeVector(input);
    expect(normalized[0]).toBeCloseTo(0.6, 10);
    expect(normalized[1]).toBeCloseTo(0.8, 10);
  });

  it('returns null for empty array', () => {
    expect(normalizeVector([])).toBeNull();
  });

  it('returns null for non-array input', () => {
    expect(normalizeVector('not array')).toBeNull();
    expect(normalizeVector(null)).toBeNull();
    expect(normalizeVector(undefined)).toBeNull();
  });

  it('returns null for zero vector', () => {
    expect(normalizeVector([0, 0, 0])).toBeNull();
  });

  it('handles single-element vector', () => {
    expect(normalizeVector([5])).toEqual([1]);
    expect(normalizeVector([-5])).toEqual([-1]);
  });

  it('normalizes vectors with negative values', () => {
    const normalized = normalizeVector([-3, 4]);
    expect(normalized[0]).toBeCloseTo(-0.6, 10);
    expect(normalized[1]).toBeCloseTo(0.8, 10);
  });

  it('normalizes high-dimensional vectors', () => {
    const normalized = normalizeVector([1, 1, 1, 1]);
    const magnitude = Math.sqrt(normalized.reduce((sum, v) => sum + v * v, 0));
    expect(magnitude).toBeCloseTo(1, 10);
  });
});

describe('getAverageEmbedding', () => {
  it('calculates average of two vectors', () => {
    const embeddings = [
      [1, 2, 3],
      [3, 4, 5],
    ];
    expect(getAverageEmbedding(embeddings)).toEqual([2, 3, 4]);
  });

  it('calculates average of three vectors', () => {
    const embeddings = [
      [1, 2],
      [2, 4],
      [3, 6],
    ];
    expect(getAverageEmbedding(embeddings)).toEqual([2, 4]);
  });

  it('returns same vector when only one embedding provided', () => {
    const embeddings = [[1, 2, 3]];
    expect(getAverageEmbedding(embeddings)).toEqual([1, 2, 3]);
  });

  it('returns null for empty array', () => {
    expect(getAverageEmbedding([])).toBeNull();
  });

  it('returns null for non-array input', () => {
    expect(getAverageEmbedding('not array')).toBeNull();
    expect(getAverageEmbedding(null)).toBeNull();
    expect(getAverageEmbedding(undefined)).toBeNull();
  });

  it('handles vectors with negative values', () => {
    const embeddings = [
      [1, -2],
      [-1, 2],
    ];
    expect(getAverageEmbedding(embeddings)).toEqual([0, 0]);
  });

  it('handles decimal values correctly', () => {
    const embeddings = [
      [1.5, 2.5],
      [2.5, 3.5],
    ];
    expect(getAverageEmbedding(embeddings)).toEqual([2, 3]);
  });

  it('handles high-dimensional embeddings', () => {
    const embeddings = [
      [1, 2, 3, 4, 5],
      [5, 4, 3, 2, 1],
    ];
    expect(getAverageEmbedding(embeddings)).toEqual([3, 3, 3, 3, 3]);
  });
});
