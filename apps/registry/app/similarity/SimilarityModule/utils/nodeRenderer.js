import { GRAPH_CONFIG } from '../constants/graphConfig';

/**
 * Custom node canvas renderer for force graph
 * @param {Object} node - Graph node
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} globalScale - Current graph scale
 * @param {Set} highlightNodes - Set of highlighted nodes
 */
export function renderNode(node, ctx, globalScale, highlightNodes) {
  const { colors } = GRAPH_CONFIG;

  // Draw node circle
  const size = node.size * (4 / Math.max(1, globalScale));
  ctx.beginPath();
  ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
  ctx.fillStyle = highlightNodes.has(node) ? colors.highlighted : node.color;
  ctx.fill();

  // Only draw label if node is highlighted
  if (highlightNodes.has(node)) {
    const label = node.id;
    const fontSize = Math.max(14, size * 1.5);
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

    // Draw label text
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
}
