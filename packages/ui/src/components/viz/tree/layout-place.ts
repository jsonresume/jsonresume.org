import type { PlacedNode, TreeBand } from './layout-types';

export interface PlaceInput {
  n: number;
  /** Groups per level, bottom first, in their final order. */
  levels: number[][];
  /** Groups with no edges at all. */
  shelf: number[];
  members: number[][];
  groupOf: Int32Array;
  support: Int32Array;
  spacing: number;
  rowGap: number;
  levelGap: number;
  aspect: number;
}

/**
 * Step 6: wraps long levels into rows so the whole picture has the aimed-for
 * shape, then places every node, top level first, with the shelf to the right.
 */
export function placeLevels(input: PlaceInput) {
  const { n, levels, shelf, members, groupOf, support } = input;
  const { spacing, rowGap, levelGap, aspect } = input;
  const slots = levels.map((level) =>
    level.reduce((s, g) => s + (members[g]?.length ?? 0), 0)
  );
  const shelfCount = shelf.length;
  const shelfCols = shelfCount
    ? Math.max(1, Math.ceil(Math.sqrt(shelfCount * 2)))
    : 0;
  const shelfRows = shelfCount ? Math.ceil(shelfCount / shelfCols) : 0;
  const widest = Math.max(1, ...slots);
  let columns = widest;
  let best = Number.POSITIVE_INFINITY;
  for (let c = 1; c <= widest; c++) {
    const rows = slots.reduce((s, k) => s + Math.max(1, Math.ceil(k / c)), 0);
    const height = rows * rowGap + Math.max(0, slots.length - 1) * levelGap;
    const width = (c + (shelfCols ? shelfCols + 3 : 0)) * spacing;
    const miss = Math.abs(Math.log(width / Math.max(height, 1) / aspect));
    if (miss < best - 1e-9) {
      best = miss;
      columns = c;
    }
  }

  const nodes: PlacedNode[] = Array.from({ length: n }, () => ({
    x: 0,
    y: 0,
    level: -1,
    support: 0,
  }));
  const bands: TreeBand[] = [];
  const mainWidth = columns * spacing;
  let y = 0;
  for (let l = levels.length - 1; l >= 0; l--) {
    const order = (levels[l] ?? []).flatMap((g) => members[g] ?? []);
    const rows = Math.max(1, Math.ceil(order.length / columns));
    const top = y;
    for (let r = 0; r < rows; r++) {
      const row = order.slice(r * columns, (r + 1) * columns);
      const left = (mainWidth - row.length * spacing) / 2;
      row.forEach((i, c) => {
        const node = nodes[i];
        if (!node) return;
        node.x = left + (c + 0.5) * spacing;
        node.y = y + rowGap / 2;
        node.level = l;
        node.support = support[groupOf[i] as number] as number;
      });
      y += rowGap;
    }
    bands.push({ level: l, left: 0, right: mainWidth, top, bottom: y });
    if (l > 0) y += levelGap;
  }
  let width = levels.length ? mainWidth : 0;
  if (shelfCount) {
    const left = levels.length ? mainWidth + 3 * spacing : 0;
    const bottom = Math.max(y, shelfRows * rowGap);
    const top = bottom - shelfRows * rowGap;
    shelf.forEach((g, k) => {
      const node = nodes[members[g]?.[0] ?? -1];
      if (!node) return;
      node.x = left + ((k % shelfCols) + 0.5) * spacing;
      node.y = top + Math.floor(k / shelfCols) * rowGap + rowGap / 2;
      node.level = -1;
      node.support = 0;
    });
    bands.push({
      level: -1,
      left,
      right: left + shelfCols * spacing,
      top,
      bottom,
    });
    width = left + shelfCols * spacing;
    y = bottom;
  }
  return { nodes, bands, width, height: y };
}
