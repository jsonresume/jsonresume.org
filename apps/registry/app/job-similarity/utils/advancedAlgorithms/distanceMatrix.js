import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * Calculate distance matrix from node embeddings
 * @param {Array} nodes - Array of nodes with embeddings
 * @returns {Array} Distance matrix
 */
export function calculateDistanceMatrix(nodes) {
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

  return distances;
}

/**
 * Apply pathfinder network scaling to distance matrix
 * @param {Array} distances - Distance matrix
 * @param {number} r - Minkowski r parameter
 */
export function applyPathfinderScaling(distances, r) {
  const n = distances.length;

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
}

/**
 * Check if an edge is minimal in the pathfinder network
 * @param {number} i - Source node index
 * @param {number} j - Target node index
 * @param {Array} distances - Distance matrix
 * @param {number} r - Minkowski r parameter
 * @returns {boolean} True if edge is minimal
 */
export function isMinimalEdge(i, j, distances, r) {
  const n = distances.length;

  for (let k = 0; k < n; k++) {
    if (k !== i && k !== j) {
      const sum = Math.pow(
        Math.pow(distances[i][k], r) + Math.pow(distances[k][j], r),
        1 / r
      );
      if (Math.abs(sum - distances[i][j]) < 1e-10) {
        return false;
      }
    }
  }

  return true;
}
