/**
 * Reconnects edges when nodes are hidden from the graph
 * Orphaned children are connected to their nearest visible ancestor
 * @param {Array} edges - Original edges
 * @param {Set} hiddenNodeIds - Set of node IDs to hide
 * @param {Array} nodes - All nodes (to find resume node)
 * @returns {Array} New edges with reconnections
 */
export function reconnectEdges(edges, hiddenNodeIds, nodes) {
  if (hiddenNodeIds.size === 0) return edges;

  const resumeNodeId = nodes.find((n) => n.data?.isResume)?.id;

  // Build parent lookup: nodeId -> parentNodeId
  const parentMap = new Map();
  edges.forEach((e) => parentMap.set(e.target, e.source));

  // Find visible ancestor for a node (traverse up the tree)
  const findVisibleAncestor = (nodeId) => {
    let current = parentMap.get(nodeId);
    while (current && hiddenNodeIds.has(current)) {
      current = parentMap.get(current);
    }
    // Fall back to resume if all ancestors are hidden
    return current || resumeNodeId;
  };

  const newEdges = [];

  edges.forEach((edge) => {
    const sourceHidden = hiddenNodeIds.has(edge.source);
    const targetHidden = hiddenNodeIds.has(edge.target);

    if (targetHidden) {
      // Target is hidden - skip this edge entirely
      return;
    }

    if (sourceHidden) {
      // Source is hidden - reconnect target to visible ancestor
      const newSource = findVisibleAncestor(edge.source);
      if (newSource && newSource !== edge.target) {
        newEdges.push({
          ...edge,
          id: `${newSource}-${edge.target}`,
          source: newSource,
        });
      }
    } else {
      // Both visible - keep edge as-is
      newEdges.push(edge);
    }
  });

  // Deduplicate edges (same source-target pair)
  const seen = new Set();
  return newEdges.filter((e) => {
    const key = `${e.source}-${e.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
