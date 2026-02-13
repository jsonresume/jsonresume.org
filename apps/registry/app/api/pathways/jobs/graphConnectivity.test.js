import { describe, it, expect, vi } from 'vitest';
import { ensureConnectivity } from './graphConnectivity';

vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('ensureConnectivity', () => {
  const ROOT = 'root';

  function makeNodes(ids) {
    return [ROOT, ...ids].map((id) => ({ id }));
  }

  function makeEmbeddingLookup(ids) {
    const map = new Map();
    ids.forEach((id, i) => {
      const vec = new Array(3).fill(0);
      vec[i % 3] = 1; // simple distinct vectors
      map.set(id, vec);
    });
    return map;
  }

  it('returns 0 when all nodes are connected', () => {
    const nodes = makeNodes(['a', 'b', 'c']);
    const links = [
      { source: ROOT, target: 'a' },
      { source: 'a', target: 'b' },
      { source: 'b', target: 'c' },
    ];
    const embeddings = makeEmbeddingLookup(['a', 'b', 'c']);
    const rootEmb = [1, 0, 0];

    const orphanCount = ensureConnectivity(
      ROOT,
      nodes,
      links,
      embeddings,
      rootEmb
    );
    expect(orphanCount).toBe(0);
  });

  it('reconnects orphaned nodes to root', () => {
    const nodes = makeNodes(['a', 'b', 'orphan']);
    const links = [
      { source: ROOT, target: 'a' },
      { source: 'a', target: 'b' },
      // 'orphan' has no incoming links
    ];
    const embeddings = makeEmbeddingLookup(['a', 'b', 'orphan']);
    const rootEmb = [1, 0, 0];

    const orphanCount = ensureConnectivity(
      ROOT,
      nodes,
      links,
      embeddings,
      rootEmb
    );
    expect(orphanCount).toBe(1);

    // Verify link was added
    const orphanLink = links.find((l) => l.target === 'orphan');
    expect(orphanLink).toBeDefined();
    expect(orphanLink.source).toBe(ROOT);
    expect(typeof orphanLink.value).toBe('number');
  });

  it('reconnects multiple orphaned subgraphs', () => {
    const nodes = makeNodes(['a', 'orphan1', 'orphan2']);
    const links = [{ source: ROOT, target: 'a' }];
    const embeddings = makeEmbeddingLookup(['a', 'orphan1', 'orphan2']);
    const rootEmb = [1, 0, 0];

    const orphanCount = ensureConnectivity(
      ROOT,
      nodes,
      links,
      embeddings,
      rootEmb
    );
    expect(orphanCount).toBe(2);
    expect(links).toHaveLength(3); // original + 2 orphan links
  });

  it('reconnects orphan subtrees and marks children as reachable', () => {
    // orphan1 -> orphan1child should both become reachable after reconnecting orphan1
    const nodes = makeNodes(['a', 'orphan1', 'orphan1child']);
    const links = [
      { source: ROOT, target: 'a' },
      { source: 'orphan1', target: 'orphan1child' },
    ];
    const embeddings = makeEmbeddingLookup(['a', 'orphan1', 'orphan1child']);
    const rootEmb = [1, 0, 0];

    const orphanCount = ensureConnectivity(
      ROOT,
      nodes,
      links,
      embeddings,
      rootEmb
    );
    // Only orphan1 should need reconnection; orphan1child is reachable via orphan1
    expect(orphanCount).toBe(1);
  });

  it('handles empty graph (only root)', () => {
    const nodes = [{ id: ROOT }];
    const links = [];
    const embeddings = new Map();
    const rootEmb = [1, 0, 0];

    const orphanCount = ensureConnectivity(
      ROOT,
      nodes,
      links,
      embeddings,
      rootEmb
    );
    expect(orphanCount).toBe(0);
  });

  it('skips orphans without embeddings', () => {
    const nodes = makeNodes(['a', 'no_embedding']);
    const links = [{ source: ROOT, target: 'a' }];
    // Only 'a' has an embedding, 'no_embedding' does not
    const embeddings = new Map();
    embeddings.set('a', [1, 0, 0]);
    const rootEmb = [1, 0, 0];

    const orphanCount = ensureConnectivity(
      ROOT,
      nodes,
      links,
      embeddings,
      rootEmb
    );
    // no_embedding is orphaned but has no embedding, so it's skipped
    expect(orphanCount).toBe(0);
  });

  it('mutates the links array in place', () => {
    const nodes = makeNodes(['a', 'orphan']);
    const links = [{ source: ROOT, target: 'a' }];
    const originalRef = links;
    const embeddings = makeEmbeddingLookup(['a', 'orphan']);
    const rootEmb = [1, 0, 0];

    ensureConnectivity(ROOT, nodes, links, embeddings, rootEmb);
    // Should be the same array reference
    expect(links).toBe(originalRef);
    expect(links.length).toBeGreaterThan(1);
  });
});
