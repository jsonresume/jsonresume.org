import type { TreeMapEdge, TreeMapNode } from '@jsonresume/ui';
import { layoutTree, type TreeBand } from '@jsonresume/ui/tree-layout';
import type { CareerTree, CareerTreeNode } from '@repo/api';

const KIND_LABEL: Record<CareerTreeNode['kind'], string> = {
  skill: 'Skills',
  gap: 'Skills',
  experience: 'Your experience',
  direction: 'Kinds of role',
  job: 'Jobs',
};

export interface TreeModel {
  nodes: TreeMapNode[];
  edges: TreeMapEdge[];
  bands: readonly TreeBand[];
  bandLabel: (band: TreeBand) => string;
  /** What each square rests on, and what rests on it, by index. */
  below: number[][];
  above: number[][];
}

/**
 * The career tree placed for TreeMap: each square above what it rests on,
 * bands named for what they mostly hold (skills at the bottom, jobs on top),
 * shaped to `aspect` (width:height) when given.
 */
export const treeModel = (tree: CareerTree, aspect?: number): TreeModel => {
  const ids = tree.nodes.map((n) => n.id);
  const layout = layoutTree(
    ids,
    tree.edges.flatMap((e) => {
      const from = ids[e.from];
      const to = ids[e.to];
      return from && to ? [{ from, to, strength: 'strong' as const }] : [];
    }),
    aspect === undefined ? undefined : { aspect }
  );
  const nodes = tree.nodes.map((n, i): TreeMapNode => {
    const placed = layout.nodes[i];
    return {
      id: n.id,
      label: n.label,
      detail: n.detail ?? undefined,
      tone: n.tone,
      x: placed?.x ?? 0,
      y: placed?.y ?? 0,
      level: placed?.level ?? -1,
      support: placed?.support ?? 0,
    };
  });
  const below = tree.nodes.map((): number[] => []);
  const above = tree.nodes.map((): number[] => []);
  for (const e of layout.edges) {
    below[e.to]?.push(e.from);
    above[e.from]?.push(e.to);
  }
  // A band is named for the kind most of its squares are.
  const names = new Map<number, string>();
  for (const level of new Set(nodes.map((n) => n.level))) {
    const counts = new Map<string, number>();
    tree.nodes.forEach((n, i) => {
      if (nodes[i]?.level !== level) return;
      const label = KIND_LABEL[n.kind];
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (top) names.set(level, top[0]);
  }
  return {
    nodes,
    edges: layout.edges.map((e) => ({ from: e.from, to: e.to })),
    bands: layout.bands,
    bandLabel: (band) => names.get(band.level) ?? '',
    below,
    above,
  };
};

/**
 * What a square stands on, all the way down (a job's kind of role, the
 * experience under it, the skills), and what rests on it directly.
 */
export const related = (model: TreeModel, start: number): Set<number> => {
  const seen = new Set([start]);
  const down = (from: number) => {
    for (const next of model.below[from] ?? []) {
      if (seen.has(next)) continue;
      seen.add(next);
      down(next);
    }
  };
  down(start);
  for (const next of model.above[start] ?? []) seen.add(next);
  return seen;
};
