import { useEffect, useCallback } from 'react';

/**
 * Hook to enable keyboard navigation between nodes in the graph
 * - Up arrow: Move to parent node
 * - Down arrow: Move to first child node
 * - Left/Right arrows: Move between sibling nodes
 * - M key: Mark selected node as read
 *
 * @param {Object} options - Hook options
 * @param {Object} options.selectedNode - Currently selected node
 * @param {Function} options.setSelectedNode - Function to set selected node
 * @param {Array} options.edges - Graph edges
 * @param {Array} options.nodes - Graph nodes
 * @param {Object} options.reactFlowInstance - React Flow instance for viewport control
 * @param {Function} options.onMarkAsRead - Function to mark a job as read
 */
export function useKeyboardNavigation({
  selectedNode,
  setSelectedNode,
  edges,
  nodes,
  reactFlowInstance,
  onMarkAsRead,
}) {
  // Find parent node (source of edge where current node is target)
  const findParent = useCallback(
    (nodeId) => {
      const parentEdge = edges.find((edge) => edge.target === nodeId);
      if (!parentEdge) return null;
      return nodes.find((node) => node.id === parentEdge.source);
    },
    [edges, nodes]
  );

  // Find children nodes (targets of edges where current node is source)
  const findChildren = useCallback(
    (nodeId) => {
      const childEdges = edges.filter((edge) => edge.source === nodeId);
      return childEdges
        .map((edge) => nodes.find((node) => node.id === edge.target))
        .filter(Boolean);
    },
    [edges, nodes]
  );

  // Find siblings (other children of the same parent)
  const findSiblings = useCallback(
    (nodeId) => {
      const parent = findParent(nodeId);
      if (!parent) return [];
      const children = findChildren(parent.id);
      return children;
    },
    [findParent, findChildren]
  );

  // Center viewport on a node
  const centerOnNode = useCallback(
    (node) => {
      if (reactFlowInstance && node) {
        reactFlowInstance.setCenter(
          node.position.x + 125,
          node.position.y + 50,
          {
            zoom: reactFlowInstance.getZoom(),
            duration: 300,
          }
        );
      }
    },
    [reactFlowInstance]
  );

  // Navigate to a node
  const navigateToNode = useCallback(
    (node) => {
      if (node) {
        setSelectedNode(node);
        centerOnNode(node);
      }
    },
    [setSelectedNode, centerOnNode]
  );

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event) => {
      if (!selectedNode) return;

      // Don't interfere with input fields
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Handle 'M' key for marking as read and moving to next sibling
      if (event.key === 'm' || event.key === 'M') {
        if (onMarkAsRead && selectedNode.id && !selectedNode.data?.isResume) {
          // Find next sibling before marking as read
          const siblings = findSiblings(selectedNode.id);
          let nextNode = null;

          if (siblings.length > 1) {
            // Sort siblings by position
            const sortedSiblings = [...siblings].sort(
              (a, b) => a.position.x - b.position.x
            );
            const currentIndex = sortedSiblings.findIndex(
              (s) => s.id === selectedNode.id
            );

            // Move to next sibling, or first if at end
            const nextIndex =
              currentIndex < sortedSiblings.length - 1 ? currentIndex + 1 : 0;
            nextNode = sortedSiblings[nextIndex];

            // Don't wrap to self
            if (nextNode.id === selectedNode.id) {
              nextNode = null;
            }
          }

          // Mark current as read
          onMarkAsRead(selectedNode.id);

          // Navigate to next sibling
          if (nextNode) {
            navigateToNode(nextNode);
          }
        }
        return;
      }

      // Only handle arrow keys for navigation
      if (
        !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
      ) {
        return;
      }

      event.preventDefault();

      switch (event.key) {
        case 'ArrowUp': {
          // Move to parent
          const parent = findParent(selectedNode.id);
          navigateToNode(parent);
          break;
        }
        case 'ArrowDown': {
          // Move to first child
          const children = findChildren(selectedNode.id);
          if (children.length > 0) {
            // Sort children by x position for consistent ordering
            const sortedChildren = [...children].sort(
              (a, b) => a.position.x - b.position.x
            );
            navigateToNode(sortedChildren[0]);
          }
          break;
        }
        case 'ArrowLeft':
        case 'ArrowRight': {
          // Move between siblings
          const siblings = findSiblings(selectedNode.id);
          if (siblings.length <= 1) return;

          // Sort siblings by x position
          const sortedSiblings = [...siblings].sort(
            (a, b) => a.position.x - b.position.x
          );
          const currentIndex = sortedSiblings.findIndex(
            (s) => s.id === selectedNode.id
          );

          let newIndex;
          if (event.key === 'ArrowLeft') {
            newIndex =
              currentIndex > 0 ? currentIndex - 1 : sortedSiblings.length - 1;
          } else {
            newIndex =
              currentIndex < sortedSiblings.length - 1 ? currentIndex + 1 : 0;
          }

          navigateToNode(sortedSiblings[newIndex]);
          break;
        }
      }
    },
    [
      selectedNode,
      findParent,
      findChildren,
      findSiblings,
      navigateToNode,
      onMarkAsRead,
    ]
  );

  // Add event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
