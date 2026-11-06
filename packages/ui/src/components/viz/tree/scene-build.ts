import type { TreeBand } from './layout-types';
import {
  NODE_DIM,
  NODE_HIDDEN,
  NODE_HOVER,
  NODE_SELECTED,
  EDGE_HIDDEN,
  EDGE_LIT,
  EDGE_NEAR,
  EDGE_QUIET,
  EDGE_SAME,
  TREE_TONES,
  type TreeEmphasis,
  type TreeGeometry,
} from './render-types';
import type { TreeBounds } from './scene';
import { TreeIndex } from './scene-index';
import type { TreeMapEdge, TreeMapNode } from './types';

/** What the frame loop reads about the data: geometry, bounds, pick index, label order. */
export interface TreeScene {
  geometry: TreeGeometry;
  bounds: TreeBounds;
  index: TreeIndex;
  /** Node indices, the most relied-on first: whose names show first. */
  priority: number[];
  /** Per node, what it rests on and what rests on it. */
  below: number[][];
  above: number[][];
  /** Whether any square is active, so frames keep coming for its stripes. */
  animated: boolean;
}

export function buildScene(
  nodes: readonly TreeMapNode[],
  edges: readonly TreeMapEdge[],
  bands: readonly TreeBand[],
  spacing: number
): TreeScene {
  const n = nodes.length;
  const x = new Float32Array(n);
  const y = new Float32Array(n);
  const size = new Float32Array(n);
  const tone = new Uint8Array(n);
  const maxSupport = nodes.reduce((m, node) => Math.max(m, node.support), 1);
  nodes.forEach((node, i) => {
    x[i] = node.x;
    y[i] = node.y;
    size[i] = spacing * (0.32 + 0.26 * Math.sqrt(node.support / maxSupport));
    tone[i] = Math.max(0, TREE_TONES.indexOf(node.tone));
  });
  const bounds: TreeBounds = { left: 0, top: 0, right: 1, bottom: 1 };
  if (n) {
    bounds.left = Math.min(...x) - spacing * 4;
    bounds.right = Math.max(...x) + spacing;
    bounds.top = Math.min(...y) - spacing;
    bounds.bottom = Math.max(...y) + spacing;
  }
  for (const b of bands) {
    bounds.left = Math.min(bounds.left, b.left - spacing * 4);
    bounds.right = Math.max(bounds.right, b.right + spacing);
    bounds.top = Math.min(bounds.top, b.top - spacing);
    bounds.bottom = Math.max(bounds.bottom, b.bottom + spacing);
  }
  // Names first for what holds most up; then by position, so ties never flicker.
  const priority = Array.from({ length: n }, (_, i) => i).sort(
    (a, b) =>
      (nodes[b]?.support ?? 0) - (nodes[a]?.support ?? 0) ||
      (nodes[a]?.y ?? 0) - (nodes[b]?.y ?? 0) ||
      (nodes[a]?.x ?? 0) - (nodes[b]?.x ?? 0)
  );
  const below: number[][] = Array.from({ length: n }, () => []);
  const above: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    if (e.same) continue;
    below[e.to]?.push(e.from);
    above[e.from]?.push(e.to);
  }
  return {
    geometry: {
      x,
      y,
      size,
      tone,
      edgeFrom: Uint32Array.from(edges, (e) => e.from),
      edgeTo: Uint32Array.from(edges, (e) => e.to),
    },
    bounds,
    index: new TreeIndex(x, y, spacing * 4),
    priority,
    below,
    above,
    animated: tone.includes(TREE_TONES.indexOf('active')),
  };
}

export interface EmphasisInput {
  focus?: ReadonlySet<number> | null;
  lit?: ReadonlySet<number> | null;
  visible?: ReadonlySet<number> | null;
}

/** Dims what is out of focus, lights what is traced, rings the selection and hover. */
export function emphasisFlags(
  nodes: readonly TreeMapNode[],
  edges: readonly TreeMapEdge[],
  { focus, lit, visible }: EmphasisInput,
  selected: number | null,
  hovered: number
): TreeEmphasis {
  const n = nodes.length;
  const node = new Uint8Array(n);
  const edge = new Uint8Array(edges.length);
  if (focus) for (let i = 0; i < n; i++) if (!focus.has(i)) node[i] = NODE_DIM;
  if (visible)
    for (let i = 0; i < n; i++) if (!visible.has(i)) node[i] = NODE_HIDDEN;
  if (selected !== null && selected < n)
    node[selected] = (node[selected] ?? 0) | NODE_SELECTED;
  if (hovered >= 0 && hovered < n)
    node[hovered] = (node[hovered] ?? 0) | NODE_HOVER;
  edges.forEach((e, k) => {
    if (visible && (!visible.has(e.from) || !visible.has(e.to))) {
      edge[k] = EDGE_HIDDEN;
      return;
    }
    const near =
      e.from === selected ||
      e.to === selected ||
      e.from === hovered ||
      e.to === hovered;
    // A line along a row would run through every square between its ends:
    // shown only for the square you are looking at.
    const flat = nodes[e.from]?.y === nodes[e.to]?.y;
    // A traced path is drawn downward only: peers on one level are lit, not joined.
    const sideways = nodes[e.from]?.level === nodes[e.to]?.level;
    if (flat) edge[k] = near ? EDGE_NEAR : EDGE_HIDDEN;
    else if (lit?.has(k)) edge[k] = sideways ? EDGE_HIDDEN : EDGE_LIT;
    else edge[k] = near ? EDGE_NEAR : e.same ? EDGE_SAME : EDGE_QUIET;
  });
  return { node, edge };
}
