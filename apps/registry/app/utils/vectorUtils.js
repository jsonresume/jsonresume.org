/**
 * Vector utility functions for similarity calculations
 * Shared across similarity and job-similarity features
 */

/**
 * Compute cosine similarity between two vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} Similarity score between 0 and 1
 */
export const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;

  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Normalize a vector to unit length
 * @param {number[]} vector - Vector to normalize
 * @returns {number[]|null} Normalized vector or null if invalid
 */
export const normalizeVector = (vector) => {
  if (!Array.isArray(vector) || vector.length === 0) return null;

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return null;

  return vector.map((val) => val / magnitude);
};

/**
 * Calculate average embedding from multiple embeddings
 * @param {number[][]} embeddings - Array of embedding vectors
 * @returns {number[]|null} Average embedding or null if invalid
 */
export const getAverageEmbedding = (embeddings) => {
  if (!Array.isArray(embeddings) || embeddings.length === 0) return null;

  const sum = embeddings.reduce((acc, curr) => {
    return acc.map((val, i) => val + curr[i]);
  }, new Array(embeddings[0].length).fill(0));

  return sum.map((val) => val / embeddings.length);
};
