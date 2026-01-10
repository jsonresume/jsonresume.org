import dagre from '@dagrejs/dagre';

// Node dimensions - must match actual rendered sizes
const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;
const RESUME_WIDTH = 140;
const RESUME_HEIGHT = 80;

// Spacing - generous to avoid overlap
const HORIZONTAL_SPACING = 60; // Space between sibling nodes
const VERTICAL_SPACING = 120; // Space between levels (ranks)

/**
 * Applies a clean top-down tree layout
 * Resume at top, primary jobs below, secondary jobs below those
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {string} direction - Layout direction ('TB' = top-bottom)
 * @returns {Object} Layouted nodes and edges
 */
export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  if (nodes.length === 0) return { nodes: [], edges };

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure for a clean top-down tree
  dagreGraph.setGraph({
    rankdir: direction,
    align: 'UL',
    nodesep: HORIZONTAL_SPACING,
    ranksep: VERTICAL_SPACING,
    edgesep: 20,
    marginx: 50,
    marginy: 50,
    ranker: 'tight-tree',
  });

  // Add nodes to dagre
  nodes.forEach((node) => {
    const isResume = node.data?.isResume;
    dagreGraph.setNode(node.id, {
      width: isResume ? RESUME_WIDTH : NODE_WIDTH,
      height: isResume ? RESUME_HEIGHT : NODE_HEIGHT,
    });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run layout
  dagre.layout(dagreGraph);

  // Apply positions
  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    const isResume = node.data?.isResume;
    const width = isResume ? RESUME_WIDTH : NODE_WIDTH;
    const height = isResume ? RESUME_HEIGHT : NODE_HEIGHT;

    return {
      ...node,
      position: {
        x: pos.x - width / 2,
        y: pos.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
