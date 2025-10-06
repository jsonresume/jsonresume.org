import { describe, it, expect } from 'vitest';
import { bronKerbosch } from './bronKerbosch';

describe('bronKerbosch', () => {
  it('finds triangle clique', () => {
    // Triangle: 0-1-2 all connected
    const adj = [
      [false, true, true], // 0 connected to 1, 2
      [true, false, true], // 1 connected to 0, 2
      [true, true, false], // 2 connected to 0, 1
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2], [], adj, cliques);

    expect(cliques).toHaveLength(1);
    expect(cliques[0]).toHaveLength(3);
    expect(cliques[0].sort()).toEqual([0, 1, 2]);
  });

  it('finds multiple cliques', () => {
    // Two triangles: 0-1-2 and 2-3-4
    const adj = [
      [false, true, true, false, false], // 0: 1,2
      [true, false, true, false, false], // 1: 0,2
      [true, true, false, true, true], // 2: 0,1,3,4
      [false, false, true, false, true], // 3: 2,4
      [false, false, true, true, false], // 4: 2,3
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2, 3, 4], [], adj, cliques);

    expect(cliques.length).toBeGreaterThan(0);
  });

  it('ignores cliques smaller than size 3', () => {
    // Just an edge: 0-1
    const adj = [
      [false, true], // 0 connected to 1
      [true, false], // 1 connected to 0
    ];

    const cliques = [];
    bronKerbosch([], [0, 1], [], adj, cliques);

    expect(cliques).toHaveLength(0); // Edges (size 2) are ignored
  });

  it('finds 4-clique', () => {
    // Complete graph K4: all 4 nodes connected
    const adj = [
      [false, true, true, true],
      [true, false, true, true],
      [true, true, false, true],
      [true, true, true, false],
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2, 3], [], adj, cliques);

    expect(cliques).toHaveLength(1);
    expect(cliques[0]).toHaveLength(4);
  });

  it('finds no cliques in disconnected graph', () => {
    // No connections
    const adj = [
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2], [], adj, cliques);

    expect(cliques).toHaveLength(0);
  });

  it('handles empty candidate set', () => {
    const adj = [[false]];
    const cliques = [];
    bronKerbosch([], [], [], adj, cliques);

    expect(cliques).toHaveLength(0);
  });

  it('finds maximal cliques in complex graph', () => {
    // Graph with overlapping triangles
    const adj = [
      [false, true, true, false], // 0: 1,2
      [true, false, true, true], // 1: 0,2,3
      [true, true, false, true], // 2: 0,1,3
      [false, true, true, false], // 3: 1,2
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2, 3], [], adj, cliques);

    // Should find triangles or larger cliques
    expect(cliques.length).toBeGreaterThan(0);
    cliques.forEach((clique) => {
      expect(clique.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('uses pivot strategy', () => {
    // Graph where pivot optimization matters
    const adj = [
      [false, true, true, true, true],
      [true, false, false, false, false],
      [true, false, false, false, false],
      [true, false, false, false, false],
      [true, false, false, false, false],
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2, 3, 4], [], adj, cliques);

    // Star graph: only node 0 connected to all others
    // No cliques of size 3+
    expect(cliques).toHaveLength(0);
  });

  it('modifies cliques array in place', () => {
    const adj = [
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ];

    const cliques = [];
    const originalRef = cliques;

    bronKerbosch([], [0, 1, 2], [], adj, cliques);

    expect(cliques).toBe(originalRef); // Same reference
    expect(cliques.length).toBeGreaterThan(0);
  });

  it('finds disjoint cliques', () => {
    // Two separate triangles with no connection
    const adj = [
      [false, true, true, false, false, false], // Triangle 1: 0-1-2
      [true, false, true, false, false, false],
      [true, true, false, false, false, false],
      [false, false, false, false, true, true], // Triangle 2: 3-4-5
      [false, false, false, true, false, true],
      [false, false, false, true, true, false],
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2, 3, 4, 5], [], adj, cliques);

    expect(cliques).toHaveLength(2);
    expect(cliques[0]).toHaveLength(3);
    expect(cliques[1]).toHaveLength(3);
  });

  it('handles symmetric adjacency matrix requirement', () => {
    const adj = [
      [false, true, true],
      [true, false, true],
      [true, true, false],
    ];

    // Verify symmetry
    for (let i = 0; i < adj.length; i++) {
      for (let j = 0; j < adj.length; j++) {
        expect(adj[i][j]).toBe(adj[j][i]);
      }
    }

    const cliques = [];
    bronKerbosch([], [0, 1, 2], [], adj, cliques);

    expect(cliques).toHaveLength(1);
  });

  it('finds cliques in dense graph', () => {
    // K5 - complete graph with 5 nodes
    const adj = [
      [false, true, true, true, true],
      [true, false, true, true, true],
      [true, true, false, true, true],
      [true, true, true, false, true],
      [true, true, true, true, false],
    ];

    const cliques = [];
    bronKerbosch([], [0, 1, 2, 3, 4], [], adj, cliques);

    // K5 has one maximal clique of size 5
    expect(cliques).toHaveLength(1);
    expect(cliques[0]).toHaveLength(5);
  });
});
