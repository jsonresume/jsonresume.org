/**
 * Graph visualization configuration constants
 */

export const GRAPH_CONFIG = {
  // Similarity threshold for creating connections
  similarityThreshold: 0.7,

  // Node size scaling factor
  nodeSizeScale: 3,

  // Graph layout physics
  physics: {
    cooldownTicks: 100,
    d3AlphaDecay: 0.02,
    d3VelocityDecay: 0.3,
    warmupTicks: 100,
  },

  // Visual styling
  styling: {
    nodeRelSize: 6,
    linkWidth: {
      normal: 1,
      highlighted: 2,
    },
    linkOpacity: 0.3,
    linkParticles: 4,
    linkParticleWidth: 2,
  },

  // Colors
  colors: {
    highlighted: '#ff0000',
    linkNormal: '#cccccc',
  },
};
