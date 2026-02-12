import { dotProduct } from './vectorOps';
import { logger } from '@/lib/logger';

/**
 * Ensure all nodes are reachable from root via BFS.
 * Reconnects orphaned subgraphs to the root node.
 * @returns {number} Number of orphaned nodes reconnected
 */
export function ensureConnectivity(
  rootId,
  nodes,
  links,
  embeddingLookup,
  rootEmbedding
) {
  // Build adjacency list (directed: parent -> children)
  const children = new Map();
  links.forEach((link) => {
    if (!children.has(link.source)) children.set(link.source, []);
    children.get(link.source).push(link.target);
  });

  // BFS from root
  const reachable = new Set([rootId]);
  const queue = [rootId];
  while (queue.length > 0) {
    const nodeId = queue.shift();
    for (const child of children.get(nodeId) || []) {
      if (!reachable.has(child)) {
        reachable.add(child);
        queue.push(child);
      }
    }
  }

  // Find and reconnect orphans
  const allNodeIds = new Set(nodes.map((n) => n.id));
  let orphanCount = 0;

  for (const nodeId of allNodeIds) {
    if (nodeId === rootId || reachable.has(nodeId)) continue;

    const embedding = embeddingLookup.get(nodeId);
    if (!embedding) continue;

    const sim = dotProduct(embedding, rootEmbedding);
    links.push({ source: rootId, target: nodeId, value: sim });
    orphanCount++;

    // BFS from newly connected node to mark its subtree as reachable
    reachable.add(nodeId);
    const subQueue = [nodeId];
    while (subQueue.length > 0) {
      const nId = subQueue.shift();
      for (const child of children.get(nId) || []) {
        if (!reachable.has(child)) {
          reachable.add(child);
          subQueue.push(child);
        }
      }
    }
  }

  if (orphanCount > 0) {
    logger.warn(
      {
        orphanCount,
        totalNodes: nodes.length,
        reachableAfterFix: reachable.size,
      },
      'Found and reconnected orphaned subgraphs to resume'
    );
  }

  return orphanCount;
}
