import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * K-Nearest Neighbors algorithm
 */
export const knn = {
  name: 'K-Nearest Neighbors',
  compute: (nodes, K = 3, minSimilarity = 0.5) => {
    const links = new Set();
    nodes.forEach((node, i) => {
      const similarities = nodes.map((otherNode, j) => ({
        index: j,
        similarity:
          i === j
            ? -1
            : cosineSimilarity(node.avgEmbedding, otherNode.avgEmbedding),
      }));

      similarities
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
    });
    return Array.from(links);
  },
};
