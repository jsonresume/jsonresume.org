import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * Minimum Spanning Tree algorithm using Kruskal's algorithm
 */
export const mst = {
  name: 'Minimum Spanning Tree',
  compute: (nodes, minSimilarity = 0.3) => {
    const links = [];
    const parent = new Array(nodes.length).fill(0).map((_, i) => i);

    function find(x) {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function union(x, y) {
      parent[find(x)] = find(y);
    }

    // Create all possible edges with weights
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        if (similarity > minSimilarity) {
          edges.push({ i, j, similarity });
        }
      }
    }

    // Sort edges by similarity (descending)
    edges.sort((a, b) => b.similarity - a.similarity);

    // Build MST
    edges.forEach(({ i, j, similarity }) => {
      if (find(i) !== find(j)) {
        union(i, j);
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          value: similarity,
        });
      }
    });

    return links;
  },
};
