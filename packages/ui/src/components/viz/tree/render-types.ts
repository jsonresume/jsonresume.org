import type { TreeCamera, TreeViewport } from './scene';

/*
 * What a TreeMap renderer draws, in the tree's vocabulary of tones: filled
 * green or red for a settled outcome, an outline for open, a green corner
 * for closable, an amber hatch for attention, sliding stripes while active.
 */

export const TREE_TONES = [
  'open',
  'success',
  'danger',
  'attention',
  'active',
  'closable',
] as const;
export type TreeTone = (typeof TREE_TONES)[number];

/** Node flags, combined. */
export const NODE_DIM = 1;
/** Not drawn at all, nor its edges: the caller's "only these" view. */
export const NODE_HIDDEN = 2;
export const NODE_SELECTED = 4;
export const NODE_HOVER = 8;

/** Edge styles: one each. `EDGE_HIDDEN` edges are not drawn at all. */
export const EDGE_QUIET = 0;
export const EDGE_LIT = 1;
export const EDGE_SAME = 2;
export const EDGE_NEAR = 3;
export const EDGE_HIDDEN = 4;
/** Drawing order: quiet first, so lit edges sit on top. */
export const EDGE_ORDER = [EDGE_QUIET, EDGE_SAME, EDGE_NEAR, EDGE_LIT] as const;

/** Squares draw no smaller than this, in CSS pixels. */
export const MIN_SQUARE_PX = 4;
/** Squares stop growing here, so zooming in makes room for words rather than blocks. */
export const MAX_SQUARE_PX = 22;

export interface TreeGeometry {
  x: Float32Array;
  y: Float32Array;
  /** Side of each square, in world units. */
  size: Float32Array;
  /** Index into TREE_TONES. */
  tone: Uint8Array;
  edgeFrom: Uint32Array;
  edgeTo: Uint32Array;
}

export interface TreeEmphasis {
  node: Uint8Array;
  edge: Uint8Array;
}

export type Rgb = [number, number, number];

export interface TreePalette {
  bg: Rgb;
  ink: Rgb;
  muted: Rgb;
  border: Rgb;
  success: Rgb;
  danger: Rgb;
  warning: Rgb;
}

export interface TreeFrame {
  camera: TreeCamera;
  viewport: TreeViewport;
  dpr: number;
  /** Seconds, for the active stripes; held still for reduced motion. */
  time: number;
  /** Opacity of a quiet edge: lower when zoomed out over many edges. */
  quiet: number;
  /** Squares never draw smaller than this many CSS pixels, nor larger than `maxPx`. */
  minPx: number;
  maxPx: number;
  /** Opacity multiplier for dimmed squares and edges. */
  dim: number;
}

export interface TreeRenderer {
  readonly kind: 'webgl2' | 'canvas';
  setGeometry(geometry: TreeGeometry): void;
  setEmphasis(emphasis: TreeEmphasis): void;
  setPalette(palette: TreePalette): void;
  draw(frame: TreeFrame): void;
  dispose(): void;
}

export const rgba = ([r, g, b]: Rgb, a = 1) =>
  `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(
    b * 255
  )},${a})`;

/** Resizes a canvas's backing store to the viewport at this pixel ratio. */
export function sizeCanvas(
  canvas: HTMLCanvasElement,
  v: TreeViewport,
  dpr: number
) {
  const w = Math.max(1, Math.round(v.width * dpr));
  const h = Math.max(1, Math.round(v.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h };
}
