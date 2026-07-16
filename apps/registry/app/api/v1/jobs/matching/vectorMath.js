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
 */
export function timeDecayScore(similarity, postedAt) {
  if (!postedAt) {
    return similarity;
  }
  const ageMs = Date.now() - new Date(postedAt).getTime();
  const ageDays = ageMs / 86400000;
  const halfLife = 14;
  const recencyBoost = Math.pow(0.5, ageDays / halfLife);
  return 0.85 * similarity + 0.15 * recencyBoost;
}
