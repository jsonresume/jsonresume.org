import { cosineSimilarity } from '../../../utils/vectorUtils';

/**
 * Hierarchical Clustering algorithm
 */
export const hierarchical = {
  name: 'Hierarchical Clustering',
  compute: (nodes, threshold = 0.5) => {
    const links = new Set();
    let clusters = new Array(nodes.length).fill(0).map((_, i) => [i]);
    const similarities = [];

    // Calculate all pairwise similarities
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        similarities.push({ i, j, similarity });
      }
    }

    // Sort by similarity descending
    similarities.sort((a, b) => b.similarity - a.similarity);

    // Merge clusters and add links
    similarities.forEach(({ i, j, similarity }) => {
      if (similarity > threshold) {
        const cluster1 = clusters.find((c) => c.includes(i));
        const cluster2 = clusters.find((c) => c.includes(j));

        if (cluster1 !== cluster2) {
          // Add links between closest points in clusters
          links.add({
            source: nodes[i].id,
            target: nodes[j].id,
            value: similarity,
          });

          // Merge clusters
          const merged = [...cluster1, ...cluster2];
          clusters = clusters.filter((c) => c !== cluster1 && c !== cluster2);
          clusters.push(merged);
        }
      }
    });

    return Array.from(links);
  },
};
