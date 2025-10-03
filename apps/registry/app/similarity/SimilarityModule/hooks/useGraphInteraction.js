import { useState, useCallback } from 'react';

/**
 * Hook to manage graph interaction state
 * @param {Object} graphData - Graph data with nodes and links
 * @returns {Object} Interaction state and handlers
 */
export function useGraphInteraction(graphData) {
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const handleNodeHover = useCallback(
    (node) => {
      setHighlightNodes(new Set(node ? [node] : []));
      setHighlightLinks(
        new Set(
          graphData?.links.filter(
            (link) => link.source.id === node?.id || link.target.id === node?.id
          ) || []
        )
      );
      setHoverNode(node || null);
    },
    [graphData]
  );

  const handleNodeClick = useCallback((node) => {
    if (node.usernames && node.usernames.length > 0) {
      window.open(`/${node.usernames[0]}`, '_blank');
    }
  }, []);

  return {
    highlightNodes,
    highlightLinks,
    hoverNode,
    handleNodeHover,
    handleNodeClick,
  };
}
