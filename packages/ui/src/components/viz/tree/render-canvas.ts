import {
  EDGE_LIT,
  EDGE_NEAR,
  EDGE_ORDER,
  EDGE_QUIET,
  EDGE_SAME,
  NODE_DIM,
  NODE_HIDDEN,
  NODE_HOVER,
  NODE_SELECTED,
  rgba,
  sizeCanvas,
  TREE_TONES,
  type TreeEmphasis,
  type TreeFrame,
  type TreeGeometry,
  type TreePalette,
  type TreeRenderer,
} from './render-types';

type Ctx = CanvasRenderingContext2D;

const edgeAlpha = (style: number, quiet: number) =>
  style === EDGE_LIT
    ? 0.7
    : style === EDGE_NEAR
    ? 0.45
    : style === EDGE_SAME
    ? 0.5
    : quiet;

/** Canvas 2D: the fallback where WebGL2 is missing or lost. Same picture, slower. */
export class CanvasRenderer implements TreeRenderer {
  readonly kind = 'canvas' as const;
  private geometry: TreeGeometry | null = null;
  private emphasis: TreeEmphasis | null = null;
  private palette: TreePalette | null = null;

  constructor(private readonly canvas: HTMLCanvasElement) {}

  setGeometry(geometry: TreeGeometry) {
    this.geometry = geometry;
  }

  setEmphasis(emphasis: TreeEmphasis) {
    this.emphasis = emphasis;
  }

  setPalette(palette: TreePalette) {
    this.palette = palette;
  }

  draw(frame: TreeFrame) {
    const ctx = this.canvas.getContext('2d');
    const g = this.geometry;
    const p = this.palette;
    if (!ctx) return;
    const { w, h } = sizeCanvas(this.canvas, frame.viewport, frame.dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!g || !p) return;
    ctx.setTransform(frame.dpr, 0, 0, frame.dpr, 0, 0);
    this.edges(ctx, g, p, frame);
    this.squares(ctx, g, p, frame);
    ctx.globalAlpha = 1;
  }

  private flag(i: number) {
    return this.emphasis?.node[i] ?? 0;
  }

  private edges(ctx: Ctx, g: TreeGeometry, p: TreePalette, frame: TreeFrame) {
    const { camera: c, viewport: v } = frame;
    const sx = (x: number) => (x - c.x) * c.k + v.width / 2;
    const sy = (y: number) => (y - c.y) * c.k + v.height / 2;
    const on = (x: number, y: number) =>
      x > -48 && y > -48 && x < v.width + 48 && y < v.height + 48;
    const style = (k: number) => this.emphasis?.edge[k] ?? EDGE_QUIET;
    for (const wanted of EDGE_ORDER)
      for (const dim of [true, false]) {
        ctx.beginPath();
        let any = false;
        for (let k = 0; k < g.edgeFrom.length; k++) {
          if (style(k) !== wanted) continue;
          const a = g.edgeFrom[k] as number;
          const b = g.edgeTo[k] as number;
          const dimmed = Boolean(
            this.flag(a) & NODE_DIM && this.flag(b) & NODE_DIM
          );
          if (dimmed !== dim) continue;
          const ax = sx(g.x[a] as number);
          const ay = sy(g.y[a] as number);
          const bx = sx(g.x[b] as number);
          const by = sy(g.y[b] as number);
          if (wanted === EDGE_QUIET && !on(ax, ay) && !on(bx, by)) continue;
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          any = true;
        }
        if (!any) continue;
        const alpha = edgeAlpha(wanted, frame.quiet) * (dim ? frame.dim : 1);
        ctx.strokeStyle = rgba(wanted === EDGE_SAME ? p.muted : p.ink, alpha);
        ctx.lineWidth =
          wanted === EDGE_LIT ? 1.5 : wanted === EDGE_NEAR ? 1.25 : 1;
        ctx.stroke();
      }
  }

  private squares(ctx: Ctx, g: TreeGeometry, p: TreePalette, frame: TreeFrame) {
    const { camera: c, viewport: v } = frame;
    const shift = (frame.time * 5.3) % 6;
    for (let i = 0; i < g.x.length; i++) {
      const s = Math.min(
        Math.max((g.size[i] as number) * c.k, frame.minPx),
        frame.maxPx
      );
      const x = ((g.x[i] as number) - c.x) * c.k + v.width / 2 - s / 2;
      const y = ((g.y[i] as number) - c.y) * c.k + v.height / 2 - s / 2;
      if (x > v.width || y > v.height || x + s < 0 || y + s < 0) continue;
      const flag = this.flag(i);
      if (flag & NODE_HIDDEN) continue;
      const tone = TREE_TONES[g.tone[i] as number] ?? 'open';
      ctx.globalAlpha = flag & NODE_DIM ? frame.dim : 1;
      if (tone === 'success' || tone === 'danger') {
        ctx.fillStyle = rgba(tone === 'success' ? p.success : p.danger);
        ctx.fillRect(x, y, s, s);
      } else {
        ctx.fillStyle = rgba(p.bg);
        ctx.fillRect(x, y, s, s);
        if (tone !== 'open' && s >= 6) pattern(ctx, tone, p, x, y, s, shift);
        ctx.strokeStyle = rgba(
          tone === 'attention'
            ? p.warning
            : tone === 'active'
            ? p.ink
            : p.border
        );
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
      }
      if (flag & (NODE_SELECTED | NODE_HOVER)) {
        ctx.strokeStyle = rgba(p.ink, flag & NODE_SELECTED ? 1 : 0.7);
        ctx.lineWidth = flag & NODE_SELECTED ? 1.5 : 1;
        ctx.strokeRect(x - 3, y - 3, s + 6, s + 6);
      }
    }
  }

  dispose() {}
}

/** A closable corner, or the attention hatch, or the active stripes. */
function pattern(
  ctx: Ctx,
  tone: string,
  p: TreePalette,
  x: number,
  y: number,
  s: number,
  shift: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, s, s);
  ctx.clip();
  if (tone === 'closable') {
    ctx.fillStyle = rgba(p.success);
    ctx.beginPath();
    ctx.moveTo(x + s, y + s * 0.34);
    ctx.lineTo(x + s, y + s);
    ctx.lineTo(x + s * 0.34, y + s);
    ctx.fill();
  } else {
    ctx.strokeStyle = rgba(tone === 'attention' ? p.warning : p.muted);
    ctx.lineWidth = 2;
    ctx.beginPath();
    const offset = tone === 'active' ? shift : 0;
    for (let d = -s - 6 + offset; d < s + 6; d += 6) {
      ctx.moveTo(x + d, y + s);
      ctx.lineTo(x + d + s, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
