/**
 * Pure graph-building helpers for the decision tree.
 * Given the user's preferences, compute the visible/laid-out nodes and bridged
 * edges (with transition styles) that the hook pushes into React Flow state.
 */

import {
  initialNodes,
  initialEdges,
  NODE_IDS,
  recalculateLayout,
  createBridgeEdges,
} from '../config/decisionTree';

// Map node IDs to preference keys. WR + AVAIL are always enabled.
export const nodeToPreferenceMap = {
  [NODE_IDS.CORE]: 'skills',
  [NODE_IDS.EXP]: 'experience',
  [NODE_IDS.LOC]: 'location',
  [NODE_IDS.TZ]: 'timezone',
  [NODE_IDS.SAL]: 'salary',
};

const TRANSITION = 'all 0.3s ease-in-out';

// Mark nodes hidden based on whether their mapped preference is enabled.
export function buildVisibilityNodes(preferences = {}) {
  return initialNodes.map((node) => {
    const prefKey = nodeToPreferenceMap[node.id];
    if (prefKey) {
      const isEnabled = preferences[prefKey]?.enabled !== false;
      return { ...node, hidden: !isEnabled };
    }
    // Always show root, outcome nodes, and nodes without preference mapping.
    return { ...node, hidden: false };
  });
}

const withTransition = (item) => ({
  ...item,
  style: { ...item.style, transition: TRANSITION },
});

/**
 * Compute the full laid-out graph for the given preferences.
 * @returns {{ nodes: any[], edges: any[] }}
 */
export function buildVisibleGraph(preferences = {}) {
  const nodesWithVisibility = buildVisibilityNodes(preferences);
  const layoutedNodes = recalculateLayout(nodesWithVisibility, initialEdges);
  const nodes = layoutedNodes.map(withTransition);

  const bridgedEdges = createBridgeEdges(
    nodesWithVisibility,
    initialEdges,
    nodeToPreferenceMap
  );
  const edges = bridgedEdges.map(withTransition);

  return { nodes, edges };
}
