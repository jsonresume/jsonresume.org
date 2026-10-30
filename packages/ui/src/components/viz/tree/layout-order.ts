import type { Dag } from './dag';

/** Crossing-reduction sweeps: each alternates up and down; more rarely changes the order. */
const SWEEPS = 6;

/**
 * Step 5: orders each level to shorten edges, by barycentre sweeps up and
 * down. Starts from what holds the most up, so the busiest foundations take
 * the middle. Reorders `levels` in place.
 */
export function orderLevels(levels: number[][], dag: Dag, support: Int32Array) {
  const count = support.length;
  levels[0]?.sort(
    (x, y) => (support[y] as number) - (support[x] as number) || x - y
  );
  centreOut(levels[0] ?? []);
  const position = new Float64Array(count);
  const place = (level: number[]) => {
    const size = Math.max(1, level.length - 1);
    level.forEach((g, i) => {
      position[g] = level.length === 1 ? 0.5 : i / size;
    });
  };
  place(levels[0] ?? []);
  for (let l = 1; l < levels.length; l++) {
    orderBy(levels[l] ?? [], (g) => dag.inputs(g), position, support);
    place(levels[l] ?? []);
  }
  for (let sweep = 0; sweep < SWEEPS; sweep++) {
    const down = sweep % 2 === 0;
    const order = down
      ? Array.from({ length: levels.length }, (_, i) => levels.length - 1 - i)
      : levels.map((_, i) => i);
    for (const l of order) {
      const level = levels[l] ?? [];
      orderBy(
        level,
        (g) => (down ? dag.outputs(g) : dag.inputs(g)),
        position,
        support,
        (g) => [...dag.outputs(g), ...dag.inputs(g)]
      );
      place(level);
    }
  }
}

/** Reorders a level by the mean position of each group's neighbours; ties keep support order. */
function orderBy(
  level: number[],
  neighbours: (g: number) => readonly number[],
  position: Float64Array,
  support: Int32Array,
  fallback?: (g: number) => readonly number[]
) {
  const key = new Map<number, number>();
  level.forEach((g, i) => {
    let near = neighbours(g);
    if (!near.length && fallback) near = fallback(g);
    const spread = level.length > 1 ? i / (level.length - 1) : 0.5;
    key.set(
      g,
      near.length
        ? near.reduce((s, p) => s + (position[p] as number), 0) / near.length
        : spread
    );
  });
  level.sort(
    (x, y) =>
      (key.get(x) ?? 0) - (key.get(y) ?? 0) ||
      (support[y] as number) - (support[x] as number) ||
      x - y
  );
}

/** Largest first becomes largest in the middle: 5 3 1 2 4 from a descending list. */
function centreOut(level: number[]) {
  const out: number[] = [];
  level.forEach((g, i) => {
    if (i % 2 === 0) out.push(g);
    else out.unshift(g);
  });
  level.splice(0, level.length, ...out);
}
