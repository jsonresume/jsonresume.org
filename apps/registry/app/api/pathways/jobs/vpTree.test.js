import { describe, it, expect } from 'vitest';
import { VPTree } from './vpTree';

/**
 * Helper: create a normalized embedding vector from a sparse spec.
 * e.g., makeEmbedding(3, {0: 1}) => [1, 0, 0] (normalized)
 */
function makeEmbedding(dim, values = {}) {
  const vec = new Array(dim).fill(0);
  for (const [i, v] of Object.entries(values)) {
    vec[Number(i)] = v;
  }
  // Normalize
  let mag = 0;
  for (let i = 0; i < dim; i++) mag += vec[i] * vec[i];
  mag = Math.sqrt(mag);
  if (mag > 0) {
    for (let i = 0; i < dim; i++) vec[i] /= mag;
  }
  return vec;
}

function makePoints(specs) {
  return specs.map(([id, values]) => ({
    id,
    embedding: makeEmbedding(10, values),
  }));
}

describe('VPTree', () => {
  it('constructs from a list of points', () => {
    const points = makePoints([
      ['a', { 0: 1 }],
      ['b', { 1: 1 }],
      ['c', { 2: 1 }],
    ]);
    const tree = new VPTree(points);
    expect(tree.root).toBeDefined();
  });

  it('handles empty input', () => {
    const tree = new VPTree([]);
    expect(tree.root).toBeNull();
  });

  it('handles single point', () => {
    const points = makePoints([['only', { 0: 1 }]]);
    const tree = new VPTree(points);
    const results = tree.kNearest(makeEmbedding(10, { 0: 1 }), 1);
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('only');
    expect(results[0].similarity).toBeCloseTo(1, 5);
  });

  describe('kNearest', () => {
    it('finds exact match with similarity ~1', () => {
      const points = makePoints([
        ['a', { 0: 1 }],
        ['b', { 1: 1 }],
        ['c', { 2: 1 }],
        ['d', { 3: 1 }],
      ]);
      const tree = new VPTree(points);
      const query = makeEmbedding(10, { 0: 1 });
      const results = tree.kNearest(query, 1);

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('a');
      expect(results[0].similarity).toBeCloseTo(1, 5);
    });

    it('returns results sorted by similarity descending', () => {
      const points = makePoints([
        ['far', { 5: 1 }],
        ['close', { 0: 0.9, 1: 0.1 }],
        ['closest', { 0: 1 }],
        ['medium', { 0: 0.5, 2: 0.5 }],
      ]);
      const tree = new VPTree(points);
      const query = makeEmbedding(10, { 0: 1 });
      const results = tree.kNearest(query, 4);

      expect(results).toHaveLength(4);
      // Check descending order
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].similarity).toBeGreaterThanOrEqual(
          results[i].similarity
        );
      }
    });

    it('returns at most k results', () => {
      const points = makePoints([
        ['a', { 0: 1 }],
        ['b', { 1: 1 }],
        ['c', { 2: 1 }],
        ['d', { 3: 1 }],
        ['e', { 4: 1 }],
      ]);
      const tree = new VPTree(points);
      const query = makeEmbedding(10, { 0: 1 });
      const results = tree.kNearest(query, 3);
      expect(results).toHaveLength(3);
    });

    it('returns fewer than k if fewer points exist', () => {
      const points = makePoints([
        ['a', { 0: 1 }],
        ['b', { 1: 1 }],
      ]);
      const tree = new VPTree(points);
      const query = makeEmbedding(10, { 0: 1 });
      const results = tree.kNearest(query, 10);
      expect(results).toHaveLength(2);
    });

    it('filters by allowedIds when provided', () => {
      const points = makePoints([
        ['a', { 0: 1 }],
        ['b', { 0: 0.9, 1: 0.1 }],
        ['c', { 1: 1 }],
        ['d', { 2: 1 }],
      ]);
      const tree = new VPTree(points);
      const query = makeEmbedding(10, { 0: 1 });
      const allowed = new Set(['b', 'c', 'd']);
      const results = tree.kNearest(query, 2, allowed);

      expect(results).toHaveLength(2);
      // 'a' should NOT be in results despite being the closest
      expect(results.map((r) => r.id)).not.toContain('a');
      // 'b' should be in results (closest allowed)
      expect(results[0].id).toBe('b');
    });

    it('returns empty when allowedIds excludes all points', () => {
      const points = makePoints([
        ['a', { 0: 1 }],
        ['b', { 1: 1 }],
      ]);
      const tree = new VPTree(points);
      const query = makeEmbedding(10, { 0: 1 });
      const allowed = new Set(['nonexistent']);
      const results = tree.kNearest(query, 5, allowed);
      expect(results).toHaveLength(0);
    });

    it('handles larger datasets correctly', () => {
      // Create 100 random-ish points
      const points = [];
      for (let i = 0; i < 100; i++) {
        const embedding = new Array(10).fill(0).map(() => Math.random());
        // Normalize
        let mag = 0;
        for (const v of embedding) mag += v * v;
        mag = Math.sqrt(mag);
        for (let j = 0; j < embedding.length; j++) embedding[j] /= mag;
        points.push({ id: `point-${i}`, embedding });
      }
      const tree = new VPTree(points);
      const query = points[0].embedding; // use first point as query

      const results = tree.kNearest(query, 5);
      expect(results).toHaveLength(5);
      // The first result should be the exact point itself (similarity ~1)
      // Note: VPTree mutates the points array, so we can't guarantee points[0]
      // is still at index 0, but the exact match should have similarity ~1
      expect(results[0].similarity).toBeGreaterThan(0.9);
    });

    it('produces same results as brute force search', () => {
      // Deterministic seeded random to avoid flaky tests
      let seed = 42;
      const seededRandom = () => {
        seed = (seed * 16807 + 0) % 2147483647;
        return seed / 2147483647;
      };

      const dim = 10;
      const pointData = [];
      for (let i = 0; i < 50; i++) {
        const embedding = new Array(dim).fill(0).map(() => seededRandom());
        let mag = 0;
        for (const v of embedding) mag += v * v;
        mag = Math.sqrt(mag);
        for (let j = 0; j < dim; j++) embedding[j] /= mag;
        pointData.push({ id: `p${i}`, embedding });
      }

      const query = new Array(dim).fill(0).map(() => seededRandom());
      let mag = 0;
      for (const v of query) mag += v * v;
      mag = Math.sqrt(mag);
      for (let j = 0; j < dim; j++) query[j] /= mag;

      // Brute force
      const bruteForceSimilarities = pointData
        .map((p) => {
          let dot = 0;
          for (let i = 0; i < dim; i++) dot += p.embedding[i] * query[i];
          return { id: p.id, similarity: dot };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      // VPTree
      const tree = new VPTree([...pointData.map((p) => ({ ...p }))]);
      const vpResults = tree.kNearest(query, 5);

      // Compare top-5 results
      expect(vpResults).toHaveLength(5);
      for (let i = 0; i < 5; i++) {
        expect(vpResults[i].id).toBe(bruteForceSimilarities[i].id);
        expect(vpResults[i].similarity).toBeCloseTo(
          bruteForceSimilarities[i].similarity,
          5
        );
      }
    });
  });
});
