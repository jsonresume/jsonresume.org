import type { Ref } from 'react';
import type { TreeBand } from './layout-types';
import type { TreeTone } from './render-types';
import type { TreeCamera, TreeViewport } from './scene';

export interface TreeMapNode {
  id: string;
  /** Short name drawn under the square. */
  label: string;
  /** A longer line drawn under the name when zoomed right in. */
  detail?: string;
  tone: TreeTone;
  x: number;
  y: number;
  level: number;
  /** How much rests on it: larger squares, and its name is shown first. */
  support: number;
}

export interface TreeMapEdge {
  /** Index of the foundation in `nodes`. */
  from: number;
  /** Index of what rests on it. */
  to: number;
  /** The same thing under another name: drawn quieter, never counted as resting on. */
  same?: boolean;
}

/** A place on the map: a world point, and how much of the world fits across the shorter side. */
export interface TreeSpanView {
  x: number;
  y: number;
  span: number;
}

/** A camera as a span view, so a place saved on a laptop opens as the same place on a phone. */
export function spanView(
  camera: TreeCamera,
  viewport: TreeViewport
): TreeSpanView {
  return {
    x: camera.x,
    y: camera.y,
    span: Math.min(viewport.width, viewport.height) / camera.k,
  };
}

export interface TreeMapHandle {
  /** Glides to a node and zooms in far enough to read it. */
  flyTo(index: number): void;
  /** Shows the whole map. */
  fit(): void;
  zoomBy(factor: number): void;
  /** Glides to show all of these nodes. */
  fitTo(indices: Iterable<number>): void;
  camera(): TreeCamera | null;
}

export interface TreeMapProps {
  nodes: readonly TreeMapNode[];
  edges: readonly TreeMapEdge[];
  bands: readonly TreeBand[];
  /** Caption for each band, drawn in the gutter to its left: "Level 2", "Not linked yet". */
  bandLabel: (band: TreeBand) => string;
  /** Where to start; omitted shows the whole map. */
  initialView?: TreeSpanView | null;
  selected: number | null;
  onSelect: (index: number | null) => void;
  /** Enter, or a double-click on a square when zoomed in to read it. */
  onOpen?: (index: number) => void;
  /** When set, every other square is dimmed. */
  focus?: ReadonlySet<number> | null;
  /** Edge indices to draw lit, e.g. a traced path. */
  lit?: ReadonlySet<number> | null;
  /** When set, only these squares (and edges between them) are drawn or can be picked. */
  visible?: ReadonlySet<number> | null;
  /** Called when a move settles, at most every half second. */
  onCameraChange?: (camera: TreeCamera, viewport: TreeViewport) => void;
  /** Names the map for assistive technology. */
  label: string;
  /** Horizontal distance between squares in the layout, in world units. */
  spacing?: number;
  ref?: Ref<TreeMapHandle>;
  className?: string;
}
