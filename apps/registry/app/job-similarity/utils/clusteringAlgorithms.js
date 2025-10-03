import { cosineSimilarity } from '../../utils/vectorUtils';

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

/**
 * Community Detection algorithm
 */
export const community = {
  name: 'Community Detection',
  compute: (nodes, threshold = 0.5, communityThreshold = 0.6) => {
    const links = new Set();
    const communities = new Map();
    let communityId = 0;

    // First pass: create initial communities based on strong similarities
    for (let i = 0; i < nodes.length; i++) {
      if (!communities.has(i)) {
        const community = new Set([i]);
        communities.set(i, communityId);

        // Find strongly connected nodes
        for (let j = 0; j < nodes.length; j++) {
          if (i !== j && !communities.has(j)) {
            const similarity = cosineSimilarity(
              nodes[i].avgEmbedding,
              nodes[j].avgEmbedding
            );
            if (similarity > communityThreshold) {
              community.add(j);
              communities.set(j, communityId);
            }
          }
        }
        communityId++;
      }
    }

    // Second pass: connect communities
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        const sameCommunity = communities.get(i) === communities.get(j);

        // Add links within communities and strong links between communities
        if (similarity > (sameCommunity ? threshold : communityThreshold)) {
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
