import { useCallback } from 'react';

/**
 * Hook to find path from a node to the resume node
 * @param {Array} nodes - React Flow nodes
 * @returns {Function} findPathToResume function
 */
export const usePathFinding = (nodes) => {
  const findPathToResume = useCallback(
    (edges, startNodeId) => {
      const pathEdges = new Set();
      const visited = new Set();

      const findPath = (currentId) => {
        if (visited.has(currentId)) return false;
        visited.add(currentId);

        // Find edge going to parent
        const parentEdge = edges.find(
          (edge) => edge.target === currentId && !visited.has(edge.source)
        );

        if (!parentEdge) return false;

        pathEdges.add(parentEdge.id);

        // If we've reached the resume node (which should be a source node)
        const isParentResume = nodes.find(
          (n) => n.id === parentEdge.source && n.data.isResume
        );

        if (isParentResume) return true;

        // Continue up the tree
        return findPath(parentEdge.source);
      };

      findPath(startNodeId);
      return pathEdges;
    },
    [nodes]
  );

  return findPathToResume;
};
