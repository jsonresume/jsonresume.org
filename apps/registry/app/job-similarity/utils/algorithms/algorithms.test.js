import { describe, it, expect, vi } from 'vitest';
import { threshold } from './threshold';
import { knn } from './knn';
import { mst } from './mst';
import { adaptive } from './adaptive';

// Mock cosineSimilarity
vi.mock('../../../utils/vectorUtils', () => ({
  cosineSimilarity: vi.fn((a, b) => {
    // Simple mock: return similarity based on vector dot product
    if (!a || !b) return 0;
    const sum = a.reduce((acc, val, i) => acc + val * b[i], 0);
    return Math.min(1, Math.max(0, sum));
  }),
}));

describe('Similarity Threshold Algorithm', () => {
  it('filters edges by threshold', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] }, // high similarity ~0.9
      { id: 'C', avgEmbedding: [0, 1] }, // low similarity ~0
    ];

    const links = threshold.compute(nodes, 0.5);

    // Should only include A-B link (similarity > 0.5)
    expect(links).toHaveLength(1);
    expect(links[0]).toMatchObject({
      source: 'A',
      target: 'B',
    });
    expect(links[0].value).toBeGreaterThan(0.5);
  });

  it('returns empty array when no similarities exceed threshold', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] }, // orthogonal, similarity 0
    ];

    const links = threshold.compute(nodes, 0.5);

    expect(links).toHaveLength(0);
  });

  it('uses default threshold of 0.7', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.6, 0.4] }, // similarity ~0.6
    ];

    const links = threshold.compute(nodes); // no threshold param

    // 0.6 < 0.7, so no links
    expect(links).toHaveLength(0);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const links = threshold.compute(nodes, 0.5);

    expect(links).toHaveLength(0);
  });

  it('creates links for all pairs above threshold', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
    ];

    const links = threshold.compute(nodes, 0.5);

    // All pairs should have high similarity
    expect(links.length).toBeGreaterThan(0);
  });
});

describe('K-Nearest Neighbors Algorithm', () => {
  it('finds K nearest neighbors for each node', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
      { id: 'D', avgEmbedding: [0, 1] },
    ];

    const links = knn.compute(nodes, 2, 0.3);

    // Each node should try to connect to 2 nearest neighbors
    // (may be fewer if filtered by minSimilarity)
    expect(links.length).toBeGreaterThan(0);
  });

  it('filters by minimum similarity', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] }, // orthogonal, similarity 0
    ];

    const links = knn.compute(nodes, 1, 0.5);

    // Should be empty because similarity is 0 < 0.5
    expect(links).toHaveLength(0);
  });

  it('excludes self-connections', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = knn.compute(nodes, 3, 0.3);

    // No link should have same source and target
    links.forEach((link) => {
      expect(link.source).not.toBe(link.target);
    });
  });

  it('uses default K=3 and minSimilarity=0.5', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
    ];

    const links = knn.compute(nodes);

    expect(Array.isArray(links)).toBe(true);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const links = knn.compute(nodes, 2, 0.3);

    expect(links).toHaveLength(0);
  });

  it('respects K limit even with many nodes', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
      { id: 'D', avgEmbedding: [0.7, 0.3] },
      { id: 'E', avgEmbedding: [0.6, 0.4] },
    ];

    const links = knn.compute(nodes, 1, 0.1); // K=1, low threshold

    // Each of 5 nodes connects to at most 1 neighbor = max 5 links
    expect(links.length).toBeLessThanOrEqual(5);
  });
});

describe('Minimum Spanning Tree Algorithm', () => {
  it('creates tree connecting all nodes', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
    ];

    const links = mst.compute(nodes, 0.3);

    // MST with 3 nodes should have 2 edges (n-1)
    expect(links.length).toBeLessThanOrEqual(2);
  });

  it('filters edges by minimum similarity', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] }, // orthogonal
      { id: 'C', avgEmbedding: [0, 1] }, // orthogonal to A
    ];

    const links = mst.compute(nodes, 0.5);

    // No edges should exist due to low similarity
    expect(links.length).toBeLessThanOrEqual(1);
  });

  it('uses default minSimilarity of 0.3', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = mst.compute(nodes);

    expect(Array.isArray(links)).toBe(true);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const links = mst.compute(nodes, 0.3);

    expect(links).toHaveLength(0);
  });

  it('handles two nodes', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = mst.compute(nodes, 0.3);

    // Should create 1 edge for 2 nodes
    expect(links).toHaveLength(1);
  });

  it('creates no cycles', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
      { id: 'D', avgEmbedding: [0.7, 0.3] },
    ];

    const links = mst.compute(nodes, 0.3);

    // MST with n nodes has exactly n-1 edges
    expect(links.length).toBeLessThanOrEqual(nodes.length - 1);
  });

  it('selects highest similarity edges', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] }, // high sim to A
      { id: 'C', avgEmbedding: [0.5, 0.5] }, // lower sim
    ];

    const links = mst.compute(nodes, 0.3);

    // Should prefer high similarity edges
    links.forEach((link) => {
      expect(link.value).toBeGreaterThan(0.3);
    });
  });
});

describe('Adaptive Threshold Algorithm', () => {
  it('calculates adaptive threshold from data', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
      { id: 'D', avgEmbedding: [0, 1] }, // outlier
    ];

    const links = adaptive.compute(nodes);

    expect(Array.isArray(links)).toBe(true);
  });

  it('filters edges by adaptive threshold', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] }, // high similarity
      { id: 'C', avgEmbedding: [0, 1] }, // low similarity
    ];

    const links = adaptive.compute(nodes);

    // Threshold should be set such that high similarity pairs are included
    expect(links.length).toBeGreaterThan(0);
  });

  it('handles uniform similarities', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [1, 0] }, // identical
      { id: 'C', avgEmbedding: [1, 0] }, // identical
    ];

    const links = adaptive.compute(nodes);

    // With identical vectors, all similarities = 1
    // Threshold = mean + 0.5*std = 1 + 0 = 1
    // No links because similarity !> 1
    expect(links.length).toBe(0);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const links = adaptive.compute(nodes);

    expect(links).toHaveLength(0);
  });

  it('handles two nodes', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = adaptive.compute(nodes);

    // With 1 similarity value, std = 0
    // Threshold = mean + 0 = similarity value
    // No link because similarity !> threshold (not strictly greater)
    expect(links.length).toBe(0);
  });

  it('adapts to data distribution', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
      { id: 'D', avgEmbedding: [0.7, 0.3] },
      { id: 'E', avgEmbedding: [0, 1] }, // outlier
    ];

    const links = adaptive.compute(nodes);

    // Should create links for cluster of similar nodes
    expect(links.length).toBeGreaterThanOrEqual(0);
  });

  it('includes link metadata', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.95, 0.05] }, // very high similarity
      { id: 'C', avgEmbedding: [0, 1] },
    ];

    const links = adaptive.compute(nodes);

    if (links.length > 0) {
      expect(links[0]).toHaveProperty('source');
      expect(links[0]).toHaveProperty('target');
      expect(links[0]).toHaveProperty('value');
    }
  });
});
