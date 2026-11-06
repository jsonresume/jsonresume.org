import type { TreeMapEdge, TreeMapNode } from '@jsonresume/ui';
import { layoutTree, type TreeBand } from '@jsonresume/ui/tree-layout';
import type { CareerEdge, CareerGraph, CareerView } from '@repo/api';

export interface MapOptions {
  view: CareerView;
  /** Jobs below this fit are left off. */
  minFit: number;
  /** Width:height to aim the layout at (taller on phones). */
  aspect?: number;
}

export interface MapModel {
  nodes: TreeMapNode[];
  edges: TreeMapEdge[];
  bands: readonly TreeBand[];
  bandLabel: (band: TreeBand) => string;
  /** The graph's node for each map square. */
  source: number[];
  /** By map square: what it rests on (with the edge), and what rests on it. */
  below: { from: number; edge: CareerEdge }[][];
  above: number[][];
}

/**
 * The squares a view shows, each on that view's level, placed by TreeMap's
 * layout: a square without a level in the view isn't drawn in it.
 */
export const mapModel = (graph: CareerGraph, options: MapOptions): MapModel => {
  const { view, minFit } = options;
  const source: number[] = [];
  const at = new Map<number, number>();
  graph.nodes.forEach((n, i) => {
    if (n.levels[view] === null) return;
    if (n.kind === 'job' && (n.score ?? 0) < minFit) return;
    at.set(i, source.length);
    source.push(i);
  });
  const kept = graph.edges.flatMap((e) => {
    const from = at.get(e.from);
    const to = at.get(e.to);
    return from === undefined || to === undefined ? [] : [{ from, to, e }];
  });
  const ids = source.map((i) => graph.nodes[i]?.id ?? String(i));
  const layout = layoutTree(
    ids,
    kept.map(({ from, to }) => ({
      from: ids[from] ?? '',
      to: ids[to] ?? '',
      strength: 'strong' as const,
    })),
    {
      levels: source.map((i) => graph.nodes[i]?.levels[view] ?? 0),
      ...(options.aspect !== undefined && { aspect: options.aspect }),
    }
  );
  const nodes = source.map((i, k): TreeMapNode => {
    const n = graph.nodes[i];
    const placed = layout.nodes[k];
    return {
      id: n?.id ?? String(i),
      label: n?.label ?? '',
      detail: n?.detail ?? undefined,
      tone: n?.tone ?? 'open',
      x: placed?.x ?? 0,
      y: placed?.y ?? 0,
      level: placed?.level ?? 0,
      support: placed?.support ?? 0,
    };
  });
  const below = source.map((): { from: number; edge: CareerEdge }[] => []);
  const above = source.map((): number[] => []);
  for (const { from, to, e } of kept) {
    below[to]?.push({ from, edge: e });
    above[from]?.push(to);
  }
  const names = graph.bands[view];
  return {
    nodes,
    edges: layout.edges.map((e) => ({ from: e.from, to: e.to })),
    bands: layout.bands,
    bandLabel: (band) => names[band.level] ?? '',
    source,
    below,
    above,
  };
};

/** A square, all it stands on, and what rests on it directly. */
export const related = (model: MapModel, start: number): Set<number> => {
  const seen = new Set([start]);
  const down = (i: number) => {
    for (const { from } of model.below[i] ?? []) {
      if (seen.has(from)) continue;
      seen.add(from);
      down(from);
    }
  };
  down(start);
  for (const next of model.above[start] ?? []) seen.add(next);
  return seen;
};
