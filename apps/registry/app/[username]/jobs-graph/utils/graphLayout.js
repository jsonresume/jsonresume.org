// Node dimensions
const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;

// Spacing
const H_GAP = 20;
const V_GAP = 120;

/**
 * Simple recursive tree layout
 * Each node's children are positioned directly below it
 */
export const getLayoutedElements = (nodes, edges) => {
  if (nodes.length === 0) return { nodes: [], edges };

  const resumeNode = nodes.find((n) => n.data?.isResume);
  const resumeId = resumeNode?.id;

  // DEBUG: Log what we're working with
  console.log('[LAYOUT] Nodes:', nodes.length, 'Edges:', edges.length);
  console.log('[LAYOUT] Resume ID:', resumeId);

  if (!resumeId) {
    console.log('[LAYOUT] No resume found, using fallback');
    return {
      nodes: nodes.map((node, i) => ({
        ...node,
        position: { x: 0, y: i * (NODE_HEIGHT + V_GAP) },
      })),
      edges,
    };
  }

  // Build adjacency: parent -> [children]
  const childrenOf = new Map();
  const hasParent = new Set();

  nodes.forEach((n) => childrenOf.set(n.id, []));

  edges.forEach((e) => {
    if (childrenOf.has(e.source) && childrenOf.has(e.target)) {
      childrenOf.get(e.source).push(e.target);
      hasParent.add(e.target);
    }
  });

  // DEBUG: How many children does resume have?
  const resumeChildren = childrenOf.get(resumeId) || [];
  console.log('[LAYOUT] Resume direct children:', resumeChildren.length);

  // Attach orphans (nodes with no parent) to resume
  let orphanCount = 0;
  nodes.forEach((n) => {
    if (n.id !== resumeId && !hasParent.has(n.id)) {
      childrenOf.get(resumeId).push(n.id);
      orphanCount++;
    }
  });
  console.log('[LAYOUT] Orphans attached to resume:', orphanCount);

  // Calculate width needed for each subtree
  const widthOf = new Map();
  const visited = new Set();

  const calcWidth = (id) => {
    if (visited.has(id)) return widthOf.get(id) || NODE_WIDTH;
    visited.add(id);

    const kids = childrenOf.get(id) || [];
    if (kids.length === 0) {
      widthOf.set(id, NODE_WIDTH);
      return NODE_WIDTH;
    }

    let total = 0;
    kids.forEach((kid) => {
      total += calcWidth(kid);
    });
    total += Math.max(0, kids.length - 1) * H_GAP;

    widthOf.set(id, Math.max(NODE_WIDTH, total));
    return widthOf.get(id);
  };

  calcWidth(resumeId);
  console.log('[LAYOUT] Total tree width:', widthOf.get(resumeId));

  // Position nodes
  const positions = new Map();
  const placed = new Set();

  const placeNode = (id, centerX, top) => {
    if (placed.has(id)) return;
    placed.add(id);

    positions.set(id, { x: centerX - NODE_WIDTH / 2, y: top });

    const kids = childrenOf.get(id) || [];
    if (kids.length === 0) return;

    const childY = top + NODE_HEIGHT + V_GAP;

    // Total width of all children
    let totalW = 0;
    kids.forEach((kid) => {
      totalW += widthOf.get(kid) || NODE_WIDTH;
    });
    totalW += Math.max(0, kids.length - 1) * H_GAP;

    // Start from left edge, centered under parent
    let x = centerX - totalW / 2;

    kids.forEach((kid) => {
      const kidW = widthOf.get(kid) || NODE_WIDTH;
      const kidCenterX = x + kidW / 2;
      placeNode(kid, kidCenterX, childY);
      x += kidW + H_GAP;
    });
  };

  placeNode(resumeId, 0, 0);

  // Any remaining unplaced nodes go at bottom
  let bottomY = 0;
  positions.forEach((pos) => {
    bottomY = Math.max(bottomY, pos.y);
  });
  bottomY += NODE_HEIGHT + V_GAP;

  let unplacedX = 0;
  let unplacedCount = 0;
  nodes.forEach((n) => {
    if (!positions.has(n.id)) {
      positions.set(n.id, { x: unplacedX, y: bottomY });
      unplacedX += NODE_WIDTH + H_GAP;
      unplacedCount++;
    }
  });

  console.log('[LAYOUT] Placed:', placed.size, 'Unplaced:', unplacedCount);

  // DEBUG: Show first few positions
  const resumePos = positions.get(resumeId);
  console.log('[LAYOUT] Resume position:', resumePos);

  const layoutedNodes = nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) || { x: 0, y: 0 },
  }));

  return { nodes: layoutedNodes, edges };
};
