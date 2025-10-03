import { cosineSimilarity } from '../../utils/vectorUtils';

/**
 * Maximum Spanning Tree algorithm
 */
export const maxSpanningTree = {
  name: 'Maximum Spanning Tree',
  compute: (nodes, minSimilarity = 0.3) => {
    const edges = [];
    // Calculate all pairwise similarities
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        if (similarity >= minSimilarity) {
          edges.push({
            source: nodes[i],
            target: nodes[j],
            similarity: similarity,
          });
        }
      }
    }

    // Sort edges by similarity in descending order
    edges.sort((a, b) => b.similarity - a.similarity);

    // Kruskal's algorithm for maximum spanning tree
    const disjointSet = new Map();
    const find = (node) => {
      if (!disjointSet.has(node.id)) {
        disjointSet.set(node.id, node.id);
      }
      if (disjointSet.get(node.id) !== node.id) {
        disjointSet.set(node.id, find({ id: disjointSet.get(node.id) }));
      }
      return disjointSet.get(node.id);
    };

    const union = (node1, node2) => {
      const root1 = find(node1);
      const root2 = find(node2);
      if (root1 !== root2) {
        disjointSet.set(root1, root2);
      }
    };

    const mstEdges = edges.filter((edge) => {
      const sourceRoot = find(edge.source);
      const targetRoot = find(edge.target);
      if (sourceRoot !== targetRoot) {
        union(edge.source, edge.target);
        return true;
      }
      return false;
    });

    return mstEdges;
  },
};

/**
 * Maximum Cliques algorithm using Bron-Kerbosch
 */
export const clique = {
  name: 'Maximum Cliques',
  compute: (nodes, minSimilarity = 0.6) => {
    // Build adjacency matrix
    const n = nodes.length;
    const adj = Array(n)
      .fill()
      .map(() => Array(n).fill(false));

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        if (similarity >= minSimilarity) {
          adj[i][j] = adj[j][i] = true;
        }
      }
    }

    // Find maximal cliques using Bron-Kerbosch algorithm
    const cliques = [];
    const bronKerbosch = (r, p, x) => {
      if (p.length === 0 && x.length === 0) {
        if (r.length >= 3) {
          // Only consider cliques of size 3 or larger
          cliques.push([...r]);
        }
        return;
      }

      const pivot = [...p, ...x][0];
      const candidates = p.filter((v) => !adj[pivot][v]);

      for (const v of candidates) {
        const newR = [...r, v];
        const newP = p.filter((u) => adj[v][u]);
        const newX = x.filter((u) => adj[v][u]);
        bronKerbosch(newR, newP, newX);
        p = p.filter((u) => u !== v);
        x.push(v);
      }
    };

    const vertices = Array.from({ length: n }, (_, i) => i);
    bronKerbosch([], vertices, []);

    // Convert cliques to edges
    const edges = [];
    for (const clique of cliques) {
      for (let i = 0; i < clique.length; i++) {
        for (let j = i + 1; j < clique.length; j++) {
          const similarity = cosineSimilarity(
            nodes[clique[i]].avgEmbedding,
            nodes[clique[j]].avgEmbedding
          );
          edges.push({
            source: nodes[clique[i]],
            target: nodes[clique[j]],
            similarity,
          });
        }
      }
    }

    return edges;
  },
};

/**
 * Pathfinder Network algorithm
 */
export const pathfinder = {
  name: 'Pathfinder Network',
  compute: (nodes, r = 2) => {
    const n = nodes.length;
    const distances = Array(n)
      .fill()
      .map(() => Array(n).fill(Infinity));

    // Calculate initial distances
    for (let i = 0; i < n; i++) {
      distances[i][i] = 0;
      for (let j = i + 1; j < n; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        // Convert similarity to distance (1 - similarity)
        const distance = 1 - similarity;
        distances[i][j] = distances[j][i] = distance;
      }
    }

    // Pathfinder network scaling
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const sum = Math.pow(
            Math.pow(distances[i][k], r) + Math.pow(distances[k][j], r),
            1 / r
          );
          if (sum < distances[i][j]) {
            distances[i][j] = sum;
          }
        }
      }
    }

    // Generate edges for the minimal network
    const edges = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let isMinimal = true;
        for (let k = 0; k < n; k++) {
          if (k !== i && k !== j) {
            const sum = Math.pow(
              Math.pow(distances[i][k], r) + Math.pow(distances[k][j], r),
              1 / r
            );
            if (Math.abs(sum - distances[i][j]) < 1e-10) {
              isMinimal = false;
              break;
            }
          }
        }
        if (isMinimal) {
          const similarity = 1 - distances[i][j];
          if (similarity > 0.3) {
            // Only include edges with reasonable similarity
            edges.push({
              source: nodes[i],
              target: nodes[j],
              similarity,
            });
          }
        }
      }
    }

    return edges;
  },
};

export const advancedAlgorithms = {
  maxSpanningTree,
  clique,
  pathfinder,
};
