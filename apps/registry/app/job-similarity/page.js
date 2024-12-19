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
  if (!Array.isArray(vector) || vector.length === 0) return null;
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return null;
  return vector.map(val => val / magnitude);
}

// Helper function to get average embedding
function getAverageEmbedding(embeddings) {
  // Filter out null or invalid embeddings
  const validEmbeddings = embeddings.filter(emb => Array.isArray(emb) && emb.length > 0);
  if (validEmbeddings.length === 0) return null;

  const dim = validEmbeddings[0].length;
  const sum = new Array(dim).fill(0);
  validEmbeddings.forEach(emb => {
    emb.forEach((val, i) => {
      sum[i] += val;
    });
  });
  const avg = sum.map(val => val / validEmbeddings.length);
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
  },
  maxSpanningTree: {
    name: 'Maximum Spanning Tree',
    compute: (nodes, minSimilarity = 0.3) => {
      const edges = [];
      // Calculate all pairwise similarities
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          if (similarity >= minSimilarity) {
            edges.push({
              source: nodes[i],
              target: nodes[j],
              similarity: similarity
            });
          }
        }
      }

      // Sort edges by similarity in descending order
      edges.sort((a, b) => b.similarity - a.similarity);

      // Kruskal's algorithm for maximum spanning tree
      const disjointSet = new Map();
      const find = (node) => {
        if (!disjointSet.has(node.id)) {
          disjointSet.set(node.id, node.id);
        }
        if (disjointSet.get(node.id) !== node.id) {
          disjointSet.set(node.id, find({ id: disjointSet.get(node.id) }));
        }
        return disjointSet.get(node.id);
      };
      
      const union = (node1, node2) => {
        const root1 = find(node1);
        const root2 = find(node2);
        if (root1 !== root2) {
          disjointSet.set(root1, root2);
        }
      };

      const mstEdges = edges.filter(edge => {
        const sourceRoot = find(edge.source);
        const targetRoot = find(edge.target);
        if (sourceRoot !== targetRoot) {
          union(edge.source, edge.target);
          return true;
        }
        return false;
      });

      return mstEdges;
    }
  },
  clique: {
    name: 'Maximum Cliques',
    compute: (nodes, minSimilarity = 0.6) => {
      // Build adjacency matrix
      const n = nodes.length;
      const adj = Array(n).fill().map(() => Array(n).fill(false));
      
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          if (similarity >= minSimilarity) {
            adj[i][j] = adj[j][i] = true;
          }
        }
      }

      // Find maximal cliques using Bron-Kerbosch algorithm
      const cliques = [];
      const bronKerbosch = (r, p, x) => {
        if (p.length === 0 && x.length === 0) {
          if (r.length >= 3) { // Only consider cliques of size 3 or larger
            cliques.push([...r]);
          }
          return;
        }

        const pivot = [...p, ...x][0];
        const candidates = p.filter(v => !adj[pivot][v]);

        for (const v of candidates) {
          const newR = [...r, v];
          const newP = p.filter(u => adj[v][u]);
          const newX = x.filter(u => adj[v][u]);
          bronKerbosch(newR, newP, newX);
          p = p.filter(u => u !== v);
          x.push(v);
        }
      };

      const vertices = Array.from({length: n}, (_, i) => i);
      bronKerbosch([], vertices, []);

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
              similarity
            });
          }
        }
      }

      return edges;
    }
  },
  pathfinder: {
    name: 'Pathfinder Network',
    compute: (nodes, r = 2, q = 2) => {
      const n = nodes.length;
      const distances = Array(n).fill().map(() => Array(n).fill(Infinity));
      
      // Calculate initial distances
      for (let i = 0; i < n; i++) {
        distances[i][i] = 0;
        for (let j = i + 1; j < n; j++) {
          const similarity = cosineSimilarity(nodes[i].avgEmbedding, nodes[j].avgEmbedding);
          // Convert similarity to distance (1 - similarity)
          const distance = 1 - similarity;
          distances[i][j] = distances[j][i] = distance;
        }
      }

      // Pathfinder network scaling
      for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            const sum = Math.pow(
              Math.pow(distances[i][k], r) + Math.pow(distances[k][j], r),
              1/r
            );
            if (sum < distances[i][j]) {
              distances[i][j] = sum;
            }
          }
        }
      }

      // Generate edges for the minimal network
      const edges = [];
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          let isMinimal = true;
          for (let k = 0; k < n; k++) {
            if (k !== i && k !== j) {
              const sum = Math.pow(
                Math.pow(distances[i][k], r) + Math.pow(distances[k][j], r),
                1/r
              );
              if (Math.abs(sum - distances[i][j]) < 1e-10) {
                isMinimal = false;
                break;
              }
            }
          }
          if (isMinimal) {
            const similarity = 1 - distances[i][j];
            if (similarity > 0.3) { // Only include edges with reasonable similarity
              edges.push({
                source: nodes[i],
                target: nodes[j],
                similarity
              });
            }
          }
        }
      }

      return edges;
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
  const [dataSource, setDataSource] = useState('jobs');
  const [rawNodes, setRawNodes] = useState(null);
  const [performanceMode, setPerformanceMode] = useState(true);

  // Fetch data only when dataSource changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const endpoint = dataSource === 'jobs' ? '/api/job-similarity' : '/api/similarity';
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        
        // Filter out items without valid embeddings
        const validData = jsonData.filter(item => {
          const embedding = dataSource === 'jobs' ? 
            item.embedding : 
            (typeof item.embedding === 'string' ? JSON.parse(item.embedding) : item.embedding);
          return Array.isArray(embedding) && embedding.length > 0;
        });

        // Group similar items
        const groups = {};

        validData.forEach(item => {
          const label = dataSource === 'jobs' 
            ? item.title 
            : (item.position || 'Unknown Position');
            
          if (!groups[label]) {
            groups[label] = [];
          }
          groups[label].push(item);
        });

        // Create nodes with normalized embeddings
        const nodes = Object.entries(groups)
          .map(([label, items], index) => {
            const embeddings = items.map(item => {
              if (dataSource === 'jobs') return item.embedding;
              return typeof item.embedding === 'string' ? 
                JSON.parse(item.embedding) : item.embedding;
            });

            const normalizedEmbeddings = embeddings
              .map(emb => normalizeVector(emb))
              .filter(emb => emb !== null);

            if (normalizedEmbeddings.length === 0) return null;

            const avgEmbedding = getAverageEmbedding(normalizedEmbeddings);
            if (!avgEmbedding) return null;

            return {
              id: label,
              group: index,
              size: Math.log(items.length + 1) * 3,
              count: items.length,
              uuids: items.map(item => dataSource === 'jobs' ? item.uuid : item.username),
              usernames: dataSource === 'jobs' ? null : items.map(item => item.username),
              avgEmbedding,
              color: `hsl(${Math.random() * 360}, 70%, 50%)`,
              companies: dataSource === 'jobs' ? [...new Set(items.map(item => item.company || 'Unknown Company'))] : null,
              countryCodes: dataSource === 'jobs' ? [...new Set(items.map(item => item.countryCode || 'Unknown Location'))] : null
            };
          })
          .filter(node => node !== null);

        if (nodes.length === 0) {
          throw new Error('No valid data found with embeddings');
        }

        setRawNodes(nodes);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dataSource]); // Only depend on dataSource

  // Compute links when algorithm changes or when we have new nodes
  useEffect(() => {
    if (!rawNodes) return;
    
    try {
      const links = algorithms[algorithm].compute(rawNodes);
      setGraphData({ nodes: rawNodes, links });
    } catch (err) {
      console.error('Error computing links:', err);
      setError(err.message);
    }
  }, [algorithm, rawNodes]);

  useEffect(() => {
    // Enable performance mode automatically for large datasets
    if (graphData?.nodes?.length > 1000) {
      setPerformanceMode(true);
    }
  }, [graphData]);

  const handleNodeHover = useCallback(node => {
    setHighlightNodes(new Set(node ? [node] : []));
    setHighlightLinks(new Set(graphData?.links.filter(link => 
      link.source.id === node?.id || link.target.id === node?.id
    ) || []));
    setHoverNode(node || null);
  }, [graphData]);

  const handleNodeClick = useCallback(node => {
    if (node.uuids && node.uuids.length > 0) {
      const baseUrl = dataSource === 'jobs' ? '/jobs/' : '/';
      window.open(`${baseUrl}${node.uuids[0]}`, '_blank');
    }
  }, [dataSource]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Similarity Network</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Similarity Network</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Similarity Network</h1>
        <div className="flex items-center gap-4">
          <label className="font-medium">Data Source:</label>
          <select 
            className="p-2 border rounded-lg bg-white"
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
          >
            <option value="jobs">Jobs</option>
            <option value="resumes">Resumes</option>
          </select>
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
          <label className="font-medium ml-4">
            <input
              type="checkbox"
              checked={performanceMode}
              onChange={(e) => setPerformanceMode(e.target.checked)}
              className="mr-2"
            />
            Performance Mode
          </label>
        </div>
      </div>
      <p className="mb-4">
        Explore similar {dataSource === 'jobs' ? 'job positions' : 'resumes'} in an interactive network. 
        Each node represents a {dataSource === 'jobs' ? 'job title' : 'position'}, with size indicating the number of {dataSource === 'jobs' ? 'listings' : 'resumes'}.
        Connected positions are similar based on content. Hover to highlight connections, click to view details.
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
            nodeRelSize={performanceMode ? 4 : 6}
            linkWidth={link => highlightLinks.has(link) ? 2 : 1}
            linkColor={link => highlightLinks.has(link) ? '#ff0000' : '#cccccc'}
            linkOpacity={0.3}
            linkDirectionalParticles={performanceMode ? 0 : 4}
            linkDirectionalParticleWidth={2}
            onNodeHover={handleNodeHover}
            onNodeClick={handleNodeClick}
            enableNodeDrag={!performanceMode}
            cooldownTicks={performanceMode ? 50 : 100}
            d3AlphaDecay={performanceMode ? 0.05 : 0.02}
            d3VelocityDecay={performanceMode ? 0.4 : 0.3}
            warmupTicks={performanceMode ? 50 : 100}
            d3Force={performanceMode ? {
              collision: 1,
              charge: -30
            } : undefined}
          />
        )}
        {hoverNode && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="font-bold">{hoverNode.id}</h3>
            <p>{hoverNode.count} {dataSource === 'jobs' ? 'job listings' : 'resumes'}</p>
            {dataSource === 'jobs' && hoverNode.companies && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Companies:</p>
                <p className="text-sm">{hoverNode.companies.slice(0, 5).join(', ')}{hoverNode.companies.length > 5 ? `, +${hoverNode.companies.length - 5} more` : ''}</p>
              </div>
            )}
            {dataSource === 'jobs' && hoverNode.countryCodes && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Locations:</p>
                <p className="text-sm">{hoverNode.countryCodes.slice(0, 5).join(', ')}{hoverNode.countryCodes.length > 5 ? `, +${hoverNode.countryCodes.length - 5} more` : ''}</p>
              </div>
            )}
            {dataSource !== 'jobs' && hoverNode.usernames && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Usernames:</p>
                <p className="text-sm">{hoverNode.usernames.slice(0, 5).join(', ')}{hoverNode.usernames.length > 5 ? `, +${hoverNode.usernames.length - 5} more` : ''}</p>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">Click to view {dataSource === 'jobs' ? 'job' : 'resume'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
