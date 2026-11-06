import { drawBands } from './bands';
import type { TreeController } from './controller';
import { drawLabels } from './labels';
import { MAX_SQUARE_PX, MIN_SQUARE_PX } from './render-types';
import { clampCamera, easeInOutCubic } from './scene';

/** How long squares take to glide to a new layout. */
const MORPH_MS = 520;

export interface TreeCanvases {
  back: HTMLCanvasElement;
  text: HTMLCanvasElement;
}

/** Advances a fly-to and a layout glide to `now`. */
function advance(t: TreeController, now: number) {
  const { scene } = t.data;
  if (t.flight) {
    const p = Math.min(1, (now - t.flight.start) / t.flight.duration);
    t.camera = clampCamera(
      t.flight.at(easeInOutCubic(p)),
      scene.bounds,
      t.viewport,
      t.limits
    );
    if (p >= 1) {
      t.flight = null;
      t.settle();
    }
  }
  if (t.morph && t.shown) {
    const target = scene.geometry;
    const p = Math.min(1, (now - t.morph.start) / MORPH_MS);
    const e = easeInOutCubic(p);
    for (let i = 0; i < target.x.length; i++) {
      const fx = t.morph.x[i] as number;
      const fy = t.morph.y[i] as number;
      t.shown.x[i] = fx + ((target.x[i] as number) - fx) * e;
      t.shown.y[i] = fy + ((target.y[i] as number) - fy) * e;
    }
    t.renderer?.setGeometry({ ...target, x: t.shown.x, y: t.shown.y });
    if (p >= 1) {
      t.morph = null;
      t.renderer?.setGeometry(target);
    }
  }
}

/** One frame: squares and edges from the renderer, bands behind, names in front. */
export function drawFrame(t: TreeController, canvases: TreeCanvases) {
  if (!t.camera || !t.palette || !t.viewport.width) return;
  const now = performance.now();
  advance(t, now);
  const camera = t.camera;
  const { nodes, edges, spacing } = t.data;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const gap = spacing * camera.k;
  const focused = t.emphasis.focus;
  // Quiet edges fade as the map fills with them: a whole graph of lines at
  // full strength is a hairball; what matters is lit when something is chosen.
  const density = Math.min(
    1,
    3 / Math.max(1, edges.length / Math.max(1, nodes.length))
  );
  const quiet =
    Math.min(0.14, Math.max(0.03, 0.02 + 0.0018 * gap)) *
    (0.5 + 0.5 * density) *
    (focused ? 0.45 : 1);
  t.renderer?.draw({
    camera,
    viewport: t.viewport,
    dpr,
    time: t.reduced ? 0 : now / 1000,
    quiet,
    minPx: MIN_SQUARE_PX,
    maxPx: MAX_SQUARE_PX,
    dim: 0.22,
  });
  const captions = drawBands(t, canvases.back, dpr);
  drawLabels(t, canvases.text, dpr, captions);
  if (t.flight || t.morph || (t.data.scene.animated && !t.reduced)) t.request();
}
