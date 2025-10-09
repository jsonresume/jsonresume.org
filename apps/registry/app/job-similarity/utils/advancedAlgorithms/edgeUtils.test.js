import { describe, it, expect, vi } from 'vitest';
import { calculatePairwiseEdges, buildAdjacencyMatrix } from './edgeUtils';

// Mock cosineSimilarity
vi.mock('../../../utils/vectorUtils', () => ({
  cosineSimilarity: vi.fn((a, b) => {
    // Simple mock: return similarity based on vector comparison
    if (!a || !b) return 0;
    const sum = a.reduce((acc, val, i) => acc + val * b[i], 0);
    return Math.min(1, Math.max(0, sum));
  }),
}));

describe('calculatePairwiseEdges', () => {
  it('calculates edges between nodes above threshold', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0, 0] },
      { id: 'B', avgEmbedding: [0.8, 0.2, 0] }, // similarity ~0.8
      { id: 'C', avgEmbedding: [0, 1, 0] }, // low similarity to A
    ];

    const edges = calculatePairwiseEdges(nodes, 0.5);

    expect(edges.length).toBeGreaterThan(0);
    expect(edges[0]).toHaveProperty('source');
    expect(edges[0]).toHaveProperty('target');
    expect(edges[0]).toHaveProperty('similarity');
  });

  it('filters edges below minimum similarity', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] }, // orthogonal, similarity 0
    ];

    const edges = calculatePairwiseEdges(nodes, 0.5);

    expect(edges).toHaveLength(0);
  });

  it('handles empty node array', () => {
    const edges = calculatePairwiseEdges([], 0.5);

    expect(edges).toHaveLength(0);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const edges = calculatePairwiseEdges(nodes, 0.5);

    expect(edges).toHaveLength(0);
  });

  it('uses custom similarity threshold', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.6, 0.4] },
    ];

    const lowThreshold = calculatePairwiseEdges(nodes, 0.3);
    const highThreshold = calculatePairwiseEdges(nodes, 0.9);

    expect(lowThreshold.length).toBeGreaterThanOrEqual(highThreshold.length);
  });

  it('creates edges in both directions (source/target pairs)', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const edges = calculatePairwiseEdges(nodes, 0.5);

    if (edges.length > 0) {
      expect(edges[0].source).toBe(nodes[0]);
      expect(edges[0].target).toBe(nodes[1]);
    }
  });

  it('does not create duplicate edges', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
    ];

    const edges = calculatePairwiseEdges(nodes, 0.5);

    // n*(n-1)/2 max possible edges for n nodes
    expect(edges.length).toBeLessThanOrEqual(
      (nodes.length * (nodes.length - 1)) / 2
    );
  });
});

describe('buildAdjacencyMatrix', () => {
  it('builds symmetric adjacency matrix', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const matrix = buildAdjacencyMatrix(nodes, 0.5);

    // Matrix should be symmetric
    expect(matrix[0][1]).toBe(matrix[1][0]);
  });

  it('returns correct matrix size', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] },
      { id: 'C', avgEmbedding: [0.5, 0.5] },
    ];

    const matrix = buildAdjacencyMatrix(nodes, 0.3);

    expect(matrix).toHaveLength(3);
    expect(matrix[0]).toHaveLength(3);
  });

  it('sets diagonal to false', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] },
    ];

    const matrix = buildAdjacencyMatrix(nodes, 0.3);

    expect(matrix[0][0]).toBe(false);
    expect(matrix[1][1]).toBe(false);
  });

  it('marks edges above threshold as true', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] }, // high similarity
    ];

    const matrix = buildAdjacencyMatrix(nodes, 0.5);

    expect(matrix[0][1]).toBe(true);
    expect(matrix[1][0]).toBe(true);
  });

  it('marks edges below threshold as false', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] }, // orthogonal, similarity 0
    ];

    const matrix = buildAdjacencyMatrix(nodes, 0.5);

    expect(matrix[0][1]).toBe(false);
    expect(matrix[1][0]).toBe(false);
  });

  it('handles empty node array', () => {
    const matrix = buildAdjacencyMatrix([], 0.5);

    expect(matrix).toHaveLength(0);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const matrix = buildAdjacencyMatrix(nodes, 0.5);

    expect(matrix).toHaveLength(1);
    expect(matrix[0]).toHaveLength(1);
    expect(matrix[0][0]).toBe(false);
  });
});
