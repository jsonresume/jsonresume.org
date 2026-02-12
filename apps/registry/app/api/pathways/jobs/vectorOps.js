/**
 * Fast vector operations for cosine similarity calculations.
 * Pre-normalizes vectors so similarity = dot product (no sqrt per comparison).
 */

/**
 * Dot product of two vectors (loop-based, avoids Array.reduce overhead)
 */
export function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

/**
 * Normalize a vector in place (mutating for performance).
 * Returns the magnitude for validation.
 */
export function normalizeInPlace(vec) {
  let sumSq = 0;
  for (let i = 0; i < vec.length; i++) {
    sumSq += vec[i] * vec[i];
  }
  const mag = Math.sqrt(sumSq);
  if (mag === 0) return 0;
  for (let i = 0; i < vec.length; i++) {
    vec[i] /= mag;
  }
  return mag;
}

/**
 * Pre-normalize all embeddings in a Map (mutating).
 * After normalization, cosine similarity = dot product.
 */
export function preNormalizeAll(embeddingMap) {
  for (const [, vec] of embeddingMap) {
    normalizeInPlace(vec);
  }
}
