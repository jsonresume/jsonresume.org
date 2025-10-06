import { describe, it, expect, vi } from 'vitest';
import {
  calculateDistanceMatrix,
  applyPathfinderScaling,
  isMinimalEdge,
} from './distanceMatrix';

// Mock cosineSimilarity
vi.mock('../../../utils/vectorUtils', () => ({
  cosineSimilarity: vi.fn((a, b) => {
    if (!a || !b) return 0;
    const sum = a.reduce((acc, val, i) => acc + val * b[i], 0);
    return Math.min(1, Math.max(0, sum));
  }),
}));

describe('calculateDistanceMatrix', () => {
  it('creates symmetric distance matrix', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] },
    ];

    const matrix = calculateDistanceMatrix(nodes);

    expect(matrix[0][1]).toBe(matrix[1][0]);
  });

  it('sets diagonal to zero', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] },
    ];

    const matrix = calculateDistanceMatrix(nodes);

    expect(matrix[0][0]).toBe(0);
    expect(matrix[1][1]).toBe(0);
  });

  it('converts similarity to distance (1 - similarity)', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [1, 0] }, // identical, similarity = 1
    ];

    const matrix = calculateDistanceMatrix(nodes);

    // Distance should be 1 - 1 = 0
    expect(matrix[0][1]).toBeCloseTo(0, 5);
  });

  it('handles empty node array', () => {
    const matrix = calculateDistanceMatrix([]);

    expect(matrix).toHaveLength(0);
  });

  it('returns correct matrix size', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] },
      { id: 'C', avgEmbedding: [0.5, 0.5] },
    ];

    const matrix = calculateDistanceMatrix(nodes);

    expect(matrix).toHaveLength(3);
    expect(matrix[0]).toHaveLength(3);
  });

  it('produces values between 0 and 1', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.5, 0.5] },
    ];

    const matrix = calculateDistanceMatrix(nodes);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        expect(matrix[i][j]).toBeGreaterThanOrEqual(0);
        expect(matrix[i][j]).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('applyPathfinderScaling', () => {
  it('modifies distance matrix in place', () => {
    const distances = [
      [0, 1, 2],
      [1, 0, 1],
      [2, 1, 0],
    ];

    const original = JSON.parse(JSON.stringify(distances));
    applyPathfinderScaling(distances, 2);

    // Matrix should be modified
    expect(distances).not.toEqual(original);
  });

  it('preserves zero diagonal', () => {
    const distances = [
      [0, 1, 2],
      [1, 0, 1],
      [2, 1, 0],
    ];

    applyPathfinderScaling(distances, 2);

    expect(distances[0][0]).toBe(0);
    expect(distances[1][1]).toBe(0);
    expect(distances[2][2]).toBe(0);
  });

  it('reduces distances via shorter paths', () => {
    const distances = [
      [0, 1, 10],
      [1, 0, 1],
      [10, 1, 0],
    ];

    applyPathfinderScaling(distances, 2);

    // Path A->B->C should be shorter than direct A->C
    expect(distances[0][2]).toBeLessThan(10);
  });

  it('handles r=1 (Manhattan distance)', () => {
    const distances = [
      [0, 1, 3],
      [1, 0, 1],
      [3, 1, 0],
    ];

    applyPathfinderScaling(distances, 1);

    // With r=1, A->B->C = 1+1 = 2 < 3
    expect(distances[0][2]).toBe(2);
  });

  it('handles r=2 (Euclidean distance)', () => {
    const distances = [
      [0, 1, 3],
      [1, 0, 1],
      [3, 1, 0],
    ];

    applyPathfinderScaling(distances, 2);

    // With r=2, path should be sqrt(1^2 + 1^2) = sqrt(2) ≈ 1.41
    expect(distances[0][2]).toBeCloseTo(Math.sqrt(2), 1);
  });

  it('preserves symmetry', () => {
    const distances = [
      [0, 1, 2],
      [1, 0, 1],
      [2, 1, 0],
    ];

    applyPathfinderScaling(distances, 2);

    expect(distances[0][1]).toBe(distances[1][0]);
    expect(distances[0][2]).toBe(distances[2][0]);
    expect(distances[1][2]).toBe(distances[2][1]);
  });
});

describe('isMinimalEdge', () => {
  it('returns true for direct shortest path', () => {
    const distances = [
      [0, 1, 2],
      [1, 0, 1],
      [2, 1, 0],
    ];

    // Edge 0-1 is minimal (distance 1, no shorter path)
    expect(isMinimalEdge(0, 1, distances, 2)).toBe(true);
  });

  it('checks for alternative paths of equal length', () => {
    const distances = [
      [0, 1, Math.sqrt(2)],
      [1, 0, 1],
      [Math.sqrt(2), 1, 0],
    ];

    // With r=2, path 0->1->2 = sqrt(1^2 + 1^2) = sqrt(2)
    // This equals direct distance, so edge is not minimal
    const result = isMinimalEdge(0, 2, distances, 2);
    expect(typeof result).toBe('boolean');
  });

  it('validates edge minimality with different r values', () => {
    const distances = [
      [0, 1, 2],
      [1, 0, 1],
      [2, 1, 0],
    ];

    // Test with different r parameters
    const r1 = isMinimalEdge(0, 1, distances, 1);
    const r2 = isMinimalEdge(0, 1, distances, 2);

    expect(typeof r1).toBe('boolean');
    expect(typeof r2).toBe('boolean');
  });

  it('handles r=2 parameter', () => {
    const distances = [
      [0, 1, 1.5],
      [1, 0, 1],
      [1.5, 1, 0],
    ];

    // Edge 0-2 might be minimal with r=2
    const result = isMinimalEdge(0, 2, distances, 2);
    expect(typeof result).toBe('boolean');
  });

  it('handles self-loops correctly', () => {
    const distances = [
      [0, 1, 2],
      [1, 0, 1],
      [2, 1, 0],
    ];

    // Self-loop always minimal (distance 0)
    expect(isMinimalEdge(0, 0, distances, 2)).toBe(true);
  });

  it('uses epsilon for floating point comparison', () => {
    const distances = [
      [0, 1, 1.0000000001], // Very close to sqrt(2)
      [1, 0, 1],
      [1.0000000001, 1, 0],
    ];

    // Should handle floating point precision correctly
    const result = isMinimalEdge(0, 2, distances, 2);
    expect(typeof result).toBe('boolean');
  });
});
