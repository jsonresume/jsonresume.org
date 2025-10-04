import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * Similarity Threshold algorithm
 */
export const threshold = {
  name: 'Similarity Threshold',
  compute: (nodes, threshold = 0.7) => {
    const links = new Set();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        if (similarity > threshold) {
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
