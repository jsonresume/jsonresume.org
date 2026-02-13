import { describe, it, expect } from 'vitest';
import { dotProduct, normalizeInPlace, preNormalizeAll } from './vectorOps';

describe('vectorOps', () => {
  describe('dotProduct', () => {
    it('computes dot product of two vectors', () => {
      expect(dotProduct([1, 2, 3], [4, 5, 6])).toBe(32); // 1*4 + 2*5 + 3*6
    });

    it('returns 0 for orthogonal vectors', () => {
      expect(dotProduct([1, 0], [0, 1])).toBe(0);
    });

    it('returns 1 for identical unit vectors', () => {
      const v = [1 / Math.sqrt(2), 1 / Math.sqrt(2)];
      expect(dotProduct(v, v)).toBeCloseTo(1, 10);
    });

    it('handles negative values', () => {
      expect(dotProduct([-1, 2], [3, -4])).toBe(-11);
    });

    it('handles single-element vectors', () => {
      expect(dotProduct([5], [3])).toBe(15);
    });

    it('handles empty vectors', () => {
      expect(dotProduct([], [])).toBe(0);
    });

    it('handles high-dimensional vectors (3072-dim like embeddings)', () => {
      const a = new Array(3072).fill(1 / Math.sqrt(3072));
      const b = new Array(3072).fill(1 / Math.sqrt(3072));
      expect(dotProduct(a, b)).toBeCloseTo(1, 5);
    });
  });

  describe('normalizeInPlace', () => {
    it('normalizes a vector to unit length', () => {
      const vec = [3, 4];
      normalizeInPlace(vec);
      expect(vec[0]).toBeCloseTo(0.6);
      expect(vec[1]).toBeCloseTo(0.8);
      // Verify unit length
      expect(dotProduct(vec, vec)).toBeCloseTo(1, 10);
    });

    it('returns the magnitude', () => {
      const vec = [3, 4];
      const mag = normalizeInPlace(vec);
      expect(mag).toBeCloseTo(5);
    });

    it('handles zero vector gracefully', () => {
      const vec = [0, 0, 0];
      const mag = normalizeInPlace(vec);
      expect(mag).toBe(0);
      expect(vec).toEqual([0, 0, 0]);
    });

    it('normalizes already-unit vector', () => {
      const vec = [1, 0, 0];
      const mag = normalizeInPlace(vec);
      expect(mag).toBeCloseTo(1);
      expect(vec[0]).toBeCloseTo(1);
    });

    it('mutates the original array', () => {
      const vec = [10, 0];
      normalizeInPlace(vec);
      expect(vec[0]).toBeCloseTo(1);
      expect(vec[1]).toBeCloseTo(0);
    });
  });

  describe('preNormalizeAll', () => {
    it('normalizes all vectors in a Map', () => {
      const map = new Map();
      map.set('a', [3, 4]);
      map.set('b', [0, 5]);

      preNormalizeAll(map);

      const a = map.get('a');
      const b = map.get('b');
      expect(dotProduct(a, a)).toBeCloseTo(1, 10);
      expect(dotProduct(b, b)).toBeCloseTo(1, 10);
    });

    it('handles empty map', () => {
      const map = new Map();
      preNormalizeAll(map);
      expect(map.size).toBe(0);
    });

    it('preserves map keys after normalization', () => {
      const map = new Map();
      map.set('id1', [1, 0]);
      map.set('id2', [0, 1]);
      preNormalizeAll(map);
      expect(map.has('id1')).toBe(true);
      expect(map.has('id2')).toBe(true);
    });

    it('after normalization, dot product equals cosine similarity', () => {
      const map = new Map();
      map.set('a', [1, 1]);
      map.set('b', [1, 0]);
      preNormalizeAll(map);

      const similarity = dotProduct(map.get('a'), map.get('b'));
      // cos(45 degrees) = 1/sqrt(2) ≈ 0.7071
      expect(similarity).toBeCloseTo(1 / Math.sqrt(2), 5);
    });
  });
});
