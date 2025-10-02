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
    align: 'DL',
    nodesep: 40,
    ranksep: 120,
    edgesep: 20,
    marginx: 20,
    marginy: 20,
    acyclicer: 'greedy',
    ranker: 'tight-tree',
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.data.isResume ? 200 : 250,
      height: node.data.isResume ? 100 : 150,
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
        x: nodeWithPosition.x - (node.data.isResume ? 100 : 125),
        y: nodeWithPosition.y - (node.data.isResume ? 50 : 75),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
