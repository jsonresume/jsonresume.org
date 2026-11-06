import type { TreeController } from './controller';
import { rgba, sizeCanvas } from './render-types';
import { toScreen } from './scene';

export const LABEL_PX = 11;

export interface Caption {
  text: string;
  x: number;
  y: number;
  w: number;
  /** Held at the left edge because its gutter scrolled away. */
  stuck: boolean;
}

/**
 * Bands, behind: a faint wash on alternate levels. Their captions sit in the
 * gutter to the left, held on screen when the gutter scrolls away; returned
 * so they are drawn in front with the names, and no name covers them.
 */
export function drawBands(
  t: TreeController,
  canvas: HTMLCanvasElement,
  dpr: number
): Caption[] {
  const captions: Caption[] = [];
  const ctx = canvas.getContext('2d');
  const c = t.camera;
  const palette = t.palette;
  if (!ctx || !c || !palette) return captions;
  const v = t.viewport;
  const { bands, spacing } = t.data;
  sizeCanvas(canvas, v, dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, v.width, v.height);
  ctx.font = `500 ${LABEL_PX}px ${t.fonts.sans}`;
  ctx.textBaseline = 'middle';
  bands.forEach((b, k) => {
    const [l, top] = toScreen(c, v, b.left - spacing / 2, b.top);
    const [r, bottom] = toScreen(c, v, b.right + spacing / 2, b.bottom);
    if (bottom < 0 || top > v.height || r < 0 || l > v.width) return;
    if (k % 2 === 0 || b.level === -1) {
      ctx.fillStyle = rgba(palette.muted, 0.06);
      ctx.fillRect(l, top, r - l, bottom - top);
    }
    const text = t.handlers.bandLabel(b);
    const w = ctx.measureText(text).width;
    let x: number;
    let y: number;
    if (b.level === -1) {
      x = Math.max(l, 8);
      y = top - 9;
    } else {
      x = l - 10 - w;
      y = Math.min(
        Math.max((top + bottom) / 2, Math.max(top, 0) + 10),
        Math.min(bottom, v.height) - 10
      );
    }
    const stuck = x < 8;
    if (stuck) x = 8;
    if (y < 6 || y > v.height - 6) return;
    captions.push({ text, x, y, w, stuck });
  });
  return captions;
}
