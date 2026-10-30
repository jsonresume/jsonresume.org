import type { TreeBounds } from './scene';

const cellKey = (cx: number, cy: number) => (cx + 32768) * 65536 + (cy + 32768);

/** A uniform grid over points, for the nearest point to the pointer and points in a box. */
export class TreeIndex {
  private readonly cells = new Map<number, number[]>();

  constructor(
    private readonly xs: ArrayLike<number>,
    private readonly ys: ArrayLike<number>,
    private readonly size: number
  ) {
    for (let i = 0; i < xs.length; i++) {
      const key = cellKey(
        Math.floor((xs[i] as number) / size),
        Math.floor((ys[i] as number) / size)
      );
      const bucket = this.cells.get(key);
      if (bucket) bucket.push(i);
      else this.cells.set(key, [i]);
    }
  }

  /** The closest point within `radius` of (x, y) that `accept` allows, or -1. */
  nearest(
    x: number,
    y: number,
    radius: number,
    accept?: (i: number) => boolean
  ): number {
    let best = -1;
    let bestD = radius * radius;
    const c0 = Math.floor((x - radius) / this.size);
    const c1 = Math.floor((x + radius) / this.size);
    const r0 = Math.floor((y - radius) / this.size);
    const r1 = Math.floor((y + radius) / this.size);
    for (let cx = c0; cx <= c1; cx++)
      for (let cy = r0; cy <= r1; cy++)
        for (const i of this.cells.get(cellKey(cx, cy)) ?? []) {
          if (accept && !accept(i)) continue;
          const dx = (this.xs[i] as number) - x;
          const dy = (this.ys[i] as number) - y;
          const d = dx * dx + dy * dy;
          if (d < bestD || (d === bestD && i < best)) {
            bestD = d;
            best = i;
          }
        }
    return best;
  }

  /** Every point inside the box, in no particular order. */
  within(b: TreeBounds, out: number[] = []): number[] {
    const inside = (i: number) => {
      const x = this.xs[i] as number;
      const y = this.ys[i] as number;
      return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
    };
    const c0 = Math.floor(b.left / this.size);
    const c1 = Math.floor(b.right / this.size);
    const r0 = Math.floor(b.top / this.size);
    const r1 = Math.floor(b.bottom / this.size);
    if ((c1 - c0 + 1) * (r1 - r0 + 1) > this.cells.size * 2) {
      for (let i = 0; i < this.xs.length; i++) if (inside(i)) out.push(i);
      return out;
    }
    for (let cx = c0; cx <= c1; cx++)
      for (let cy = r0; cy <= r1; cy++)
        for (const i of this.cells.get(cellKey(cx, cy)) ?? [])
          if (inside(i)) out.push(i);
    return out;
  }
}

export interface LabelBox {
  /** Point index; -1 reserves room for something else (a band caption). */
  i: number;
  /** Centre of the label, in screen pixels. */
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Greedy label placement: takes boxes in priority order and keeps each one
 * that overlaps none kept before it. Screen-space buckets keep it linear.
 */
export function placeLabels(boxes: readonly LabelBox[], gap = 4): LabelBox[] {
  const cell = 96;
  const grid = new Map<number, LabelBox[]>();
  const kept: LabelBox[] = [];
  const overlaps = (a: LabelBox, l: number, r: number, t: number, b: number) =>
    l < a.x + a.w / 2 + gap / 2 &&
    r > a.x - a.w / 2 - gap / 2 &&
    t < a.y + a.h / 2 + gap / 2 &&
    b > a.y - a.h / 2 - gap / 2;
  for (const box of boxes) {
    const l = box.x - box.w / 2 - gap / 2;
    const r = box.x + box.w / 2 + gap / 2;
    const t = box.y - box.h / 2 - gap / 2;
    const b = box.y + box.h / 2 + gap / 2;
    const c0 = Math.floor(l / cell);
    const c1 = Math.floor(r / cell);
    const r0 = Math.floor(t / cell);
    const r1 = Math.floor(b / cell);
    let clear = true;
    for (let cx = c0; cx <= c1 && clear; cx++)
      for (let cy = r0; cy <= r1 && clear; cy++)
        clear = !(grid.get(cellKey(cx, cy)) ?? []).some((o) =>
          overlaps(o, l, r, t, b)
        );
    if (!clear) continue;
    kept.push(box);
    for (let cx = c0; cx <= c1; cx++)
      for (let cy = r0; cy <= r1; cy++) {
        const k = cellKey(cx, cy);
        const bucket = grid.get(k);
        if (bucket) bucket.push(box);
        else grid.set(k, [box]);
      }
  }
  return kept;
}

/**
 * Everything a node rests on, transitively (`down`), or everything resting
 * on it (`up`), with one edge per node reached: the first by which it was
 * found, breadth first, so each is joined by a shortest path and the picture
 * is a tree, not a tangle.
 */
export function cone(
  start: number,
  edges: readonly { from: number; to: number; same?: boolean }[],
  direction: 'down' | 'up',
  count: number
): { nodes: Set<number>; edges: Set<number> } {
  const next: number[][] = Array.from({ length: count }, () => []);
  const via: number[][] = Array.from({ length: count }, () => []);
  edges.forEach((e, k) => {
    if (e.same) return;
    const [a, b] = direction === 'down' ? [e.to, e.from] : [e.from, e.to];
    next[a]?.push(b);
    via[a]?.push(k);
  });
  const nodes = new Set<number>([start]);
  const lit = new Set<number>();
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const v = queue[head] as number;
    (next[v] ?? []).forEach((w, j) => {
      if (nodes.has(w)) return;
      nodes.add(w);
      const edge = via[v]?.[j];
      if (edge !== undefined) lit.add(edge);
      queue.push(w);
    });
  }
  return { nodes, edges: lit };
}
