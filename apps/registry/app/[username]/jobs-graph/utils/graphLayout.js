// Node dimensions
const NODE_WIDTH = 200;
const NODE_HEIGHT = 120;
const RESUME_WIDTH = 140;
const RESUME_HEIGHT = 80;

// Spacing
const HORIZONTAL_SPACING = 30;
const VERTICAL_SPACING = 150;

/**
 * Tree layout that positions children under their parent
 * Resume at top, jobs branch down in a true tree structure
 */
export const getLayoutedElements = (nodes, edges) => {
  if (nodes.length === 0) return { nodes: [], edges };

  // Find resume node (root)
  const resumeNode = nodes.find((n) => n.data?.isResume);
  if (!resumeNode) {
    return {
      nodes: nodes.map((node, i) => ({
        ...node,
        position: { x: 0, y: i * (NODE_HEIGHT + VERTICAL_SPACING) },
      })),
      edges,
    };
  }

  // Build parent-child relationships
  const children = new Map();
  const parent = new Map();
  nodes.forEach((n) => children.set(n.id, []));

  edges.forEach((edge) => {
    if (children.has(edge.source)) {
      children.get(edge.source).push(edge.target);
      parent.set(edge.target, edge.source);
    }
  });

  // Calculate subtree width for each node (bottom-up)
  const subtreeWidth = new Map();

  const calcSubtreeWidth = (nodeId) => {
    const nodeChildren = children.get(nodeId) || [];
    if (nodeChildren.length === 0) {
      subtreeWidth.set(nodeId, NODE_WIDTH);
      return NODE_WIDTH;
    }

    let totalWidth = 0;
    nodeChildren.forEach((childId) => {
      totalWidth += calcSubtreeWidth(childId);
    });
    // Add spacing between children
    totalWidth += (nodeChildren.length - 1) * HORIZONTAL_SPACING;

    subtreeWidth.set(nodeId, totalWidth);
    return totalWidth;
  };

  calcSubtreeWidth(resumeNode.id);

  // Handle disconnected nodes - attach them to resume
  nodes.forEach((node) => {
    if (node.id !== resumeNode.id && !parent.has(node.id)) {
      children.get(resumeNode.id).push(node.id);
      parent.set(node.id, resumeNode.id);
      subtreeWidth.set(node.id, NODE_WIDTH);
    }
  });

  // Recalculate resume's subtree width after adding orphans
  const resumeChildren = children.get(resumeNode.id) || [];
  if (resumeChildren.length > 0) {
    let totalWidth = 0;
    resumeChildren.forEach((childId) => {
      totalWidth += subtreeWidth.get(childId) || NODE_WIDTH;
    });
    totalWidth += (resumeChildren.length - 1) * HORIZONTAL_SPACING;
    subtreeWidth.set(resumeNode.id, totalWidth);
  }

  // Position nodes (top-down) - children centered under parent
  const positions = new Map();

  const positionNode = (nodeId, x, y) => {
    positions.set(nodeId, { x, y });

    const nodeChildren = children.get(nodeId) || [];
    if (nodeChildren.length === 0) return;

    // Calculate total width needed for all children
    let totalChildrenWidth = 0;
    nodeChildren.forEach((childId) => {
      totalChildrenWidth += subtreeWidth.get(childId) || NODE_WIDTH;
    });
    totalChildrenWidth += (nodeChildren.length - 1) * HORIZONTAL_SPACING;

    // Start position for first child (centered under parent)
    let childX = x - totalChildrenWidth / 2;
    const childY = y + NODE_HEIGHT + VERTICAL_SPACING;

    nodeChildren.forEach((childId) => {
      const childWidth = subtreeWidth.get(childId) || NODE_WIDTH;
      // Position child at center of its subtree allocation
      positionNode(childId, childX + childWidth / 2, childY);
      childX += childWidth + HORIZONTAL_SPACING;
    });
  };

  // Start positioning from resume at center
  positionNode(resumeNode.id, 0, 0);

  // Build final nodes array
  const layoutedNodes = nodes.map((node) => {
    const pos = positions.get(node.id) || { x: 0, y: 0 };
    const isResume = node.data?.isResume;
    const width = isResume ? RESUME_WIDTH : NODE_WIDTH;

    return {
      ...node,
      position: {
        x: pos.x - width / 2,
        y: pos.y,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
