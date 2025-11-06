import {
  cosineSimilarity,
  getAverageEmbedding,
} from '../../../utils/vectorUtils';
import { GRAPH_CONFIG } from '../constants/graphConfig';

/**
 * Group resume items by position
 * @param {Array} data - Array of resume items
 * @returns {Object} Position groups
 */
export function groupByPosition(data) {
  const positionGroups = {};
  data.forEach((item) => {
    const position = item.position;
    if (!positionGroups[position]) {
      positionGroups[position] = [];
    }
    positionGroups[position].push(item);
  });
  return positionGroups;
}

/**
 * Create graph nodes from position groups
 * @param {Object} positionGroups - Grouped positions
 * @returns {Array} Graph nodes
 */
export function createNodes(positionGroups) {
  const nodes = [];
  Object.entries(positionGroups).forEach(([position, items], index) => {
    const embeddings = items.map((item) => item.embedding);
    // Pre-compute average embedding for efficient similarity comparisons
    const avgEmbedding = getAverageEmbedding(embeddings);

    nodes.push({
      id: position,
      group: index,
      size: Math.log(items.length + 1) * GRAPH_CONFIG.nodeSizeScale,
      count: items.length,
      usernames: items.map((item) => item.username),
      embeddings,
      avgEmbedding, // Store pre-computed average for O(1) comparisons
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    });
  });
  return nodes;
}

/**
 * Create graph links between similar nodes
 * OPTIMIZED: Uses pre-computed average embeddings to reduce complexity from O(n²×m²) to O(n²)
 * where n = number of nodes, m = embeddings per node
 * @param {Array} nodes - Graph nodes with avgEmbedding pre-computed
 * @returns {Array} Graph links
 */
export function createLinks(nodes) {
  const links = [];
  const { similarityThreshold } = GRAPH_CONFIG;

  // Use pre-computed average embeddings for O(n²) instead of O(n²×m²)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Single similarity calculation using average embeddings
      const similarity = cosineSimilarity(
        nodes[i].avgEmbedding,
        nodes[j].avgEmbedding
      );

      if (similarity > similarityThreshold) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          value: similarity,
        });
      }
    }
  }

  return links;
}

/**
 * Process raw data into graph structure
 * @param {Array} data - Raw data from API
 * @returns {Object} Graph data with nodes and links
 */
export function processGraphData(data) {
  const positionGroups = groupByPosition(data);
  const nodes = createNodes(positionGroups);
  const links = createLinks(nodes);
  return { nodes, links };
}
