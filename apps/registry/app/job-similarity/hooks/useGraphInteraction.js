import { useState, useCallback, useEffect } from 'react';

/**
 * Hook to manage graph node interactions
 * @param {Array} edges - Graph edges
 * @param {string} dataSource - 'jobs' or 'resumes'
 * @returns {Object} { highlightNodes, highlightLinks, hoverNode, isMobile, handleNodeHover, handleNodeClick }
 */
export const useGraphInteraction = (edges, dataSource) => {
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNodeHover = useCallback(
    (node) => {
      setHighlightNodes(new Set(node ? [node] : []));
      setHighlightLinks(
        new Set(
          node
            ? edges.filter(
                (link) => link.source === node || link.target === node
              )
            : []
        )
      );
      setHoverNode(node || null);
    },
    [edges]
  );

  const handleNodeClick = useCallback(
    (node) => {
      if (!node) return;

      if (isMobile) {
        // On mobile, just show the tooltip
        setHoverNode(node);
        return;
      }

      if (node.uuids && node.uuids.length > 0) {
        const baseUrl = dataSource === 'jobs' ? '/jobs/' : '/';
        window.open(`${baseUrl}${node.uuids[0]}`, '_blank');
      }
    },
    [dataSource, isMobile]
  );

  return {
    highlightNodes,
    highlightLinks,
    hoverNode,
    isMobile,
    handleNodeHover,
    handleNodeClick,
  };
};
