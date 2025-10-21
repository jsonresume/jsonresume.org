/**
 * Decision Tree Configuration for React Flow
 * Defines nodes, edges, and layout for the matching visualization
 */

import { MarkerType } from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import { colors } from './designSystem';

// Node IDs (constants for type safety)
export const NODE_IDS = {
  ROOT: 'root',
  CORE: 'core',
  EXP: 'exp',
  LOC: 'loc',
  TZ: 'tz',
  WR: 'wr',
  AVAIL: 'avail',
  SAL: 'sal',
  BONUS: 'bonus',
  STRONG: 'strong',
  POSSIBLE: 'possible',
  REJECT: 'reject',
};

// Dagre layout configuration
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({
  rankdir: 'TB', // Top to bottom
  nodesep: 60, // Horizontal spacing between nodes (reduced)
  ranksep: 80, // Vertical spacing between ranks (reduced for less height)
  edgesep: 20, // Spacing between edges (reduced)
  marginx: 30,
  marginy: 30,
});

// Node style generators
export function nodeStyle(kind = 'default') {
  const base = {
    padding: '12px 16px',
    borderRadius: '14px',
    border: `1px solid ${colors.ui.border}`,
    background: colors.background.primary,
    fontSize: '14px',
    boxShadow: colors.ui.shadow,
    fontWeight: 500,
    minWidth: '180px',
    textAlign: 'center',
  };

  if (kind === 'title') {
    return {
      ...base,
      fontWeight: 700,
      background: colors.background.secondary,
      fontSize: '16px',
      minWidth: '220px',
    };
  }

  if (kind === 'success') {
    return {
      ...base,
      background: colors.outcomes.strongMatch.bg,
      borderColor: colors.outcomes.strongMatch.border,
      color: colors.outcomes.strongMatch.text,
      fontWeight: 600,
    };
  }

  if (kind === 'warn') {
    return {
      ...base,
      background: colors.outcomes.possibleMatch.bg,
      borderColor: colors.outcomes.possibleMatch.border,
      color: colors.outcomes.possibleMatch.text,
      fontWeight: 600,
    };
  }

  if (kind === 'danger') {
    return {
      ...base,
      background: colors.outcomes.noMatch.bg,
      borderColor: colors.outcomes.noMatch.border,
      color: colors.outcomes.noMatch.text,
      fontWeight: 600,
    };
  }

  return base;
}

// Base nodes without positions (dagre will calculate)
const baseNodes = [
  {
    id: NODE_IDS.ROOT,
    data: { label: 'Candidate → Job Match' },
    style: nodeStyle('title'),
    type: 'default',
  },
  {
    id: NODE_IDS.CORE,
    data: { label: 'Has ALL required skills?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.EXP,
    data: { label: 'Enough experience?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.WR,
    data: { label: 'Work rights ok?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.LOC,
    data: { label: 'Location fits?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.TZ,
    data: { label: 'Timezone fits?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.AVAIL,
    data: { label: 'Available soon?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.SAL,
    data: { label: 'Salary within range?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.BONUS,
    data: { label: 'Bonus skill overlap?' },
    style: nodeStyle(),
    type: 'default',
  },
  {
    id: NODE_IDS.STRONG,
    data: { label: '✅ Strong Match' },
    style: nodeStyle('success'),
    type: 'output',
  },
  {
    id: NODE_IDS.POSSIBLE,
    data: { label: '🟡 Possible Match' },
    style: nodeStyle('warn'),
    type: 'output',
  },
  {
    id: NODE_IDS.REJECT,
    data: { label: '❌ Not a Match' },
    style: nodeStyle('danger'),
    type: 'output',
  },
];

// Edge helper
function createEdge(id, source, target, label = '') {
  return {
    id,
    source,
    target,
    label,
    type: 'smoothstep',
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 8,
    labelStyle: {
      fontSize: '12px',
      fontWeight: 500,
      fill: colors.text.secondary,
    },
    labelBgStyle: {
      fill: colors.background.primary,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    style: {
      strokeWidth: 2,
      stroke: colors.paths.gray,
    },
    animated: false,
    data: {
      baseColor: colors.paths.gray,
    },
  };
}

// Base edges configuration
const baseEdges = [
  // Root → Core skills
  createEdge('e_root_core', NODE_IDS.ROOT, NODE_IDS.CORE, ''),

  // Core skills → Experience or Reject
  createEdge('e_core_exp_yes', NODE_IDS.CORE, NODE_IDS.EXP, 'Yes'),
  createEdge('e_core_reject_no', NODE_IDS.CORE, NODE_IDS.REJECT, 'No'),

  // Experience → Work Rights or Reject
  createEdge('e_exp_wr_yes', NODE_IDS.EXP, NODE_IDS.WR, 'Yes'),
  createEdge('e_exp_reject_no', NODE_IDS.EXP, NODE_IDS.REJECT, 'No'),

  // Work Rights → Location or Reject
  createEdge('e_wr_loc_yes', NODE_IDS.WR, NODE_IDS.LOC, 'Yes'),
  createEdge('e_wr_reject_no', NODE_IDS.WR, NODE_IDS.REJECT, 'No'),

  // Location → Availability or Timezone
  createEdge(
    'e_loc_avail_yes',
    NODE_IDS.LOC,
    NODE_IDS.AVAIL,
    'Yes (or Remote)'
  ),
  createEdge('e_loc_tz_no', NODE_IDS.LOC, NODE_IDS.TZ, 'No (if Remote=No)'),

  // Timezone → Availability or Reject
  createEdge('e_tz_avail_yes', NODE_IDS.TZ, NODE_IDS.AVAIL, 'Yes'),
  createEdge('e_tz_reject_no', NODE_IDS.TZ, NODE_IDS.REJECT, 'No'),

  // Availability → Salary or Possible
  createEdge('e_avail_sal_yes', NODE_IDS.AVAIL, NODE_IDS.SAL, 'Yes'),
  createEdge(
    'e_avail_possible_no',
    NODE_IDS.AVAIL,
    NODE_IDS.POSSIBLE,
    'No (maybe later)'
  ),

  // Salary → Bonus or Possible
  createEdge('e_sal_bonus_yes', NODE_IDS.SAL, NODE_IDS.BONUS, 'Yes'),
  createEdge(
    'e_sal_possible_no',
    NODE_IDS.SAL,
    NODE_IDS.POSSIBLE,
    'No (negotiate?)'
  ),

  // Bonus → Strong or Possible
  createEdge('e_bonus_strong_yes', NODE_IDS.BONUS, NODE_IDS.STRONG, 'Yes'),
  createEdge('e_bonus_possible_no', NODE_IDS.BONUS, NODE_IDS.POSSIBLE, 'No'),
];

// Apply dagre layout to position nodes
function getLayoutedNodes() {
  // Add nodes to dagre graph
  baseNodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: 220,
      height: 80,
    });
  });

  // Add edges to dagre graph
  baseEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  const layoutedNodes = baseNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 110, // Center node (width/2)
        y: nodeWithPosition.y - 40, // Center node (height/2)
      },
    };
  });

  return layoutedNodes;
}

// Export positioned nodes and edges
export const initialNodes = getLayoutedNodes();
export const initialEdges = baseEdges;

// React Flow configuration options
export const reactFlowOptions = {
  fitView: true,
  fitViewOptions: {
    padding: 0.1,
  },
  minZoom: 0.3,
  maxZoom: 1.5,
  defaultEdgeOptions: {
    type: 'smoothstep',
    animated: false,
  },
  nodesDraggable: false,
  nodesConnectable: false,
  elementsSelectable: false,
};
