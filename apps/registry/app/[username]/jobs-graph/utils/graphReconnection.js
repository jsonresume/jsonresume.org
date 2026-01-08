/**
 * Reconnects edges when nodes are hidden from the graph
 * Uses precomputed nearest neighbors for smart reconnection:
 * - When a node's parent is hidden, finds the best VISIBLE neighbor
 * - Falls back to visible ancestor traversal if no good neighbor found
 *
 * @param {Array} edges - Original edges
 * @param {Set} hiddenNodeIds - Set of node IDs to hide
 * @param {Array} nodes - All nodes (to find resume node)
 * @param {Object} nearestNeighbors - Map of nodeId -> [{id, similarity}] (top 5 neighbors)
 * @returns {Array} New edges with reconnections
 */
export function reconnectEdges(
  edges,
  hiddenNodeIds,
  nodes,
  nearestNeighbors = {}
) {
  if (hiddenNodeIds.size === 0) return edges;

  const resumeNodeId = nodes.find((n) => n.data?.isResume)?.id;
  const visibleNodeIds = new Set(
    nodes.filter((n) => !hiddenNodeIds.has(n.id)).map((n) => n.id)
  );

  console.log('[reconnectEdges] Debug:', {
    totalEdges: edges.length,
    hiddenCount: hiddenNodeIds.size,
    visibleCount: visibleNodeIds.size,
    resumeNodeId,
    resumeIsVisible: visibleNodeIds.has(resumeNodeId),
    hasNearestNeighbors: Object.keys(nearestNeighbors).length,
  });

  // Critical: if no resume node found, we can't reconnect orphans
  if (!resumeNodeId) {
    console.error('[reconnectEdges] ERROR: Resume node not found in nodes!');
    console.log(
      '[reconnectEdges] Sample nodes:',
      nodes.slice(0, 3).map((n) => ({ id: n.id, isResume: n.data?.isResume }))
    );
  }

  // Build parent lookup: nodeId -> parentNodeId
  const parentMap = new Map();
  edges.forEach((e) => parentMap.set(e.target, e.source));

  /**
   * Find the best visible connection for a node whose parent is hidden
   * 1. First try nearest neighbors - find best visible neighbor
   * 2. Fall back to ancestor traversal
   * 3. Finally fall back to resume
   */
  const findBestVisibleConnection = (nodeId) => {
    // Try nearest neighbors first - find best visible one
    const neighbors = nearestNeighbors[nodeId];
    if (neighbors && neighbors.length > 0) {
      for (const neighbor of neighbors) {
        if (visibleNodeIds.has(neighbor.id) && neighbor.id !== nodeId) {
          return { source: neighbor.id, similarity: neighbor.similarity };
        }
      }
    }

    // Fall back to ancestor traversal
    let current = parentMap.get(nodeId);
    while (current && hiddenNodeIds.has(current)) {
      current = parentMap.get(current);
    }

    if (current && visibleNodeIds.has(current)) {
      return { source: current, similarity: null };
    }

    // Last resort: connect to resume
    return { source: resumeNodeId, similarity: null };
  };

  const newEdges = [];
  let stats = {
    kept: 0,
    reconnected: 0,
    skippedHiddenTarget: 0,
    failedReconnect: 0,
  };

  edges.forEach((edge) => {
    const sourceHidden = hiddenNodeIds.has(edge.source);
    const targetHidden = hiddenNodeIds.has(edge.target);

    if (targetHidden) {
      // Target is hidden - skip this edge entirely
      stats.skippedHiddenTarget++;
      return;
    }

    if (sourceHidden) {
      // Source is hidden - find best visible connection for target
      const connection = findBestVisibleConnection(edge.target);
      if (connection.source && connection.source !== edge.target) {
        newEdges.push({
          ...edge,
          id: `${connection.source}-${edge.target}`,
          source: connection.source,
          // Update edge value if we have a new similarity score
          value:
            connection.similarity !== null ? connection.similarity : edge.value,
        });
        stats.reconnected++;
      } else {
        stats.failedReconnect++;
        if (stats.failedReconnect <= 3) {
          console.log('[reconnectEdges] Failed to reconnect:', {
            target: edge.target,
            connectionSource: connection.source,
            reason: !connection.source
              ? 'no source found'
              : 'source equals target',
          });
        }
      }
    } else {
      // Both visible - keep edge as-is
      newEdges.push(edge);
      stats.kept++;
    }
  });

  console.log('[reconnectEdges] Processing stats:', stats);

  // Deduplicate edges (same source-target pair)
  const seen = new Set();
  let finalEdges = newEdges.filter((e) => {
    const key = `${e.source}-${e.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // POST-RECONNECTION: Detect and fix disconnected components
  // BFS to find all nodes connected to resume
  const connectedToResume = new Set([resumeNodeId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of finalEdges) {
      if (
        connectedToResume.has(edge.source) &&
        !connectedToResume.has(edge.target)
      ) {
        connectedToResume.add(edge.target);
        changed = true;
      }
    }
  }

  // Find orphan nodes (visible but not connected to resume)
  const orphanNodes = [...visibleNodeIds].filter(
    (id) => id !== resumeNodeId && !connectedToResume.has(id)
  );

  if (orphanNodes.length > 0) {
    console.log('[reconnectEdges] Found orphan nodes:', orphanNodes.length);

    // Connect each orphan to resume as fallback
    for (const orphanId of orphanNodes) {
      // Try to find best visible connected node from nearestNeighbors
      let bestConnection = resumeNodeId;
      let bestSimilarity = 0.5; // default for emergency reconnection

      const neighbors = nearestNeighbors[orphanId];
      if (neighbors && neighbors.length > 0) {
        for (const neighbor of neighbors) {
          if (connectedToResume.has(neighbor.id)) {
            bestConnection = neighbor.id;
            bestSimilarity = neighbor.similarity;
            break;
          }
        }
      }

      finalEdges.push({
        id: `${bestConnection}-${orphanId}`,
        source: bestConnection,
        target: orphanId,
        value: bestSimilarity,
      });

      // Mark as connected so subsequent orphans can connect to it
      connectedToResume.add(orphanId);
    }

    stats.orphansReconnected = orphanNodes.length;
  }

  console.log('[reconnectEdges] Result:', {
    inputEdges: edges.length,
    outputEdges: finalEdges.length,
    orphansFixed: orphanNodes.length,
    sample: finalEdges
      .slice(0, 3)
      .map((e) => ({ source: e.source, target: e.target })),
  });

  return finalEdges;
}
