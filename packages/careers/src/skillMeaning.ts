import type { Skill } from './services';
import { cosine } from './skillNames';

/** How alike two names must be, by meaning, to be one skill. */
export const SAME = 0.9;

export interface Placed {
  /** Names that are a known skill by meaning. */
  known: Map<string, Skill>;
  /** Names alike another new name in the same batch: name to that name. */
  twins: Map<string, string>;
  /** Names that become new skills, with their vectors. */
  fresh: Array<{ key: string; vector: Float32Array }>;
}

/** The index of the most alike vector, at least SAME; -1 for none. */
const nearest = (v: Float32Array, pool: ReadonlyArray<Float32Array>) => {
  let best = -1;
  let score = SAME;
  pool.forEach((c, i) => {
    const s = cosine(v, c);
    if (s >= score) [best, score] = [i, s];
  });
  return best;
};

/**
 * New names placed by meaning: each is a known skill when one is alike
 * enough, else alike an earlier new name in the batch, else a new skill.
 */
export const placeByMeaning = (
  names: ReadonlyArray<{ key: string; vector: Float32Array }>,
  known: ReadonlyArray<{ skill: Skill; vector: Float32Array }>
): Placed => {
  const placed: Placed = { known: new Map(), twins: new Map(), fresh: [] };
  const knownVectors = known.map((k) => k.vector);
  for (const { key, vector } of names) {
    const old = known[nearest(vector, knownVectors)];
    if (old) {
      placed.known.set(key, old.skill);
      continue;
    }
    const twin =
      placed.fresh[
        nearest(
          vector,
          placed.fresh.map((f) => f.vector)
        )
      ];
    if (twin) placed.twins.set(key, twin.key);
    else placed.fresh.push({ key, vector });
  }
  return placed;
};
