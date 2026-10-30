import { EXACT_SUPPORT_LIMIT, groupNodes } from './layout-groups';
import { orderLevels } from './layout-order';
import { placeLevels } from './layout-place';
import type {
  PlacedEdge,
  ResolvedEdge,
  TreeLayout,
  TreeLayoutEdge,
  TreeLayoutOptions,
} from './layout-types';

/**
 * Places a whole graph as one tree: what everything rests on at the bottom,
 * what rests on the most at the top. Pure and deterministic: the same nodes
 * and edges always give the same picture, so a reader can learn where things
 * are. Edges run from a foundation to what rests on it (see layout-types).
 */
export function layoutTree(
  ids: readonly string[],
  edges: readonly TreeLayoutEdge[],
  options: TreeLayoutOptions = {}
): TreeLayout {
  const n = ids.length;
  const index = new Map<string, number>();
  ids.forEach((id, i) => {
    if (!index.has(id)) index.set(id, i);
  });
  const resolved: ResolvedEdge[] = [];
  edges.forEach((e, i) => {
    const a = index.get(e.from);
    const b = index.get(e.to);
    if (a === undefined || b === undefined || a === b) return;
    resolved.push({ a, b, strength: e.strength, i });
  });

  const { groupOf, members, dag, dropped, level, support } = groupNodes(
    n,
    resolved
  );
  const groups = members.length;
  const alone = (g: number) =>
    (members[g]?.length ?? 0) === 1 &&
    dag.inputs(g).length === 0 &&
    dag.outputs(g).length === 0;

  const levels: number[][] = [];
  const shelf: number[] = [];
  for (let g = 0; g < groups; g++) {
    if (alone(g)) {
      shelf.push(g);
      continue;
    }
    const l = level[g] as number;
    while (levels.length <= l) levels.push([]);
    levels[l]?.push(g);
  }
  orderLevels(levels, dag, support);

  const placed = placeLevels({
    n,
    levels,
    shelf,
    members,
    groupOf,
    support,
    spacing: options.spacing ?? 28,
    rowGap: options.rowGap ?? 40,
    levelGap: options.levelGap ?? 72,
    aspect: options.aspect ?? 1.6,
  });

  // One drawn edge per pair of nodes: the first passed wins, so pass the strongest first.
  const drawn: PlacedEdge[] = [];
  const pairs = new Set<number>();
  for (const e of resolved) {
    const pair = Math.min(e.a, e.b) * n + Math.max(e.a, e.b);
    if (dropped.has(e.i) || pairs.has(pair)) continue;
    pairs.add(pair);
    drawn.push({ from: e.a, to: e.b, source: e.i });
  }
  return {
    nodes: placed.nodes,
    groups: Array.from(groupOf),
    edges: drawn,
    bands: placed.bands,
    width: placed.width,
    height: placed.height,
    dropped: dropped.size,
    supportMode: groups > EXACT_SUPPORT_LIMIT ? 'direct' : 'transitive',
  };
}
