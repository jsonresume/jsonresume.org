import { describe, it, expect, beforeEach } from 'vitest';
import { DisjointSet } from './disjointSet';

describe('DisjointSet', () => {
  let ds;

  beforeEach(() => {
    ds = new DisjointSet();
  });

  describe('find', () => {
    it('initializes parent for new node', () => {
      const node = { id: 'A' };

      const root = ds.find(node);

      expect(root).toBe('A');
    });

    it('returns same root for same node', () => {
      const node = { id: 'A' };

      const root1 = ds.find(node);
      const root2 = ds.find(node);

      expect(root1).toBe(root2);
    });

    it('finds root after union', () => {
      const node1 = { id: 'A' };
      const node2 = { id: 'B' };

      ds.union(node1, node2);
      const root1 = ds.find(node1);
      const root2 = ds.find(node2);

      // Both should have same root after union
      expect(root1).toBe(root2);
    });

    it('applies path compression', () => {
      const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];

      // Chain: A -> B -> C
      ds.union(nodes[0], nodes[1]);
      ds.union(nodes[1], nodes[2]);

      const rootA = ds.find(nodes[0]);
      const rootB = ds.find(nodes[1]);
      const rootC = ds.find(nodes[2]);

      // All should have same root
      expect(rootA).toBe(rootB);
      expect(rootB).toBe(rootC);
    });

    it('handles multiple independent components', () => {
      const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];

      ds.union(nodes[0], nodes[1]); // Component 1: A-B
      ds.union(nodes[2], nodes[3]); // Component 2: C-D

      const rootAB1 = ds.find(nodes[0]);
      const rootAB2 = ds.find(nodes[1]);
      const rootCD1 = ds.find(nodes[2]);
      const rootCD2 = ds.find(nodes[3]);

      // A and B same component
      expect(rootAB1).toBe(rootAB2);
      // C and D same component
      expect(rootCD1).toBe(rootCD2);
      // A-B and C-D different components
      expect(rootAB1).not.toBe(rootCD1);
    });
  });

  describe('union', () => {
    it('connects two nodes', () => {
      const node1 = { id: 'A' };
      const node2 = { id: 'B' };

      ds.union(node1, node2);

      const root1 = ds.find(node1);
      const root2 = ds.find(node2);

      expect(root1).toBe(root2);
    });

    it('handles union of already connected nodes', () => {
      const node1 = { id: 'A' };
      const node2 = { id: 'B' };

      ds.union(node1, node2);
      ds.union(node1, node2); // Union again

      const root1 = ds.find(node1);
      const root2 = ds.find(node2);

      expect(root1).toBe(root2);
    });

    it('creates transitive connections', () => {
      const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];

      ds.union(nodes[0], nodes[1]); // A-B
      ds.union(nodes[1], nodes[2]); // B-C

      const rootA = ds.find(nodes[0]);
      const rootC = ds.find(nodes[2]);

      // A and C should be connected via B
      expect(rootA).toBe(rootC);
    });

    it('merges components', () => {
      const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];

      // Create two components
      ds.union(nodes[0], nodes[1]); // Component 1: A-B
      ds.union(nodes[2], nodes[3]); // Component 2: C-D

      // Merge components
      ds.union(nodes[1], nodes[2]); // Connect B-C

      // All should have same root now
      const roots = nodes.map((n) => ds.find(n));
      expect(new Set(roots).size).toBe(1);
    });

    it('handles union with self', () => {
      const node = { id: 'A' };

      ds.union(node, node);

      const root = ds.find(node);
      expect(root).toBe('A');
    });

    it('builds spanning tree structure', () => {
      const nodes = [
        { id: 'A' },
        { id: 'B' },
        { id: 'C' },
        { id: 'D' },
        { id: 'E' },
      ];

      // Star topology: A connected to all others
      nodes.slice(1).forEach((node) => {
        ds.union(nodes[0], node);
      });

      const roots = nodes.map((n) => ds.find(n));

      // All nodes should have same root
      expect(new Set(roots).size).toBe(1);
    });
  });

  describe('integration', () => {
    it('detects cycle in graph', () => {
      const edges = [
        { source: { id: 'A' }, target: { id: 'B' } },
        { source: { id: 'B' }, target: { id: 'C' } },
        { source: { id: 'C' }, target: { id: 'A' } }, // Creates cycle
      ];

      let hasCycle = false;

      for (const edge of edges) {
        const rootSource = ds.find(edge.source);
        const rootTarget = ds.find(edge.target);

        if (rootSource === rootTarget) {
          hasCycle = true;
          break;
        }

        ds.union(edge.source, edge.target);
      }

      expect(hasCycle).toBe(true);
    });

    it('counts connected components', () => {
      const nodes = [
        { id: 'A' },
        { id: 'B' },
        { id: 'C' },
        { id: 'D' },
        { id: 'E' },
      ];

      // Component 1: A-B-C
      ds.union(nodes[0], nodes[1]);
      ds.union(nodes[1], nodes[2]);

      // Component 2: D-E
      ds.union(nodes[3], nodes[4]);

      const roots = new Set(nodes.map((n) => ds.find(n)));

      expect(roots.size).toBe(2); // Two components
    });

    it('identifies minimum spanning tree edges', () => {
      const edges = [
        { source: { id: 'A' }, target: { id: 'B' }, weight: 1 },
        { source: { id: 'B' }, target: { id: 'C' }, weight: 2 },
        { source: { id: 'A' }, target: { id: 'C' }, weight: 3 },
      ];

      const mstEdges = [];

      // Kruskal's algorithm pattern
      edges.sort((a, b) => a.weight - b.weight);

      for (const edge of edges) {
        const rootSource = ds.find(edge.source);
        const rootTarget = ds.find(edge.target);

        if (rootSource !== rootTarget) {
          mstEdges.push(edge);
          ds.union(edge.source, edge.target);
        }
      }

      expect(mstEdges).toHaveLength(2); // MST has n-1 edges for n nodes
      expect(mstEdges[0].weight).toBe(1);
      expect(mstEdges[1].weight).toBe(2);
    });
  });
});
