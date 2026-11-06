import { Dag } from './dag';
import type { ResolvedEdge } from './layout-types';

/** Above this many groups, `support` counts direct dependants only (the exact count is quadratic). */
export const EXACT_SUPPORT_LIMIT = 20_000;

export interface Grouped {
  /** The group (shared level) of each node. */
  groupOf: Int32Array;
  members: number[][];
  /** Edges between groups, sorted. */
  dag: Dag;
  /** Weak edges left out, by their index in the edges passed in. */
  dropped: Set<number>;
  level: Int32Array;
  support: Int32Array;
}

/**
 * Steps 1 to 4: groups that share a level (the same thing, loops of strong
 * edges, loops of weak ones), weak edges against strong chains left out, each
 * group's level (the longest chain beneath it) and support (what rests on it).
 */
export function groupNodes(
  n: number,
  resolved: readonly ResolvedEdge[]
): Grouped {
  const parent = Int32Array.from({ length: n }, (_, i) => i);
  const find = (i: number): number => {
    let r = i;
    while (parent[r] !== r) r = parent[r] as number;
    while (parent[i] !== r) {
      const next = parent[i] as number;
      parent[i] = r;
      i = next;
    }
    return r;
  };
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb);
  };
  const merge = (among: readonly ResolvedEdge[]) => {
    const pairs = among.map((e) => [find(e.a), find(e.b)] as const);
    for (const scc of stronglyConnected(n, pairs))
      for (const v of scc) union(scc[0] as number, v);
  };
  for (const e of resolved) if (e.strength === 'same') union(e.a, e.b);
  const strong = resolved.filter((e) => e.strength === 'strong');
  merge(strong);

  const chains = new Dag(n);
  for (const e of strong) chains.add(find(e.a), find(e.b));
  chains.sort();
  const dropped = new Set<number>();
  for (const e of resolved)
    if (
      e.strength === 'weak' &&
      find(e.a) !== find(e.b) &&
      chains.reaches(find(e.b), find(e.a))
    )
      dropped.add(e.i);
  const directed = resolved.filter(
    (e) =>
      e.strength === 'strong' || (e.strength === 'weak' && !dropped.has(e.i))
  );
  merge(directed);

  const groupOf = new Int32Array(n);
  const rootIndex = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const r = find(i);
    let g = rootIndex.get(r);
    if (g === undefined) {
      g = rootIndex.size;
      rootIndex.set(r, g);
    }
    groupOf[i] = g;
  }
  const count = rootIndex.size;
  const members: number[][] = Array.from({ length: count }, () => []);
  for (let i = 0; i < n; i++) members[groupOf[i] as number]?.push(i);
  const dag = new Dag(count);
  for (const e of directed)
    dag.add(groupOf[e.a] as number, groupOf[e.b] as number);
  dag.sort();

  const level = new Int32Array(count);
  for (const g of dag.topological()) {
    let l = 0;
    for (const p of dag.inputs(g)) l = Math.max(l, (level[p] as number) + 1);
    level[g] = l;
  }
  return {
    groupOf,
    members,
    dag,
    dropped,
    level,
    support: groupSupport(dag, members),
  };
}

function groupSupport(dag: Dag, members: number[][]): Int32Array {
  const count = members.length;
  const support = new Int32Array(count);
  const order = dag.topological();
  if (count > EXACT_SUPPORT_LIMIT) {
    for (let g = 0; g < count; g++)
      support[g] = dag
        .outputs(g)
        .reduce((s, o) => s + (members[o]?.length ?? 0), 0);
    return support;
  }
  const words = Math.ceil(count / 32);
  const above = new Uint32Array(count * words);
  for (let k = order.length - 1; k >= 0; k--) {
    const g = order[k] as number;
    const row = g * words;
    for (const o of dag.outputs(g)) {
      above[row + (o >> 5)] =
        (above[row + (o >> 5)] as number) | (1 << (o & 31));
      const other = o * words;
      for (let w = 0; w < words; w++)
        above[row + w] =
          (above[row + w] as number) | (above[other + w] as number);
    }
    let total = 0;
    for (let w = 0; w < words; w++) {
      let bits = above[row + w] as number;
      while (bits) {
        const low = bits & -bits;
        total += members[(w << 5) + (31 - Math.clz32(low))]?.length ?? 0;
        bits ^= low;
      }
    }
    support[g] = total;
  }
  return support;
}

/** Tarjan's strongly connected components (iterative), only those with two or more members. */
function stronglyConnected(
  n: number,
  edges: readonly (readonly [number, number])[]
): number[][] {
  const out: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) if (a !== b) out[a]?.push(b);
  const index = new Int32Array(n).fill(-1);
  const low = new Int32Array(n);
  const onStack = new Uint8Array(n);
  const stack: number[] = [];
  const found: number[][] = [];
  let next = 0;
  for (let s = 0; s < n; s++) {
    if (index[s] !== -1 || !out[s]?.length) continue;
    const work: [number, number][] = [[s, 0]];
    index[s] = low[s] = next++;
    stack.push(s);
    onStack[s] = 1;
    while (work.length) {
      const top = work[work.length - 1] as [number, number];
      const [v, i] = top;
      const targets = out[v] ?? [];
      if (i < targets.length) {
        top[1]++;
        const w = targets[i] as number;
        if (index[w] === -1) {
          index[w] = low[w] = next++;
          stack.push(w);
          onStack[w] = 1;
          work.push([w, 0]);
        } else if (onStack[w])
          low[v] = Math.min(low[v] as number, index[w] as number);
        continue;
      }
      work.pop();
      const up = work[work.length - 1];
      if (up) low[up[0]] = Math.min(low[up[0]] as number, low[v] as number);
      if (low[v] === index[v]) {
        const scc: number[] = [];
        let w: number;
        do {
          w = stack.pop() as number;
          onStack[w] = 0;
          scc.push(w);
        } while (w !== v);
        if (scc.length > 1) found.push(scc.sort((x, y) => x - y));
      }
    }
  }
  return found;
}
