import { cosineSimilarity } from '../../../utils/vectorUtils';
import { buildAdjacencyMatrix } from './edgeUtils';
import { bronKerbosch } from './bronKerbosch';

/**
 * Maximum Cliques algorithm using Bron-Kerbosch
 */
export const clique = {
  name: 'Maximum Cliques',
  compute: (nodes, minSimilarity = 0.6) => {
    const n = nodes.length;
    const adj = buildAdjacencyMatrix(nodes, minSimilarity);

    // Find maximal cliques using Bron-Kerbosch algorithm
    const cliques = [];
    const vertices = Array.from({ length: n }, (_, i) => i);
    bronKerbosch([], vertices, [], adj, cliques);

    // Convert cliques to edges
    const edges = [];
    for (const clique of cliques) {
      for (let i = 0; i < clique.length; i++) {
        for (let j = i + 1; j < clique.length; j++) {
          const similarity = cosineSimilarity(
            nodes[clique[i]].avgEmbedding,
            nodes[clique[j]].avgEmbedding
          );
          edges.push({
            source: nodes[clique[i]],
            target: nodes[clique[j]],
            similarity,
          });
        }
      }
    }

    return edges;
  },
};
