import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * K-Nearest Neighbors algorithm
 * Optimized to pre-compute similarity matrix
 */
export const knn = {
  name: 'K-Nearest Neighbors',
  compute: (nodes, K = 3, minSimilarity = 0.5) => {
    const links = new Set();
    const n = nodes.length;

    // Pre-compute similarity matrix for all node pairs
    // This avoids redundant calculations in the original implementation
    const similarities = new Array(n);
    for (let i = 0; i < n; i++) {
      similarities[i] = [];
      for (let j = 0; j < n; j++) {
        if (i === j) {
          similarities[i][j] = { index: j, similarity: -1 };
        } else {
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          similarities[i][j] = { index: j, similarity };
        }
      }
    }

    // Find K nearest neighbors for each node
    for (let i = 0; i < n; i++) {
      similarities[i]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, K)
        .forEach(({ index, similarity }) => {
          if (similarity > minSimilarity) {
            links.add({
              source: nodes[i].id,
              target: nodes[index].id,
              value: similarity,
            });
          }
        });
    }

    return Array.from(links);
  },
};
