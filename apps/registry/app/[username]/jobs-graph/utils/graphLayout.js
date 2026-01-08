import dagre from '@dagrejs/dagre';

/**
 * Applies Dagre graph layout algorithm to React Flow nodes and edges
 * Creates a hierarchical tree with resume at top center
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {string} direction - Layout direction ('TB', 'LR', etc.)
 * @returns {Object} Layouted nodes and edges
 */
export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    align: 'UL', // Upper-left alignment helps with centering
    nodesep: 50,
    ranksep: 120,
    edgesep: 25,
    marginx: 50,
    marginy: 50,
    acyclicer: 'greedy',
    ranker: 'tight-tree', // Better for tree-like structures
  });

  // Add nodes with explicit rank for resume
  nodes.forEach((node) => {
    const nodeConfig = {
      width: node.data.isResume ? 120 : 180,
      height: node.data.isResume ? 60 : 80,
    };
    // Force resume node to rank 0 (top)
    if (node.data.isResume) {
      nodeConfig.rank = 0;
    }
    dagreGraph.setNode(node.id, nodeConfig);
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Find graph bounds to center everything
  let minX = Infinity,
    maxX = -Infinity;
  nodes.forEach((node) => {
    const pos = dagreGraph.node(node.id);
    if (pos) {
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x);
    }
  });
  const centerX = (minX + maxX) / 2;

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.data.isResume ? 120 : 180;
    const height = node.data.isResume ? 60 : 80;

    return {
      ...node,
      position: {
        // Center nodes around x=0
        x: nodeWithPosition.x - centerX - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
