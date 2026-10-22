import { GRAPH_CONFIG } from '../constants/graphConfig';

/**
 * Add display properties to the graph computed by /api/similarity
 * @param {{nodes: Array, links: Array}} data - Graph from the API
 * @returns {Object} Graph data with sized, colored nodes and links
 */
export function processGraphData({ nodes, links }) {
  return {
    nodes: nodes.map((node) => ({
      ...node,
      size: Math.log(node.count + 1) * GRAPH_CONFIG.nodeSizeScale,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    })),
    links,
  };
}
