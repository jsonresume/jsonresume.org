import { useCallback } from 'react';

/**
 * Hook to find and navigate to sibling nodes in the graph
 */
export function useSiblingNavigation({
  edges,
  nodes,
  setSelectedNode,
  reactFlowInstance,
}) {
  // Find the next sibling of a node (child of the same parent)
  const findNextSibling = useCallback(
    (nodeId) => {
      // Find parent edge
      const parentEdge = edges.find((edge) => edge.target === nodeId);
      if (!parentEdge) return null;

      // Find all children of the same parent
      const siblingEdges = edges.filter(
        (edge) => edge.source === parentEdge.source
      );
      const siblings = siblingEdges
        .map((edge) => nodes.find((node) => node.id === edge.target))
        .filter(Boolean);

      if (siblings.length <= 1) return null;

      // Sort siblings by x position
      const sortedSiblings = [...siblings].sort(
        (a, b) => a.position.x - b.position.x
      );
      const currentIndex = sortedSiblings.findIndex((s) => s.id === nodeId);

      // Move to next sibling, or first if at end
      const nextIndex =
        currentIndex < sortedSiblings.length - 1 ? currentIndex + 1 : 0;
      const nextNode = sortedSiblings[nextIndex];

      // Don't wrap to self
      return nextNode.id !== nodeId ? nextNode : null;
    },
    [edges, nodes]
  );

  // Navigate to a specific node (center viewport on it)
  const navigateToNode = useCallback(
    (node) => {
      if (!node) return;
      setSelectedNode(node);
      if (reactFlowInstance) {
        reactFlowInstance.setCenter(
          node.position.x + 125,
          node.position.y + 50,
          { zoom: reactFlowInstance.getZoom(), duration: 300 }
        );
      }
    },
    [setSelectedNode, reactFlowInstance]
  );

  // Navigate to the next sibling of a given node
  const navigateToNextSibling = useCallback(
    (nodeId) => {
      const nextNode = findNextSibling(nodeId);
      if (nextNode) {
        navigateToNode(nextNode);
      }
      return nextNode;
    },
    [findNextSibling, navigateToNode]
  );

  return {
    findNextSibling,
    navigateToNode,
    navigateToNextSibling,
  };
}
