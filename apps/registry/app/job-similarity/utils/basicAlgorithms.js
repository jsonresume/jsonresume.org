import { cosineSimilarity } from './vectorUtils';

/**
 * Minimum Spanning Tree algorithm
 */
export const mst = {
  name: 'Minimum Spanning Tree',
  compute: (nodes, minSimilarity = 0.3) => {
    // Kruskal's algorithm for MST
    const links = [];
    const parent = new Array(nodes.length).fill(0).map((_, i) => i);

    function find(x) {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function union(x, y) {
      parent[find(x)] = find(y);
    }

    // Create all possible edges with weights
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity = cosineSimilarity(
          nodes[i].avgEmbedding,
          nodes[j].avgEmbedding
        );
        if (similarity > minSimilarity) {
          edges.push({ i, j, similarity });
        }
      }
    }

    // Sort edges by similarity (descending)
    edges.sort((a, b) => b.similarity - a.similarity);

    // Build MST
    edges.forEach(({ i, j, similarity }) => {
      if (find(i) !== find(j)) {
        union(i, j);
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          value: similarity,
        });
      }
    });

    return links;
  },
};

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

/**
 * Adaptive Threshold algorithm
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
