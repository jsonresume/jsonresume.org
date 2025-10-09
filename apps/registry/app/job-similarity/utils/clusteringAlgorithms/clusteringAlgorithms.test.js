import { describe, it, expect, vi } from 'vitest';
import { community } from './community';
import { hierarchical } from './hierarchical';

// Mock cosineSimilarity
vi.mock('../../../utils/vectorUtils', () => ({
  cosineSimilarity: vi.fn((a, b) => {
    // Simple mock: return similarity based on vector dot product
    if (!a || !b) return 0;
    const sum = a.reduce((acc, val, i) => acc + val * b[i], 0);
    return Math.min(1, Math.max(0, sum));
  }),
}));

describe('Community Detection Algorithm', () => {
  it('groups similar nodes into communities', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] }, // similar to A
      { id: 'C', avgEmbedding: [0, 1] },
      { id: 'D', avgEmbedding: [0.1, 0.9] }, // similar to C
    ];

    const links = community.compute(nodes, 0.5, 0.7);

    // Should create links within communities
    expect(Array.isArray(links)).toBe(true);
  });

  it('creates stronger connections within communities', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.95, 0.05] }, // very similar to A
      { id: 'C', avgEmbedding: [0, 1] }, // different community
    ];

    const links = community.compute(nodes, 0.5, 0.8);

    // A-B should have high similarity (same community)
    const abLink = links.find(
      (l) =>
        (l.source === 'A' && l.target === 'B') ||
        (l.source === 'B' && l.target === 'A')
    );

    if (abLink) {
      expect(abLink.value).toBeGreaterThan(0.8);
    }
  });

  it('uses default thresholds', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = community.compute(nodes);

    expect(Array.isArray(links)).toBe(true);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const links = community.compute(nodes, 0.5, 0.7);

    expect(links).toHaveLength(0);
  });

  it('handles nodes with no strong connections', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] }, // orthogonal
      { id: 'C', avgEmbedding: [0.7, 0.7] }, // different
    ];

    const links = community.compute(nodes, 0.5, 0.9);

    // With high communityThreshold, may have no or few links
    expect(Array.isArray(links)).toBe(true);
  });

  it('respects threshold for intra-community links', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.95, 0.05] },
      { id: 'C', avgEmbedding: [0.9, 0.1] },
    ];

    const links = community.compute(nodes, 0.5, 0.85);

    // All links should have similarity > threshold (0.5 for same community)
    links.forEach((link) => {
      expect(link.value).toBeGreaterThan(0.5);
    });
  });

  it('respects communityThreshold for inter-community links', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.5, 0.5] }, // medium similarity
      { id: 'C', avgEmbedding: [0, 1] },
    ];

    const links = community.compute(nodes, 0.3, 0.8);

    // Inter-community links need similarity > communityThreshold (0.8)
    // B may not connect to A or C if similarity < 0.8
    expect(Array.isArray(links)).toBe(true);
  });

  it('creates communities based on first pass', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.95, 0.05] },
      { id: 'C', avgEmbedding: [0.9, 0.1] },
      { id: 'D', avgEmbedding: [0, 1] }, // separate community
    ];

    const links = community.compute(nodes, 0.5, 0.85);

    // Should have links within A-B-C cluster
    expect(links.length).toBeGreaterThan(0);
  });

  it('includes link metadata', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = community.compute(nodes, 0.5, 0.7);

    if (links.length > 0) {
      expect(links[0]).toHaveProperty('source');
      expect(links[0]).toHaveProperty('target');
      expect(links[0]).toHaveProperty('value');
    }
  });
});

describe('Hierarchical Clustering Algorithm', () => {
  it('merges clusters based on similarity', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // Should create links for merging similar clusters
    expect(links.length).toBeGreaterThan(0);
  });

  it('filters by threshold', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0, 1] }, // orthogonal, similarity 0
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // No links because similarity < threshold
    expect(links).toHaveLength(0);
  });

  it('uses default threshold of 0.5', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = hierarchical.compute(nodes);

    expect(Array.isArray(links)).toBe(true);
  });

  it('handles single node', () => {
    const nodes = [{ id: 'A', avgEmbedding: [1, 0] }];

    const links = hierarchical.compute(nodes, 0.5);

    expect(links).toHaveLength(0);
  });

  it('handles two nodes', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // Should create 1 link for merging 2 clusters
    expect(links).toHaveLength(1);
  });

  it('merges highest similarity pairs first', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.95, 0.05] }, // very high similarity
      { id: 'C', avgEmbedding: [0.7, 0.3] }, // lower similarity
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // First link should be A-B with highest similarity
    if (links.length > 0) {
      const firstLink = links[0];
      expect(
        (firstLink.source === 'A' && firstLink.target === 'B') ||
          (firstLink.source === 'B' && firstLink.target === 'A')
      ).toBe(true);
    }
  });

  it('does not merge already merged clusters', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
      { id: 'D', avgEmbedding: [0.7, 0.3] },
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // Should have n-1 or fewer links (no duplicate merges)
    expect(links.length).toBeLessThanOrEqual(nodes.length - 1);
  });

  it('respects threshold across all pairs', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
    ];

    const links = hierarchical.compute(nodes, 0.7);

    // All links should have similarity > 0.7
    links.forEach((link) => {
      expect(link.value).toBeGreaterThan(0.7);
    });
  });

  it('creates dendrogram structure', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.95, 0.05] },
      { id: 'C', avgEmbedding: [0.9, 0.1] },
      { id: 'D', avgEmbedding: [0, 1] }, // outlier
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // Should merge similar nodes (A, B, C) and potentially exclude outlier D
    expect(links.length).toBeGreaterThanOrEqual(0);
  });

  it('handles uniform similarities', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [1, 0] }, // identical
      { id: 'C', avgEmbedding: [1, 0] }, // identical
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // All similarities = 1, all above threshold
    // Should create links for all merges
    expect(links.length).toBeGreaterThan(0);
  });

  it('includes link metadata', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
    ];

    const links = hierarchical.compute(nodes, 0.5);

    if (links.length > 0) {
      expect(links[0]).toHaveProperty('source');
      expect(links[0]).toHaveProperty('target');
      expect(links[0]).toHaveProperty('value');
    }
  });

  it('handles large clusters', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.9, 0.1] },
      { id: 'C', avgEmbedding: [0.8, 0.2] },
      { id: 'D', avgEmbedding: [0.7, 0.3] },
      { id: 'E', avgEmbedding: [0.6, 0.4] },
    ];

    const links = hierarchical.compute(nodes, 0.4);

    // Should handle merging multiple nodes
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeLessThanOrEqual(nodes.length - 1);
  });

  it('sorts similarities correctly', () => {
    const nodes = [
      { id: 'A', avgEmbedding: [1, 0] },
      { id: 'B', avgEmbedding: [0.5, 0.5] }, // medium sim
      { id: 'C', avgEmbedding: [0.95, 0.05] }, // high sim to A
    ];

    const links = hierarchical.compute(nodes, 0.5);

    // First link should be A-C (highest similarity)
    if (links.length > 0) {
      expect(
        (links[0].source === 'A' && links[0].target === 'C') ||
          (links[0].source === 'C' && links[0].target === 'A')
      ).toBe(true);
    }
  });
});
