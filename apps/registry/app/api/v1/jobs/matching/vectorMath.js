/**
 * Pure vector math and scoring utilities used by the jobs matcher.
 */

/** Normalize a vector to unit length */
export function normalize(vec) {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  if (norm === 0) {
    return vec;
  }
  return vec.map((v) => v / norm);
}

/** Weighted interpolation of two vectors, normalized */
export function interpolate(vecA, vecB, alpha) {
  const blended = vecA.map((v, i) => alpha * v + (1 - alpha) * vecB[i]);
  return normalize(blended);
}

/** Subtract a direction from a vector (for negative feedback) */
export function subtractDirection(vec, negVec, weight = 0.15) {
  const adjusted = vec.map((v, i) => v - weight * negVec[i]);
  return normalize(adjusted);
}

/** Compute average embedding from a list of embeddings */
export function averageEmbeddings(embeddings) {
  if (!embeddings.length) {
    return null;
  }
  const dim = embeddings[0].length;
  const avg = new Array(dim).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) {
      avg[i] += emb[i];
    }
  }
  for (let i = 0; i < dim; i++) {
    avg[i] /= embeddings.length;
  }
  return normalize(avg);
}

/**
 * Apply time-decay boost: more recent jobs get a recency bonus.
 * Uses exponential decay with half-life of 14 days.
 *
 * Weights: raw cosine similarities for resume-vs-job cluster in a compressed
 * ~0.37-0.44 band (spread ~0.07), so a large recency term drowns the entire
 * relevance signal — the 2026-07 ranking eval measured a 0.15 recency weight
 * outweighing relevance 2.2x and putting stale-stack mismatches at #1.
 * 0.05 keeps freshness as a tiebreaker within the band, never the headline.
 */
export function timeDecayScore(similarity, postedAt) {
  if (!postedAt) {
    return similarity;
  }
  const ageMs = Date.now() - new Date(postedAt).getTime();
  const ageDays = ageMs / 86400000;
  const halfLife = 14;
  const recencyBoost = Math.pow(0.5, ageDays / halfLife);
  return 0.95 * similarity + 0.05 * recencyBoost;
}

/**
 * Weighted sum of N vectors, normalized. Used for prompt-steered search
 * embeddings (HyDE doc + raw prompt + resume).
 * @param {Array<[number[], number]>} pairs - [vector, weight] pairs
 */
export function weightedBlend(pairs) {
  const usable = pairs.filter(([v]) => Array.isArray(v) && v.length > 0);
  if (usable.length === 0) {
    return null;
  }
  const dim = usable[0][0].length;
  const out = new Array(dim).fill(0);
  for (const [vec, weight] of usable) {
    for (let i = 0; i < dim; i++) {
      out[i] += weight * vec[i];
    }
  }
  return normalize(out);
}
