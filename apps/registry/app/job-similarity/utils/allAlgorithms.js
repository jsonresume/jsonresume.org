import { mst, knn, threshold, adaptive } from './basicAlgorithms';
import { hierarchical, community } from './clusteringAlgorithms';
import { maxSpanningTree, clique, pathfinder } from './advancedAlgorithms';

/**
 * All available similarity algorithms
 */
export const allAlgorithms = {
  mst,
  knn,
  threshold,
  adaptive,
  hierarchical,
  community,
  maxSpanningTree,
  clique,
  pathfinder,
};
