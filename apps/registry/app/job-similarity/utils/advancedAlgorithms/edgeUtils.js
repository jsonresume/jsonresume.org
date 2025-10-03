import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * Calculate pairwise similarities and create edges
 * @param {Array} nodes - Array of nodes with embeddings
 * @param {number} minSimilarity - Minimum similarity threshold
 * @returns {Array} Array of edges with source, target, similarity
 */
export function calculatePairwiseEdges(nodes, minSimilarity = 0.3) {
  const edges = [];
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
          similarity,
        });
      }
    }
  }
  return edges;
}

/**
 * Build adjacency matrix from nodes
 * @param {Array} nodes - Array of nodes
 * @param {number} minSimilarity - Minimum similarity threshold
 * @returns {Array} Adjacency matrix
 */
export function buildAdjacencyMatrix(nodes, minSimilarity) {
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

  return adj;
}
