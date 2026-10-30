/** A directed acyclic graph with a deterministic topological order (call `sort` once). */
export class Dag {
  private readonly out: number[][];
  private readonly in: number[][];
  private readonly edges = new Set<number>();
  private readonly ord: Int32Array;
  private readonly byOrd: Int32Array;

  constructor(private readonly n: number) {
    this.out = Array.from({ length: n }, () => []);
    this.in = Array.from({ length: n }, () => []);
    this.ord = new Int32Array(n);
    this.byOrd = new Int32Array(n);
  }

  inputs(g: number): readonly number[] {
    return this.in[g] ?? [];
  }

  outputs(g: number): readonly number[] {
    return this.out[g] ?? [];
  }

  topological(): readonly number[] {
    return Array.from(this.byOrd);
  }

  add(a: number, b: number) {
    if (a === b || this.edges.has(a * this.n + b)) return;
    this.edges.add(a * this.n + b);
    this.out[a]?.push(b);
    this.in[b]?.push(a);
  }

  /** Kahn's algorithm, lowest index first among the ready, so the order never varies. */
  sort() {
    const indegree = Int32Array.from(
      { length: this.n },
      (_, g) => this.in[g]?.length ?? 0
    );
    const ready = new MinHeap();
    for (let g = 0; g < this.n; g++) if (!indegree[g]) ready.push(g);
    let k = 0;
    while (ready.size) {
      const g = ready.pop();
      this.byOrd[k] = g;
      this.ord[g] = k++;
      for (const o of this.out[g] ?? []) {
        indegree[o] = (indegree[o] ?? 0) - 1;
        if (!indegree[o]) ready.push(o);
      }
    }
    if (k !== this.n)
      throw new Error('layoutTree: the edges still form a loop');
  }

  /** Whether b can be reached from a; only searches the stretch of the order between them. */
  reaches(a: number, b: number): boolean {
    const limit = this.ord[b] ?? 0;
    if ((this.ord[a] ?? 0) > limit) return false;
    const seen = new Set<number>([a]);
    const todo = [a];
    while (todo.length) {
      const v = todo.pop() as number;
      if (v === b) return true;
      for (const w of this.out[v] ?? [])
        if (!seen.has(w) && (this.ord[w] ?? 0) <= limit) {
          seen.add(w);
          todo.push(w);
        }
    }
    return false;
  }
}

class MinHeap {
  private readonly items: number[] = [];

  get size() {
    return this.items.length;
  }

  push(value: number) {
    const items = this.items;
    items.push(value);
    let i = items.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      const parent = items[p] as number;
      if (parent <= value) break;
      items[i] = parent;
      i = p;
    }
    items[i] = value;
  }

  pop(): number {
    const items = this.items;
    const top = items[0] as number;
    const last = items.pop() as number;
    if (items.length) {
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let m = i;
        let v = last;
        if (l < items.length && (items[l] as number) < v) {
          m = l;
          v = items[l] as number;
        }
        if (r < items.length && (items[r] as number) < v) m = r;
        if (m === i) break;
        items[i] = items[m] as number;
        i = m;
      }
      items[i] = last;
    }
    return top;
  }
}
