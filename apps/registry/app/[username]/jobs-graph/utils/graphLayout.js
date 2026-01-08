import dagre from '@dagrejs/dagre';

// Node dimensions - must match actual rendered sizes
const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const RESUME_WIDTH = 140;
const RESUME_HEIGHT = 70;

/**
 * Applies Dagre graph layout algorithm to React Flow nodes and edges
 * Handles disconnected components by laying them out in a grid
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {string} direction - Layout direction ('TB', 'LR', etc.)
 * @returns {Object} Layouted nodes and edges
 */
export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  if (nodes.length === 0) return { nodes: [], edges };

  // Find connected components
  const components = findConnectedComponents(nodes, edges);

  // Layout each component separately
  const layoutedComponents = components.map((component) =>
    layoutComponent(component.nodes, component.edges, direction)
  );

  // Arrange components in a compact grid layout
  const finalNodes = arrangeComponents(layoutedComponents);

  return { nodes: finalNodes, edges };
};

/**
 * Find connected components in the graph
 */
function findConnectedComponents(nodes, edges) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const visited = new Set();
  const components = [];

  // Build adjacency list (undirected)
  const adj = new Map();
  nodes.forEach((n) => adj.set(n.id, new Set()));
  edges.forEach((e) => {
    if (adj.has(e.source) && adj.has(e.target)) {
      adj.get(e.source).add(e.target);
      adj.get(e.target).add(e.source);
    }
  });

  // DFS to find components
  function dfs(nodeId, component) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    component.add(nodeId);
    for (const neighbor of adj.get(nodeId) || []) {
      dfs(neighbor, component);
    }
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const component = new Set();
      dfs(node.id, component);
      const componentNodes = nodes.filter((n) => component.has(n.id));
      const componentEdges = edges.filter(
        (e) => component.has(e.source) && component.has(e.target)
      );
      components.push({ nodes: componentNodes, edges: componentEdges });
    }
  }

  // Sort components: main tree (with resume) first, then by size
  components.sort((a, b) => {
    const aHasResume = a.nodes.some((n) => n.data?.isResume);
    const bHasResume = b.nodes.some((n) => n.data?.isResume);
    if (aHasResume && !bHasResume) return -1;
    if (!aHasResume && bHasResume) return 1;
    return b.nodes.length - a.nodes.length;
  });

  return components;
}

/**
 * Layout a single connected component using dagre
 */
function layoutComponent(nodes, edges, direction) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    align: 'UL',
    nodesep: 20, // Horizontal spacing between nodes
    ranksep: 60, // Vertical spacing between ranks
    edgesep: 10,
    marginx: 20,
    marginy: 20,
    acyclicer: 'greedy',
    ranker: 'tight-tree', // More compact than network-simplex
  });

  nodes.forEach((node) => {
    const isResume = node.data?.isResume;
    dagreGraph.setNode(node.id, {
      width: isResume ? RESUME_WIDTH : NODE_WIDTH,
      height: isResume ? RESUME_HEIGHT : NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Calculate bounding box
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);
    const isResume = node.data?.isResume;
    const width = isResume ? RESUME_WIDTH : NODE_WIDTH;
    const height = isResume ? RESUME_HEIGHT : NODE_HEIGHT;

    // Dagre returns center position, convert to top-left
    const x = pos.x - width / 2;
    const y = pos.y - height / 2;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);

    return {
      ...node,
      position: { x, y },
    };
  });

  return {
    nodes: layoutedNodes,
    width: maxX - minX,
    height: maxY - minY,
    minX,
    minY,
  };
}

/**
 * Arrange multiple components in a grid to avoid overlap
 */
function arrangeComponents(components) {
  if (components.length === 0) return [];
  if (components.length === 1) {
    // Single component - normalize to origin
    const comp = components[0];
    return comp.nodes.map((n) => ({
      ...n,
      position: {
        x: n.position.x - comp.minX,
        y: n.position.y - comp.minY,
      },
    }));
  }

  const allNodes = [];
  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;
  const maxRowWidth = 2000; // Max width before wrapping to next row
  const gap = 80; // Gap between components

  for (const comp of components) {
    // Check if we need to wrap to next row
    if (currentX + comp.width > maxRowWidth && currentX > 0) {
      currentX = 0;
      currentY += rowHeight + gap;
      rowHeight = 0;
    }

    // Add nodes with offset
    for (const node of comp.nodes) {
      allNodes.push({
        ...node,
        position: {
          x: node.position.x - comp.minX + currentX,
          y: node.position.y - comp.minY + currentY,
        },
      });
    }

    currentX += comp.width + gap;
    rowHeight = Math.max(rowHeight, comp.height);
  }

  return allNodes;
}
