import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

/**
 * Renders the canvas node with label
 * @param {Object} node - Graph node
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Set} highlightNodes - Set of highlighted nodes
 */
const renderNode = (node, ctx, highlightNodes) => {
  // Draw node
  ctx.beginPath();
  ctx.arc(node.x, node.y, node.size * 2, 0, 2 * Math.PI);
  ctx.fillStyle = highlightNodes.has(node) ? '#ff0000' : node.color;
  ctx.fill();

  // Only draw label if node is highlighted
  if (highlightNodes.has(node)) {
    const label = node.id;
    const fontSize = Math.max(14, node.size * 1.5);
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2);

    // Draw background for label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(
      node.x - bckgDimensions[0] / 2,
      node.y - bckgDimensions[1] * 2,
      bckgDimensions[0],
      bckgDimensions[1]
    );

    // Draw label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.fillText(label, node.x, node.y - bckgDimensions[1] * 1.5);

    // Draw count
    const countLabel = `(${node.count})`;
    const smallerFont = fontSize * 0.7;
    ctx.font = `${smallerFont}px Sans-Serif`;
    ctx.fillText(countLabel, node.x, node.y - bckgDimensions[1]);
  }
};

export const GraphCanvas = ({
  graphData,
  highlightNodes,
  highlightLinks,
  onNodeHover,
  onNodeClick,
}) => {
  // Use state for dimensions to avoid direct window access during render
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: 600,
    });

    // Handle window resize with debouncing
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: 600,
        });
      }, 150); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!graphData) return null;

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeColor={(node) => (highlightNodes.has(node) ? '#ff0000' : node.color)}
      nodeCanvasObject={(node, ctx) => renderNode(node, ctx, highlightNodes)}
      nodeRelSize={6}
      linkWidth={(link) => (highlightLinks.has(link) ? 2 : 1)}
      linkColor={(link) => (highlightLinks.has(link) ? '#ff0000' : '#cccccc')}
      linkOpacity={0.3}
      linkDirectionalParticles={0}
      linkDirectionalParticleWidth={2}
      onNodeHover={onNodeHover}
      onNodeClick={onNodeClick}
      enableNodeDrag={false}
      cooldownTicks={100}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
      warmupTicks={100}
      width={dimensions.width}
      height={dimensions.height}
    />
  );
};
