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

// Helper function to normalize vector
function normalizeVector(vector) {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}

// Helper function to get average embedding
function getAverageEmbedding(embeddings) {
  const dim = embeddings[0].length;
  const sum = new Array(dim).fill(0);
  embeddings.forEach(emb => {
    emb.forEach((val, i) => {
      sum[i] += val;
    });
  });
  const avg = sum.map(val => val / embeddings.length);
  return normalizeVector(avg);
}

// Similarity algorithms
const algorithms = {
  mst: {
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
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
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
            value: similarity
          });
        }
      });

      return links;
    }
  },
  knn: {
    name: 'K-Nearest Neighbors',
    compute: (nodes, K = 3, minSimilarity = 0.5) => {
      const links = new Set();
      nodes.forEach((node, i) => {
        const similarities = nodes.map((otherNode, j) => ({
          index: j,
          similarity: i === j ? -1 : cosineSimilarity(node.avgEmbedding, otherNode.avgEmbedding)
        }));

        similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, K)
          .forEach(({ index, similarity }) => {
            if (similarity > minSimilarity) {
              links.add({
                source: nodes[i].id,
                target: nodes[index].id,
                value: similarity
              });
            }
          });
      });
      return Array.from(links);
    }
  },
  threshold: {
    name: 'Similarity Threshold',
    compute: (nodes, threshold = 0.7) => {
      const links = new Set();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          if (similarity > threshold) {
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity
            });
          }
        }
      }
      return Array.from(links);
    }
  },
  hierarchical: {
    name: 'Hierarchical Clustering',
    compute: (nodes, threshold = 0.5) => {
      const links = new Set();
      let clusters = new Array(nodes.length).fill(0).map((_, i) => [i]);
      const similarities = [];

      // Calculate all pairwise similarities
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          similarities.push({ i, j, similarity });
        }
      }

      // Sort by similarity descending
      similarities.sort((a, b) => b.similarity - a.similarity);

      // Merge clusters and add links
      similarities.forEach(({ i, j, similarity }) => {
        if (similarity > threshold) {
          const cluster1 = clusters.find(c => c.includes(i));
          const cluster2 = clusters.find(c => c.includes(j));
          
          if (cluster1 !== cluster2) {
            // Add links between closest points in clusters
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity
            });
            
            // Merge clusters
            const merged = [...cluster1, ...cluster2];
            clusters = clusters.filter(c => c !== cluster1 && c !== cluster2);
            clusters.push(merged);
          }
        }
      });

      return Array.from(links);
    }
  },
  community: {
    name: 'Community Detection',
    compute: (nodes, threshold = 0.5, communityThreshold = 0.6) => {
      const links = new Set();
      const communities = new Map();
      let communityId = 0;

      // First pass: create initial communities based on strong similarities
      for (let i = 0; i < nodes.length; i++) {
        if (!communities.has(i)) {
          const community = new Set([i]);
          communities.set(i, communityId);

          // Find strongly connected nodes
          for (let j = 0; j < nodes.length; j++) {
            if (i !== j && !communities.has(j)) {
              const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
              if (similarity > communityThreshold) {
                community.add(j);
                communities.set(j, communityId);
              }
            }
          }
          communityId++;
        }
      }

      // Second pass: connect communities
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          const sameCommunity = communities.get(i) === communities.get(j);

          // Add links within communities and strong links between communities
          if (similarity > (sameCommunity ? threshold : communityThreshold)) {
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity
            });
          }
        }
      }

      return Array.from(links);
    }
  },
  adaptive: {
    name: 'Adaptive Threshold',
    compute: (nodes) => {
      const links = new Set();
      const similarities = [];
      
      // Calculate all pairwise similarities
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          similarities.push(similarity);
        }
      }

      // Calculate adaptive threshold using mean and standard deviation
      const mean = similarities.reduce((a, b) => a + b, 0) / similarities.length;
      const std = Math.sqrt(
        similarities.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / similarities.length
      );
      const adaptiveThreshold = mean + 0.5 * std;

      // Create links based on adaptive threshold
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          if (similarity > adaptiveThreshold) {
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity
            });
          }
        }
      }

      return Array.from(links);
    }
  }
};

export default function JobSimilarityPage() {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const [algorithm, setAlgorithm] = useState('mst');
  const [rawNodes, setRawNodes] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/job-similarity');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        
        // Group similar job titles
        const jobGroups = {};
        jsonData.forEach(item => {
          const title = item.title;
          if (!jobGroups[title]) {
            jobGroups[title] = [];
          }
          jobGroups[title].push(item);
        });

        // Create nodes with normalized embeddings
        const nodes = Object.entries(jobGroups).map(([title, items], index) => {
          const normalizedEmbeddings = items.map(item => normalizeVector(item.embedding));
          const avgEmbedding = getAverageEmbedding(normalizedEmbeddings);
          
          return {
            id: title,
            group: index,
            size: Math.log(items.length + 1) * 3,
            count: items.length,
            uuids: items.map(item => item.uuid),
            avgEmbedding,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
          };
        });

        setRawNodes(nodes);
        const links = algorithms[algorithm].compute(nodes);
        setGraphData({ nodes, links });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Update graph when algorithm changes
  useEffect(() => {
    if (rawNodes) {
      const links = algorithms[algorithm].compute(rawNodes);
      setGraphData({ nodes: rawNodes, links });
    }
  }, [algorithm, rawNodes]);

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
        <h1 className="text-3xl font-bold mb-4">Job Similarity Network</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Job Similarity Network</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Job Similarity Network</h1>
        <div className="flex items-center gap-4">
          <label className="font-medium">Algorithm:</label>
          <select 
            className="p-2 border rounded-lg bg-white"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            {Object.entries(algorithms).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="mb-4">
        Explore similar job positions in an interactive network. Each node represents a job title, with size indicating the number of listings.
        Connected positions are similar based on job content. Hover to highlight connections, click to view job details.
      </p>
      <div className="relative w-full h-[800px] bg-white rounded-lg shadow-lg">
        {graphData && (
          <ForceGraph2D
            graphData={graphData}
            nodeColor={node => highlightNodes.has(node) ? '#ff0000' : node.color}
            nodeCanvasObject={(node, ctx, globalScale) => {
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
              if (node.uuids && node.uuids.length > 0) {
                window.open(`/jobs/${node.uuids[0]}`, '_blank');
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
            <p>{hoverNode.count} job listings</p>
            <p className="text-sm text-gray-600">Click to view a sample job</p>
          </div>
        )}
      </div>
    </div>
  );
}
