import type { TreeController } from './controller';
import { attachKeys } from './input-keys';
import { attachPointer } from './input-pointer';
import { readPalette } from './palette';
import { createTreeRenderer } from './render';
import { clampCamera, fitCamera, zoomLimits } from './scene';
import type { TreeSpanView } from './types';

export interface MountElements {
  box: HTMLElement;
  gl: HTMLCanvasElement;
  /** A hidden element in the mono font, to read its family from. */
  mono: HTMLElement | null;
}

/**
 * Starts a TreeMap: its renderer, its look (colour tokens and fonts, kept in
 * step with the theme), reduced motion, its size, and input. The initial
 * view is used once. Returns the cleanup.
 */
export function mountTree(
  { box, gl, mono }: MountElements,
  t: TreeController,
  initialView: TreeSpanView | null | undefined
) {
  const start = () => {
    t.renderer = createTreeRenderer(gl);
    box.dataset.renderer = t.renderer.kind;
    if (t.palette) t.renderer.setPalette(t.palette);
    t.renderer.setGeometry(t.data.scene.geometry);
    t.emphasise();
  };
  start();
  const refreshLook = () => {
    t.palette = readPalette(box);
    t.renderer?.setPalette(t.palette);
    t.fonts = {
      sans: getComputedStyle(box).fontFamily || 'sans-serif',
      mono: (mono && getComputedStyle(mono).fontFamily) || 'monospace',
    };
    t.widths.clear();
    t.request();
  };
  refreshLook();
  // The theme is data-theme on the root or any ancestor, or the system's.
  const themeWatch =
    typeof MutationObserver === 'function'
      ? new MutationObserver(refreshLook)
      : null;
  themeWatch?.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class', 'style'],
  });
  themeWatch?.observe(document.body, {
    attributes: true,
    subtree: true,
    attributeFilter: ['data-theme'],
  });
  const dark = window.matchMedia?.('(prefers-color-scheme: dark)');
  dark?.addEventListener?.('change', refreshLook);
  const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const setMotion = () => {
    t.reduced = Boolean(motion?.matches);
    t.request();
  };
  setMotion();
  motion?.addEventListener?.('change', setMotion);

  let first = true;
  const resize = () => {
    const rect = box.getBoundingClientRect();
    t.viewport = { width: rect.width, height: rect.height };
    const { bounds } = t.data.scene;
    t.limits = zoomLimits(bounds, t.viewport);
    const side = Math.min(t.viewport.width, t.viewport.height);
    const initial =
      first && initialView && initialView.span > 0
        ? { x: initialView.x, y: initialView.y, k: side / initialView.span }
        : null;
    first = false;
    t.camera = clampCamera(
      t.camera ?? initial ?? fitCamera(bounds, t.viewport),
      bounds,
      t.viewport,
      t.limits
    );
    t.paint();
  };
  const sizes =
    typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  sizes?.observe(box);
  resize();

  const lost = (event: Event) => event.preventDefault();
  const restored = () => {
    t.renderer?.dispose();
    start();
    refreshLook();
  };
  gl.addEventListener('webglcontextlost', lost);
  gl.addEventListener('webglcontextrestored', restored);
  const detachPointer = attachPointer(box, t);
  const detachKeys = attachKeys(box, t);
  return () => {
    sizes?.disconnect();
    themeWatch?.disconnect();
    dark?.removeEventListener?.('change', refreshLook);
    motion?.removeEventListener?.('change', setMotion);
    gl.removeEventListener('webglcontextlost', lost);
    gl.removeEventListener('webglcontextrestored', restored);
    detachPointer();
    detachKeys();
    t.dispose();
  };
}
