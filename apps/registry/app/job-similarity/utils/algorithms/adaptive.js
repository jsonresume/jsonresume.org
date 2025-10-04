import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * Adaptive Threshold algorithm
 * Calculates threshold based on mean and standard deviation of similarities
 */
export const adaptive = {
  name: 'Adaptive Threshold',
  compute: (nodes) => {
    const links = new Set();
    const similarities = [];

    // Calculate all pairwise similarities
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        similarities.push(similarity);
      }
    }

    // Calculate adaptive threshold using mean and standard deviation
    const mean = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    const std = Math.sqrt(
      similarities.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
        similarities.length
    );
    const adaptiveThreshold = mean + 0.5 * std;

    // Create links based on adaptive threshold
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        if (similarity > adaptiveThreshold) {
          links.add({
            source: nodes[i].id,
            target: nodes[j].id,
            value: similarity,
          });
        }
      }
    }

    return Array.from(links);
  },
};
