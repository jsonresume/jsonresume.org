import type { CareerEdge, CareerNode } from '@repo/api';

type Levels = CareerNode['levels'];
const NONE: Levels = {
  meaning: null,
  distance: null,
  seniority: null,
  time: null,
};

/** A node as the builders add it: levels default to "not in that view". */
export type NodeInput = Omit<
  CareerNode,
  'levels' | 'jobId' | 'score' | 'year'
> &
  Partial<Pick<CareerNode, 'jobId' | 'score' | 'year'>> & {
    levels: Partial<Levels>;
  };

/**
 * The graph as it's built: nodes added once by id, edges once per pair
 * (keeping the strongest weight and the first reason given).
 */
export const draft = () => {
  const nodes: CareerNode[] = [];
  const index = new Map<string, number>();
  const edges = new Map<string, CareerEdge>();

  const add = (n: NodeInput): number => {
    const found = index.get(n.id);
    if (found !== undefined) return found;
    index.set(n.id, nodes.length);
    nodes.push({
      jobId: null,
      score: null,
      year: null,
      ...n,
      levels: { ...NONE, ...n.levels },
    });
    return nodes.length - 1;
  };

  const link = (
    from: number | undefined,
    to: number | undefined,
    weight: number,
    why: string | null = null
  ) => {
    if (from === undefined || to === undefined || from === to) return;
    const key = `${from}>${to}`;
    const had = edges.get(key);
    edges.set(key, {
      from,
      to,
      weight: Math.max(had?.weight ?? 0, Math.round(weight * 100) / 100),
      why: had?.why ?? why,
    });
  };

  return {
    add,
    link,
    at: (id: string) => index.get(id),
    node: (i: number) => nodes[i],
    hasIncoming: (i: number) => [...edges.values()].some((e) => e.to === i),
    done: () => ({ nodes, edges: [...edges.values()] }),
  };
};
export type Draft = ReturnType<typeof draft>;
