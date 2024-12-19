'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Import ForceGraph dynamically to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

// Helper function to compute cosine similarity
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default function SimilarityPage() {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/similarity');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        
        // Group similar positions
        const positionGroups = {};
        jsonData.forEach(item => {
          const position = item.position;
          if (!positionGroups[position]) {
            positionGroups[position] = [];
          }
          positionGroups[position].push(item);
        });

        // Create nodes and links
        const nodes = [];
        const links = [];
        const similarityThreshold = 0.7;

        // Create nodes for each unique position
        Object.entries(positionGroups).forEach(([position, items], index) => {
          nodes.push({
            id: position,
            group: index,
            size: Math.log(items.length + 1) * 3,
            count: items.length,
            usernames: items.map(item => item.username),
            embeddings: items.map(item => item.embedding),
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          });
        });

        // Create links between similar positions
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            // Calculate average similarity between groups
            let totalSimilarity = 0;
            let comparisons = 0;
            
            nodes[i].embeddings.forEach(emb1 => {
              nodes[j].embeddings.forEach(emb2 => {
                totalSimilarity += cosineSimilarity(emb1, emb2);
                comparisons++;
              });
            });

            const avgSimilarity = totalSimilarity / comparisons;
            
            if (avgSimilarity > similarityThreshold) {
              links.push({
                source: nodes[i].id,
                target: nodes[j].id,
                value: avgSimilarity
              });
            }
          }
        }

        setGraphData({ nodes, links });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleNodeHover = useCallback(node => {
    setHighlightNodes(new Set(node ? [node] : []));
    setHighlightLinks(new Set(graphData?.links.filter(link => 
      link.source.id === node?.id || link.target.id === node?.id
    ) || []));
    setHoverNode(node || null);
  }, [graphData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Resume Position Network</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Resume Position Network</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Resume Position Network</h1>
      <p className="mb-4">
        Explore similar positions in an interactive network. Each node represents a position, with size indicating the number of resumes.
        Connected positions are similar based on resume content. Hover to highlight connections, click to view resumes.
      </p>
      <div className="relative w-full h-[800px] bg-white rounded-lg shadow-lg">
        {graphData && (
          <ForceGraph2D
            graphData={graphData}
            nodeColor={node => highlightNodes.has(node) ? '#ff0000' : node.color}
            nodeCanvasObject={(node, ctx, globalScale) => {
              // Draw node
              const size = node.size * (4 / Math.max(1, globalScale));
              ctx.beginPath();
              ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
              ctx.fillStyle = highlightNodes.has(node) ? '#ff0000' : node.color;
              ctx.fill();

              // Only draw label if node is highlighted
              if (highlightNodes.has(node)) {
                const label = node.id;
                const fontSize = Math.max(14, size * 1.5);
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

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
            }}
            nodeRelSize={6}
            linkWidth={link => highlightLinks.has(link) ? 2 : 1}
            linkColor={link => highlightLinks.has(link) ? '#ff0000' : '#cccccc'}
            linkOpacity={0.3}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={2}
            onNodeHover={handleNodeHover}
            onNodeClick={(node) => {
              if (node.usernames && node.usernames.length > 0) {
                window.open(`/${node.usernames[0]}`, '_blank');
              }
            }}
            enableNodeDrag={true}
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            warmupTicks={100}
          />
        )}
        {hoverNode && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-bold">{hoverNode.id}</h3>
            <p>{hoverNode.count} resumes</p>
            <p className="text-sm text-gray-600">Click to view a sample resume</p>
          </div>
        )}
      </div>
    </div>
  );
}
