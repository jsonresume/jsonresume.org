import dynamic from 'next/dynamic';
import { GRAPH_CONFIG } from '../constants/graphConfig';
import { renderNode } from '../utils/nodeRenderer';
import { HoverInfo } from './HoverInfo';

// Import ForceGraph dynamically to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

/**
 * Similarity graph visualization component
 * @param {Object} graphData - Graph data with nodes and links
 * @param {Set} highlightNodes - Set of highlighted nodes
 * @param {Set} highlightLinks - Set of highlighted links
 * @param {Object} hoverNode - Currently hovered node
 * @param {Function} onNodeHover - Node hover handler
 * @param {Function} onNodeClick - Node click handler
 */
export function SimilarityGraph({
  graphData,
  highlightNodes,
  highlightLinks,
  hoverNode,
  onNodeHover,
  onNodeClick,
}) {
  const { colors, styling, physics } = GRAPH_CONFIG;

  return (
    <div className="relative w-full h-[800px] bg-white rounded-lg shadow-lg">
      {graphData && (
        <ForceGraph2D
          graphData={graphData}
          nodeColor={(node) =>
            highlightNodes.has(node) ? colors.highlighted : node.color
          }
          nodeCanvasObject={(node, ctx, globalScale) =>
            renderNode(node, ctx, globalScale, highlightNodes)
          }
          nodeRelSize={styling.nodeRelSize}
          linkWidth={(link) =>
            highlightLinks.has(link)
              ? styling.linkWidth.highlighted
              : styling.linkWidth.normal
          }
          linkColor={(link) =>
            highlightLinks.has(link) ? colors.highlighted : colors.linkNormal
          }
          linkOpacity={styling.linkOpacity}
          linkDirectionalParticles={styling.linkParticles}
          linkDirectionalParticleWidth={styling.linkParticleWidth}
          onNodeHover={onNodeHover}
          onNodeClick={onNodeClick}
          enableNodeDrag={true}
          cooldownTicks={physics.cooldownTicks}
          d3AlphaDecay={physics.d3AlphaDecay}
          d3VelocityDecay={physics.d3VelocityDecay}
          warmupTicks={physics.warmupTicks}
        />
      )}
      <HoverInfo hoverNode={hoverNode} />
    </div>
  );
}
