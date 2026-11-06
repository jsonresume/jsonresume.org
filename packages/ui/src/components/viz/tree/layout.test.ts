import { describe, expect, it } from 'vitest';
import { layoutTree } from './layout';
import type { PlacedNode, TreeLayout, TreeLayoutEdge } from './layout-types';

const at = (t: TreeLayout, i: number) => t.nodes[i] as PlacedNode;

const strong = (from: string, to: string): TreeLayoutEdge => ({
  from,
  to,
  strength: 'strong',
});
const weak = (from: string, to: string): TreeLayoutEdge => ({
  from,
  to,
  strength: 'weak',
});

/** A seeded generator, so a failing case can be replayed. */
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

describe('layoutTree', () => {
  it('puts foundations at the bottom and what rests on them above', () => {
    const t = layoutTree(
      ['top', 'mid', 'base'],
      [strong('base', 'mid'), strong('mid', 'top')]
    );
    const [top, mid, base] = t.nodes;
    expect([base?.level, mid?.level, top?.level]).toEqual([0, 1, 2]);
    expect(top?.y ?? 0).toBeLessThan(mid?.y ?? 0);
    expect(mid?.y ?? 0).toBeLessThan(base?.y ?? 0);
    expect(base?.support).toBe(2);
    expect(mid?.support).toBe(1);
    expect(t.bands.map((b) => b.level)).toEqual([2, 1, 0]);
  });

  it('keeps the same thing on one level, side by side', () => {
    const t = layoutTree(
      ['a', 'b', 'c', 'd'],
      [
        strong('a', 'b'),
        { from: 'b', to: 'c', strength: 'same' },
        strong('c', 'd'),
      ]
    );
    const [, b, c, d] = t.nodes;
    expect(b?.level).toBe(c?.level);
    expect(Math.abs((b?.x ?? 0) - (c?.x ?? 0))).toBe(28);
    expect(d?.level).toBe((b?.level ?? 0) + 1);
  });

  it('makes a loop of strong edges one level, and never drops a strong edge', () => {
    const t = layoutTree(
      ['a', 'b', 'c'],
      [strong('a', 'b'), strong('b', 'a'), strong('b', 'c')]
    );
    expect(at(t, 0).level).toBe(at(t, 1).level);
    expect(at(t, 2).level).toBe(at(t, 0).level + 1);
    expect(t.dropped).toBe(0);
  });

  it('puts weak edges that loop on one level, and keeps both', () => {
    const t = layoutTree(
      ['x', 'y', 'z'],
      [weak('x', 'y'), weak('y', 'x'), weak('y', 'z')]
    );
    expect(t.dropped).toBe(0);
    expect(at(t, 0).level).toBe(at(t, 1).level);
    expect(at(t, 2).level).toBe(at(t, 0).level + 1);
    expect(t.edges).toHaveLength(2);
  });

  it('lets strong edges decide direction: a weak edge against a chain is left out', () => {
    const t = layoutTree(
      ['a', 'b', 'c'],
      [strong('a', 'b'), strong('b', 'c'), weak('c', 'a')]
    );
    expect(t.dropped).toBe(1);
    expect(t.nodes.map((n) => n.level)).toEqual([0, 1, 2]);
  });

  it('shelves nodes with no edges instead of calling them foundations', () => {
    const t = layoutTree(['a', 'b', 'lonely'], [strong('a', 'b')]);
    expect(at(t, 2).level).toBe(-1);
    expect(t.bands.at(-1)?.level).toBe(-1);
    expect(at(t, 2).x).toBeGreaterThan(Math.max(at(t, 0).x, at(t, 1).x));
  });

  it('lays out an empty graph and a graph of loners', () => {
    expect(layoutTree([], []).nodes).toEqual([]);
    const t = layoutTree(['a', 'b'], []);
    expect(t.nodes.every((n) => n.level === -1 && n.x > 0)).toBe(true);
  });

  it('draws one edge per pair, the first passed', () => {
    const t = layoutTree(['a', 'b'], [strong('a', 'b'), weak('a', 'b')]);
    expect(t.edges).toEqual([{ from: 0, to: 1, source: 0 }]);
  });

  it('on a large random graph: every edge points up, nothing overlaps, same input same picture', () => {
    const next = random(7);
    const ids = Array.from({ length: 600 }, (_, i) => `s${i}`);
    const edges: TreeLayoutEdge[] = [];
    for (let k = 0; k < 2400; k++) {
      const a = Math.floor(next() * ids.length);
      const b = Math.floor(next() * ids.length);
      const strength =
        next() < 0.15 ? 'strong' : next() < 0.03 ? 'same' : 'weak';
      // Strong edges only point from lower to higher indices, so they cannot loop.
      if (strength === 'strong' && a >= b) continue;
      edges.push({ from: ids[a] as string, to: ids[b] as string, strength });
    }
    const t = layoutTree(ids, edges);
    for (const e of t.edges) {
      const from = at(t, e.from);
      const to = at(t, e.to);
      if (edges[e.source]?.strength === 'same')
        expect(to.level).toBe(from.level);
      else
        expect(to.level).toBeGreaterThanOrEqual(
          from.level + (from.level === to.level ? 0 : 1)
        );
      if (to.level !== from.level) expect(to.y).toBeLessThan(from.y);
    }
    const spots = new Set(
      t.nodes.map((n) => `${n.x.toFixed(3)},${n.y.toFixed(3)}`)
    );
    expect(spots.size).toBe(ids.length);
    expect(layoutTree(ids, edges)).toEqual(t);
  });

  it('wraps a shallow, wide graph into rows so it fills a screen', () => {
    const next = random(11);
    const ids = Array.from({ length: 640 }, (_, i) => `s${i}`);
    const edges: TreeLayoutEdge[] = [];
    // Eight tiers: each node rests on a few in lower tiers.
    for (let i = 80; i < ids.length; i++)
      for (let k = 0; k < 3; k++) {
        const below = Math.floor(next() * Math.floor(i / 80) * 80);
        edges.push(strong(ids[below] as string, ids[i] as string));
      }
    const t = layoutTree(ids, edges);
    expect(t.width / t.height).toBeGreaterThan(1.2);
    expect(t.width / t.height).toBeLessThan(2.2);
  });
});

describe('fixed levels', () => {
  it('puts each node on the level asked, edges or not, with no shelf', () => {
    const layout = layoutTree(
      ['skill', 'job', 'lonely', 'role'],
      [{ from: 'skill', to: 'job', strength: 'strong' }],
      { levels: [0, 3, 1, 3] }
    );
    expect(layout.nodes.map((n) => n.level)).toEqual([0, 3, 1, 3]);
    // Level 2 holds nothing: no band for it, and nothing on the shelf.
    expect(layout.bands.map((b) => b.level)).toEqual([3, 1, 0]);
    expect(layout.edges).toHaveLength(1);
  });
});
