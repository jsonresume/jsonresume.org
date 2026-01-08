import dagre from '@dagrejs/dagre';

const RESUME_WIDTH = 120;
const RESUME_HEIGHT = 60;
const JOB_WIDTH = 180;
const JOB_HEIGHT = 80;

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
    nodesep: 60,
    ranksep: 100,
    edgesep: 20,
    marginx: 20,
    marginy: 20,
  });

  // Add all nodes to dagre
  nodes.forEach((node) => {
    const isResume = node.data?.isResume;
    dagreGraph.setNode(node.id, {
      width: isResume ? RESUME_WIDTH : JOB_WIDTH,
      height: isResume ? RESUME_HEIGHT : JOB_HEIGHT,
    });
  });

  // Add all edges - dagre uses these to determine hierarchy
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Find center X for the resume node to position graph
  let resumeX = 0;
  nodes.forEach((node) => {
    if (node.data?.isResume) {
      const pos = dagreGraph.node(node.id);
      if (pos) resumeX = pos.x;
    }
  });

  // Position nodes - center around resume's X position
  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    const isResume = node.data?.isResume;
    const width = isResume ? RESUME_WIDTH : JOB_WIDTH;
    const height = isResume ? RESUME_HEIGHT : JOB_HEIGHT;

    return {
      ...node,
      position: {
        x: pos.x - resumeX - width / 2,
        y: pos.y - height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
