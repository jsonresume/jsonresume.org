/**
 * Vector utility functions for similarity calculations
 * Shared across similarity and job-similarity features
 */

/**
 * Compute cosine similarity between two vectors
 * Optimized to calculate dot product and magnitudes in a single pass
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} Similarity score between 0 and 1
 */
export const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;

  // Single pass calculation for better performance
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) return 0;

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
 * Optimized to reduce memory allocations
 * @param {number[][]} embeddings - Array of embedding vectors
 * @returns {number[]|null} Average embedding or null if invalid
 */
export const getAverageEmbedding = (embeddings) => {
  if (!Array.isArray(embeddings) || embeddings.length === 0) return null;

  const length = embeddings[0].length;
  const sum = new Array(length).fill(0);
  const count = embeddings.length;

  // Single loop through all embeddings
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < length; j++) {
      sum[j] += embeddings[i][j];
    }
  }

  // Divide by count to get average
  for (let j = 0; j < length; j++) {
    sum[j] /= count;
  }

  return sum;
};
