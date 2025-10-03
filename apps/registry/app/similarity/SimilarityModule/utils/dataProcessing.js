import { cosineSimilarity } from '../../../utils/vectorUtils';
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
    nodes.push({
      id: position,
      group: index,
      size: Math.log(items.length + 1) * GRAPH_CONFIG.nodeSizeScale,
      count: items.length,
      usernames: items.map((item) => item.username),
      embeddings: items.map((item) => item.embedding),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    });
  });
  return nodes;
}

/**
 * Create graph links between similar nodes
 * @param {Array} nodes - Graph nodes
 * @returns {Array} Graph links
 */
export function createLinks(nodes) {
  const links = [];
  const { similarityThreshold } = GRAPH_CONFIG;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Calculate average similarity between groups
      let totalSimilarity = 0;
      let comparisons = 0;

      nodes[i].embeddings.forEach((emb1) => {
        nodes[j].embeddings.forEach((emb2) => {
          totalSimilarity += cosineSimilarity(emb1, emb2);
          comparisons++;
        });
      });

      const avgSimilarity = totalSimilarity / comparisons;

      if (avgSimilarity > similarityThreshold) {
        links.push({
          source: nodes[i].id,
          target: nodes[j].id,
          value: avgSimilarity,
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
