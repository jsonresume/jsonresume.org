import { describe, expect, it } from 'vitest';
import {
  clampCamera,
  fitCamera,
  flyPath,
  toScreen,
  toWorld,
  zoomAbout,
  zoomLimits,
} from './scene';
import { cone, placeLabels, TreeIndex } from './scene-index';

const view = { width: 800, height: 600 };
const bounds = { left: 0, top: 0, right: 4000, bottom: 1000 };

describe('tree camera', () => {
  it('maps world to screen and back', () => {
    const c = { x: 100, y: 50, k: 2 };
    const [sx, sy] = toScreen(c, view, 130, 20);
    expect([sx, sy]).toEqual([460, 240]);
    expect(toWorld(c, view, sx, sy)).toEqual([130, 20]);
  });

  it('fits the whole picture inside the padding', () => {
    const c = fitCamera(bounds, view, 32);
    const [l] = toScreen(c, view, bounds.left, 0);
    const [r] = toScreen(c, view, bounds.right, 0);
    expect(l).toBeCloseTo(32);
    expect(r).toBeCloseTo(768);
  });

  it('zooms about the pointer: the point under it stays under it', () => {
    const limits = zoomLimits(bounds, view);
    const c = { x: 2000, y: 500, k: 0.5 };
    const before = toWorld(c, view, 123, 456);
    const z = zoomAbout(c, view, 123, 456, 3, limits);
    const after = toWorld(z, view, 123, 456);
    expect(after[0]).toBeCloseTo(before[0]);
    expect(after[1]).toBeCloseTo(before[1]);
    expect(z.k).toBeCloseTo(1.5);
  });

  it('clamps zoom and never lets the picture leave the screen entirely', () => {
    const limits = zoomLimits(bounds, view);
    const c = clampCamera({ x: 1e6, y: -1e6, k: 1e6 }, bounds, view, limits);
    expect(c.k).toBe(limits.max);
    expect(c.x).toBeLessThanOrEqual(bounds.right + view.width / c.k);
    expect(c.y).toBeGreaterThanOrEqual(bounds.top - view.height / c.k);
  });

  it('flies from one camera to another, arriving exactly, zooming out on a long jump', () => {
    const a = { x: 0, y: 0, k: 2 };
    const b = { x: 3000, y: 800, k: 2 };
    const path = flyPath(a, b, view);
    expect(path.at(0).x).toBeCloseTo(0);
    const end = path.at(1);
    expect(end.x).toBeCloseTo(3000);
    expect(end.y).toBeCloseTo(800);
    expect(end.k).toBeCloseTo(2);
    expect(path.at(0.5).k).toBeLessThan(1);
    expect(path.duration).toBeGreaterThanOrEqual(250);
    expect(path.duration).toBeLessThanOrEqual(900);
    const zoomOnly = flyPath(a, { x: 0, y: 0, k: 8 }, view);
    expect(zoomOnly.at(1).k).toBeCloseTo(8);
  });
});

describe('TreeIndex', () => {
  const xs = [0, 10, 100, 1000];
  const ys = [0, 0, 100, 1000];
  const index = new TreeIndex(xs, ys, 64);

  it('finds the nearest point within a radius', () => {
    expect(index.nearest(8, 1, 20)).toBe(1);
    expect(index.nearest(500, 500, 20)).toBe(-1);
    expect(index.nearest(990, 1000, 20)).toBe(3);
  });

  it('never picks a point the caller hides', () => {
    expect(index.nearest(8, 1, 20, (i) => i !== 1)).toBe(0);
    expect(index.nearest(8, 1, 20, () => false)).toBe(-1);
  });

  it('lists the points in a box, however large the box', () => {
    expect(
      index.within({ left: -5, top: -5, right: 150, bottom: 150 }).sort()
    ).toEqual([0, 1, 2]);
    expect(
      index.within({ left: -1e7, top: -1e7, right: 1e7, bottom: 1e7 }).length
    ).toBe(4);
  });
});

describe('placeLabels', () => {
  it('keeps boxes in priority order and drops any that would overlap', () => {
    const kept = placeLabels([
      { i: 0, x: 100, y: 100, w: 80, h: 14 },
      { i: 1, x: 130, y: 102, w: 80, h: 14 },
      { i: 2, x: 300, y: 100, w: 80, h: 14 },
      { i: 3, x: 100, y: 130, w: 80, h: 14 },
    ]);
    expect(kept.map((b) => b.i)).toEqual([0, 2, 3]);
  });
});

describe('cone', () => {
  const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 3, to: 2 },
    { from: 2, to: 4 },
  ];

  it('walks down to everything a node rests on, and up to everything resting on it', () => {
    const down = cone(2, edges, 'down', 5);
    expect([...down.nodes].sort()).toEqual([0, 1, 2, 3]);
    // One edge per node reached: a tree back to the start.
    expect([...down.edges].sort()).toEqual([0, 1, 2]);
    const diamond = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
    ];
    const roots = cone(3, diamond, 'down', 4);
    expect(roots.nodes.size).toBe(4);
    expect(roots.edges.size).toBe(3);
    const up = cone(1, edges, 'up', 5);
    expect([...up.nodes].sort()).toEqual([1, 2, 4]);
  });
});
