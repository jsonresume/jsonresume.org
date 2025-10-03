import { DisjointSet } from './disjointSet';
import { calculatePairwiseEdges } from './edgeUtils';

/**
 * Maximum Spanning Tree algorithm using Kruskal's algorithm
 */
export const maxSpanningTree = {
  name: 'Maximum Spanning Tree',
  compute: (nodes, minSimilarity = 0.3) => {
    const edges = calculatePairwiseEdges(nodes, minSimilarity);

    // Sort edges by similarity in descending order
    edges.sort((a, b) => b.similarity - a.similarity);

    // Kruskal's algorithm for maximum spanning tree
    const disjointSet = new DisjointSet();

    const mstEdges = edges.filter((edge) => {
      const sourceRoot = disjointSet.find(edge.source);
      const targetRoot = disjointSet.find(edge.target);
      if (sourceRoot !== targetRoot) {
        disjointSet.union(edge.source, edge.target);
        return true;
      }
      return false;
    });

    return mstEdges;
  },
};
