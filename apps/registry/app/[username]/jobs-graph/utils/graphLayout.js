import dagre from '@dagrejs/dagre';

/**
 * Applies Dagre graph layout algorithm to React Flow nodes and edges
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
    align: 'UL',
    nodesep: 30,
    ranksep: 80,
    edgesep: 15,
    marginx: 20,
    marginy: 20,
    acyclicer: 'greedy',
    ranker: 'tight-tree',
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.data.isResume ? 120 : 180,
      height: node.data.isResume ? 60 : 80,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.data.isResume ? 60 : 90),
        y: nodeWithPosition.y - (node.data.isResume ? 30 : 40),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
