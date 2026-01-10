// Node dimensions
const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;
const RESUME_WIDTH = 140;
const RESUME_HEIGHT = 80;

// Spacing
const HORIZONTAL_SPACING = 60;
const VERTICAL_SPACING = 150;

/**
 * Simple BFS tree layout - Resume at top, jobs flow down
 * Guarantees resume is always at the top (level 0)
 */
export const getLayoutedElements = (nodes, edges) => {
  if (nodes.length === 0) return { nodes: [], edges };

  // Find resume node (root of tree)
  const resumeNode = nodes.find((n) => n.data?.isResume);
  if (!resumeNode) {
    // Fallback: just stack nodes vertically if no resume
    return {
      nodes: nodes.map((node, i) => ({
        ...node,
        position: { x: 0, y: i * (NODE_HEIGHT + VERTICAL_SPACING) },
      })),
      edges,
    };
  }

  // Build adjacency list (resume -> children)
  const children = new Map();
  nodes.forEach((n) => children.set(n.id, []));

  edges.forEach((edge) => {
    // Edges go from source to target, but we want resume as root
    // Check both directions to find connections
    if (children.has(edge.source)) {
      children.get(edge.source).push(edge.target);
    }
  });

  // BFS to assign levels
  const levels = new Map();
  const queue = [resumeNode.id];
  levels.set(resumeNode.id, 0);

  while (queue.length > 0) {
    const nodeId = queue.shift();
    const currentLevel = levels.get(nodeId);
    const nodeChildren = children.get(nodeId) || [];

    nodeChildren.forEach((childId) => {
      if (!levels.has(childId)) {
        levels.set(childId, currentLevel + 1);
        queue.push(childId);
      }
    });
  }

  // Handle disconnected nodes (no path from resume)
  let maxLevel = 0;
  levels.forEach((level) => {
    maxLevel = Math.max(maxLevel, level);
  });

  nodes.forEach((node) => {
    if (!levels.has(node.id)) {
      // Place disconnected nodes at bottom
      levels.set(node.id, maxLevel + 1);
    }
  });

  // Group nodes by level
  const nodesByLevel = new Map();
  nodes.forEach((node) => {
    const level = levels.get(node.id);
    if (!nodesByLevel.has(level)) {
      nodesByLevel.set(level, []);
    }
    nodesByLevel.get(level).push(node);
  });

  // Position nodes at each level
  const layoutedNodes = [];

  nodesByLevel.forEach((levelNodes, level) => {
    const y = level * (NODE_HEIGHT + VERTICAL_SPACING);
    const totalWidth =
      levelNodes.length * NODE_WIDTH +
      (levelNodes.length - 1) * HORIZONTAL_SPACING;
    const startX = -totalWidth / 2;

    levelNodes.forEach((node, index) => {
      const isResume = node.data?.isResume;
      const width = isResume ? RESUME_WIDTH : NODE_WIDTH;
      const x = startX + index * (NODE_WIDTH + HORIZONTAL_SPACING);

      layoutedNodes.push({
        ...node,
        position: { x, y },
      });
    });
  });

  return { nodes: layoutedNodes, edges };
};
