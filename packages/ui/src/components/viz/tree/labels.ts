import { LABEL_PX, type Caption } from './bands';
import type { TreeController } from './controller';
import { MAX_SQUARE_PX, MIN_SQUARE_PX, rgba, sizeCanvas } from './render-types';
import { toScreen, toWorld } from './scene';
import { placeLabels, type LabelBox } from './scene-index';

/** Screen pixels between neighbouring squares at which details join names. */
const DETAIL_GAP = 110;
const MAX_LABELS = 400;

/** Cuts a line to fit `max` pixels, with an ellipsis. */
function clip(ctx: CanvasRenderingContext2D, value: string, max: number) {
  if (ctx.measureText(value).width <= max) return value;
  let lo = 0;
  let hi = value.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ctx.measureText(`${value.slice(0, mid)}…`).width <= max) lo = mid;
    else hi = mid - 1;
  }
  return `${value.slice(0, lo)}…`;
}

/** Where each label goes: most relied-on first, none overlapping, none cut by the edge. */
function chooseLabels(
  t: TreeController,
  ctx: CanvasRenderingContext2D,
  captions: readonly Caption[]
) {
  const c = t.camera;
  if (!c) return { kept: [], showDetail: false, detailWidth: 0 };
  const v = t.viewport;
  const { nodes, scene, spacing } = t.data;
  const gap = spacing * c.k;
  const px = t.shown?.x ?? scene.geometry.x;
  const py = t.shown?.y ?? scene.geometry.y;
  const measure = (value: string) => {
    let w = t.widths.get(value);
    if (w === undefined) {
      w = ctx.measureText(value).width;
      t.widths.set(value, w);
    }
    return w;
  };
  const squarePx = (i: number) =>
    Math.min(
      Math.max((scene.geometry.size[i] as number) * c.k, MIN_SQUARE_PX),
      MAX_SQUARE_PX
    );
  const showDetail = gap >= DETAIL_GAP;
  const detailWidth = Math.max(gap * 0.95, 60);
  const [wl, wt] = toWorld(c, v, -120, -40);
  const [wr, wb] = toWorld(c, v, v.width + 120, v.height + 40);
  const onScreen = new Set(
    scene.index.within({ left: wl, top: wt, right: wr, bottom: wb })
  );
  const pinned = new Set<number>();
  if (t.selected !== null) pinned.add(t.selected);
  if (t.hovered >= 0) pinned.add(t.hovered);
  const boxes: LabelBox[] = captions.map((cap) => ({
    i: -1,
    x: cap.x + cap.w / 2,
    y: cap.y,
    w: cap.w + 8,
    h: 16,
  }));
  const push = (i: number) => {
    const node = nodes[i];
    if (!node || !onScreen.has(i)) return;
    if (t.emphasis.visible && !t.emphasis.visible.has(i)) return;
    const [sx, sy] = toScreen(c, v, px[i] as number, py[i] as number);
    const detail = showDetail && node.detail;
    const w = Math.max(measure(node.label), detail ? detailWidth : 0);
    const h = LABEL_PX + 2 + (detail ? LABEL_PX + 3 : 0);
    let x = sx;
    if (x - w / 2 < 2 || x + w / 2 > v.width - 2) {
      if (!pinned.has(i)) return;
      x = Math.min(Math.max(x, w / 2 + 2), v.width - w / 2 - 2);
    }
    boxes.push({ i, x, y: sy + squarePx(i) / 2 + 4 + h / 2, w, h });
  };
  for (const i of pinned) push(i);
  const focused = t.emphasis.focus;
  for (const i of scene.priority) {
    if (boxes.length > MAX_LABELS * 3) break;
    if (pinned.has(i)) continue;
    if (focused && !focused.has(i) && gap < 60) continue;
    push(i);
  }
  // Far out, only the landmarks: a map names its cities before its streets.
  const limit = gap < 20 ? 24 : gap < 40 ? 90 : MAX_LABELS;
  const kept = placeLabels(boxes)
    .filter((b) => b.i >= 0)
    .slice(0, limit);
  return { kept, showDetail, detailWidth };
}

/** Captions and names, in front: more as you zoom in, details when there is room. */
export function drawLabels(
  t: TreeController,
  canvas: HTMLCanvasElement,
  dpr: number,
  captions: readonly Caption[]
) {
  const ctx = canvas.getContext('2d');
  const palette = t.palette;
  const c = t.camera;
  if (!ctx || !palette || !c) return;
  const v = t.viewport;
  sizeCanvas(canvas, v, dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, v.width, v.height);
  ctx.font = `500 ${LABEL_PX}px ${t.fonts.sans}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  for (const caption of captions) {
    ctx.fillStyle = rgba(palette.bg, caption.stuck ? 0.92 : 0.8);
    ctx.fillRect(caption.x - 4, caption.y - 8, caption.w + 8, 16);
    ctx.fillStyle = rgba(palette.muted, 1);
    ctx.fillText(caption.text, caption.x, caption.y);
  }
  if (t.data.spacing * c.k < 6) return;
  ctx.font = `500 ${LABEL_PX}px ${t.fonts.mono}`;
  const { kept, showDetail, detailWidth } = chooseLabels(t, ctx, captions);
  const focused = t.emphasis.focus;
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';
  for (const box of kept) {
    const node = t.data.nodes[box.i];
    if (!node) continue;
    const dim = focused && !focused.has(box.i);
    const top = box.y - box.h / 2 + (LABEL_PX + 2) / 2;
    ctx.lineWidth = 3;
    ctx.strokeStyle = rgba(palette.bg, 0.9);
    ctx.fillStyle = rgba(dim ? palette.muted : palette.ink, dim ? 0.6 : 1);
    ctx.font = `${box.i === t.selected ? 600 : 500} ${LABEL_PX}px ${
      t.fonts.mono
    }`;
    ctx.strokeText(node.label, box.x, top);
    ctx.fillText(node.label, box.x, top);
    if (showDetail && node.detail) {
      ctx.font = `400 ${LABEL_PX}px ${t.fonts.sans}`;
      const line = clip(ctx, node.detail, detailWidth);
      ctx.fillStyle = rgba(palette.muted, dim ? 0.6 : 1);
      ctx.strokeText(line, box.x, top + LABEL_PX + 3);
      ctx.fillText(line, box.x, top + LABEL_PX + 3);
    }
  }
}
