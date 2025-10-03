import {
  calculateDistanceMatrix,
  applyPathfinderScaling,
  isMinimalEdge,
} from './distanceMatrix';

/**
 * Pathfinder Network algorithm
 */
export const pathfinder = {
  name: 'Pathfinder Network',
  compute: (nodes, r = 2) => {
    const distances = calculateDistanceMatrix(nodes);
    applyPathfinderScaling(distances, r);

    // Generate edges for the minimal network
    const edges = [];
    const n = nodes.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (isMinimalEdge(i, j, distances, r)) {
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
