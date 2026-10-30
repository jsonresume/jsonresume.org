import type { TreeBand } from './layout-types';
import type { TreePalette, TreeRenderer } from './render-types';
import {
  clampCamera,
  flyPath,
  toWorld,
  zoomLimits,
  type TreeCamera,
  type TreeViewport,
  type ZoomLimits,
} from './scene';
import {
  emphasisFlags,
  type EmphasisInput,
  type TreeScene,
} from './scene-build';
import type { TreeMapEdge, TreeMapNode, TreeMapProps } from './types';

const HIT_PX = 10;
const SETTLE_MS = 500;

export interface Flight {
  start: number;
  duration: number;
  at: (t: number) => TreeCamera;
}

type Handlers = Pick<
  TreeMapProps,
  'onSelect' | 'onOpen' | 'onCameraChange' | 'bandLabel'
>;

export interface TreeData {
  scene: TreeScene;
  nodes: readonly TreeMapNode[];
  edges: readonly TreeMapEdge[];
  bands: readonly TreeBand[];
  spacing: number;
}

/**
 * Everything a TreeMap's frame loop and input read, kept outside React so a
 * pan never re-renders. The component copies its props in; input moves the
 * camera; `request` draws on the next animation frame.
 */
export class TreeController {
  camera: TreeCamera | null = null;
  viewport: TreeViewport = { width: 0, height: 0 };
  limits: ZoomLimits = { min: 0.01, max: 6 };
  hovered = -1;
  selected: number | null = null;
  renderer: TreeRenderer | null = null;
  palette: TreePalette | null = null;
  reduced = false;
  flight: Flight | null = null;
  /** Where each square is drawn now; while squares glide to a new layout, where they started. */
  shown: { x: Float32Array; y: Float32Array } | null = null;
  morph: { x: Float32Array; y: Float32Array; start: number } | null = null;
  fonts = { sans: 'sans-serif', mono: 'monospace' };
  widths = new Map<string, number>();
  emphasis: EmphasisInput = {};
  status: HTMLElement | null = null;
  private frame = 0;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    public data: TreeData,
    public handlers: Handlers,
    /** Draws one frame; set by the component once its canvases exist. */
    public paint: () => void = () => {}
  ) {
    const g = data.scene.geometry;
    this.shown = { x: g.x.slice(), y: g.y.slice() };
  }

  request() {
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.paint();
    });
  }

  /** Reports where the reader settled, once they stop moving for a moment. */
  settle() {
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => {
      this.settleTimer = null;
      if (this.camera)
        this.handlers.onCameraChange?.(this.camera, this.viewport);
    }, SETTLE_MS);
  }

  move(next: TreeCamera) {
    this.flight = null;
    this.camera = clampCamera(
      next,
      this.data.scene.bounds,
      this.viewport,
      this.limits
    );
    this.request();
    this.settle();
  }

  fly(target: TreeCamera) {
    const to = clampCamera(
      target,
      this.data.scene.bounds,
      this.viewport,
      this.limits
    );
    if (!this.camera || this.reduced) return this.move(to);
    const path = flyPath(this.camera, to, this.viewport);
    this.flight = {
      start: performance.now(),
      duration: path.duration,
      at: path.at,
    };
    this.request();
  }

  /** Selects a node (or nothing), and says so to assistive technology. */
  choose(i: number | null) {
    this.handlers.onSelect(i);
    const node = i === null ? null : this.data.nodes[i];
    if (this.status)
      this.status.textContent = node
        ? [node.label, node.detail].filter(Boolean).join(', ')
        : '';
  }

  emphasise() {
    const { nodes, edges } = this.data;
    this.renderer?.setEmphasis(
      emphasisFlags(nodes, edges, this.emphasis, this.selected, this.hovered)
    );
    this.request();
  }

  /** The square under a screen point, or -1. */
  hit(x: number, y: number) {
    if (!this.camera) return -1;
    const [wx, wy] = toWorld(this.camera, this.viewport, x, y);
    const k = this.camera.k;
    const radius = Math.max(HIT_PX, this.data.spacing * k * 0.35) / k;
    const only = this.emphasis.visible;
    return this.data.scene.index.nearest(
      wx,
      wy,
      radius,
      only ? (i) => only.has(i) : undefined
    );
  }

  /** New data: squares glide to their new places when they are the same squares. */
  setData(data: TreeData) {
    this.data = data;
    const g = data.scene.geometry;
    if (this.shown && this.shown.x.length === g.x.length && !this.reduced) {
      this.morph = {
        x: this.shown.x.slice(),
        y: this.shown.y.slice(),
        start: performance.now(),
      };
    } else {
      this.morph = null;
      this.shown = { x: g.x.slice(), y: g.y.slice() };
      this.renderer?.setGeometry(g);
    }
    this.emphasise();
    if (this.viewport.width) {
      this.limits = zoomLimits(data.scene.bounds, this.viewport);
      if (this.camera)
        this.camera = clampCamera(
          this.camera,
          data.scene.bounds,
          this.viewport,
          this.limits
        );
    }
    this.request();
  }

  /** Stops drawing; reports a pending settle at once so the last place is kept. */
  dispose() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    if (this.settleTimer) {
      clearTimeout(this.settleTimer);
      this.settleTimer = null;
      if (this.camera)
        this.handlers.onCameraChange?.(this.camera, this.viewport);
    }
    this.renderer?.dispose();
    this.renderer = null;
  }
}
