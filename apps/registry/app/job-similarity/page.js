'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

// Helper function to compute cosine similarity
const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;

  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
};

// Helper function to normalize a vector
const normalizeVector = (vector) => {
  if (!Array.isArray(vector) || vector.length === 0) return null;

  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return null;

  return vector.map((val) => val / magnitude);
};

// Helper function to get average embedding
const getAverageEmbedding = (embeddings) => {
  if (!Array.isArray(embeddings) || embeddings.length === 0) return null;

  const sum = embeddings.reduce((acc, curr) => {
    return acc.map((val, i) => val + curr[i]);
  }, new Array(embeddings[0].length).fill(0));

  return sum.map((val) => val / embeddings.length);
};

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
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
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
            value: similarity,
          });
        }
      });

      return links;
    },
  },
  knn: {
    name: 'K-Nearest Neighbors',
    compute: (nodes, K = 3, minSimilarity = 0.5) => {
      const links = new Set();
      nodes.forEach((node, i) => {
        const similarities = nodes.map((otherNode, j) => ({
          index: j,
          similarity:
            i === j
              ? -1
              : cosineSimilarity(node.avgEmbedding, otherNode.avgEmbedding),
        }));

        similarities
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, K)
          .forEach(({ index, similarity }) => {
            if (similarity > minSimilarity) {
              links.add({
                source: nodes[i].id,
                target: nodes[index].id,
                value: similarity,
              });
            }
          });
      });
      return Array.from(links);
    },
  },
  threshold: {
    name: 'Similarity Threshold',
    compute: (nodes, threshold = 0.7) => {
      const links = new Set();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          if (similarity > threshold) {
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity,
            });
          }
        }
      }
      return Array.from(links);
    },
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
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          similarities.push({ i, j, similarity });
        }
      }

      // Sort by similarity descending
      similarities.sort((a, b) => b.similarity - a.similarity);

      // Merge clusters and add links
      similarities.forEach(({ i, j, similarity }) => {
        if (similarity > threshold) {
          const cluster1 = clusters.find((c) => c.includes(i));
          const cluster2 = clusters.find((c) => c.includes(j));

          if (cluster1 !== cluster2) {
            // Add links between closest points in clusters
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity,
            });

            // Merge clusters
            const merged = [...cluster1, ...cluster2];
            clusters = clusters.filter((c) => c !== cluster1 && c !== cluster2);
            clusters.push(merged);
          }
        }
      });

      return Array.from(links);
    },
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
              const similarity = cosineSimilarity(
                nodes[i].avgEmbedding,
                nodes[j].avgEmbedding
              );
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
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          const sameCommunity = communities.get(i) === communities.get(j);

          // Add links within communities and strong links between communities
          if (similarity > (sameCommunity ? threshold : communityThreshold)) {
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity,
            });
          }
        }
      }

      return Array.from(links);
    },
  },
  adaptive: {
    name: 'Adaptive Threshold',
    compute: (nodes) => {
      const links = new Set();
      const similarities = [];

      // Calculate all pairwise similarities
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          similarities.push(similarity);
        }
      }

      // Calculate adaptive threshold using mean and standard deviation
      const mean =
        similarities.reduce((a, b) => a + b, 0) / similarities.length;
      const std = Math.sqrt(
        similarities.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
          similarities.length
      );
      const adaptiveThreshold = mean + 0.5 * std;

      // Create links based on adaptive threshold
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          if (similarity > adaptiveThreshold) {
            links.add({
              source: nodes[i].id,
              target: nodes[j].id,
              value: similarity,
            });
          }
        }
      }

      return Array.from(links);
    },
  },
  maxSpanningTree: {
    name: 'Maximum Spanning Tree',
    compute: (nodes, minSimilarity = 0.3) => {
      const edges = [];
      // Calculate all pairwise similarities
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          if (similarity >= minSimilarity) {
            edges.push({
              source: nodes[i],
              target: nodes[j],
              similarity: similarity,
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

      const mstEdges = edges.filter((edge) => {
        const sourceRoot = find(edge.source);
        const targetRoot = find(edge.target);
        if (sourceRoot !== targetRoot) {
          union(edge.source, edge.target);
          return true;
        }
        return false;
      });

      return mstEdges;
    },
  },
  clique: {
    name: 'Maximum Cliques',
    compute: (nodes, minSimilarity = 0.6) => {
      // Build adjacency matrix
      const n = nodes.length;
      const adj = Array(n)
        .fill()
        .map(() => Array(n).fill(false));

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
          if (similarity >= minSimilarity) {
            adj[i][j] = adj[j][i] = true;
          }
        }
      }

      // Find maximal cliques using Bron-Kerbosch algorithm
      const cliques = [];
      const bronKerbosch = (r, p, x) => {
        if (p.length === 0 && x.length === 0) {
          if (r.length >= 3) {
            // Only consider cliques of size 3 or larger
            cliques.push([...r]);
          }
          return;
        }

        const pivot = [...p, ...x][0];
        const candidates = p.filter((v) => !adj[pivot][v]);

        for (const v of candidates) {
          const newR = [...r, v];
          const newP = p.filter((u) => adj[v][u]);
          const newX = x.filter((u) => adj[v][u]);
          bronKerbosch(newR, newP, newX);
          p = p.filter((u) => u !== v);
          x.push(v);
        }
      };

      const vertices = Array.from({ length: n }, (_, i) => i);
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
              similarity,
            });
          }
        }
      }

      return edges;
    },
  },
  pathfinder: {
    name: 'Pathfinder Network',
    compute: (nodes, r = 2) => {
      const n = nodes.length;
      const distances = Array(n)
        .fill()
        .map(() => Array(n).fill(Infinity));

      // Calculate initial distances
      for (let i = 0; i < n; i++) {
        distances[i][i] = 0;
        for (let j = i + 1; j < n; j++) {
          const similarity = cosineSimilarity(
            nodes[i].avgEmbedding,
            nodes[j].avgEmbedding
          );
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
              1 / r
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
                1 / r
              );
              if (Math.abs(sum - distances[i][j]) < 1e-10) {
                isMinimal = false;
                break;
              }
            }
          }
          if (isMinimal) {
            const similarity = 1 - distances[i][j];
            if (similarity > 0.3) {
              // Only include edges with reasonable similarity
              edges.push({
                source: nodes[i],
                target: nodes[j],
                similarity,
              });
            }
          }
        }
      }

      return edges;
    },
  },
};

const colors = [
  '#FF6B6B', // coral red
  '#4ECDC4', // turquoise
  '#45B7D1', // sky blue
  '#96CEB4', // sage green
  '#F7D794', // mellow yellow
  '#9B59B6', // amethyst purple
  '#FF8C94', // rose pink
  '#4A90E2', // ocean blue
  '#50E3C2', // mint
  '#F39C12', // amber
  '#D35400', // pumpkin
  '#FF5E3A', // sunset orange
  '#2ECC71', // emerald
  '#F64747', // pomegranate
  '#786FA6', // lavender
  '#00B894', // mountain meadow
  '#FD79A8', // pink glamour
  '#6C5CE7', // blue violet
  '#FDA7DF', // light pink
  '#A8E6CF', // light green
];

const Header = memo(() => (
  <div className="prose max-w-3xl mx-auto mb-8">
    <h1 className="text-3xl font-bold mb-4">Job Market Simlarity</h1>
    <div className="space-y-4 text-gray-700">
      <p>
        An interactive visualization of the tech job market, powered by data
        from HN "Who's Hiring" threads and the JSON Resume Registry. Each node
        represents a job category, with edges connecting similar roles. The size
        of each node indicates the number of job listings in that category.
      </p>
      <p>
        Hover over a node to see details about the companies and locations
        hiring for that role. Click a node to view the original job listing or
        resume profile.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Jobs View:</strong> Job posts from "Who's Hiring" → GPT-4
          standardization → OpenAI embeddings
        </li>
        <li>
          <strong>Resumes View:</strong> JSON Resume profiles → OpenAI
          embeddings
        </li>
      </ul>
      <p>
        Multiple graph algorithms available to explore different relationships.
      </p>
    </div>
  </div>
));
Header.displayName = 'Header';

const Controls = memo(
  ({ dataSource, setDataSource, algorithm, setAlgorithm }) => (
    <div className="prose max-w-3xl mx-auto mb-8">
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Source
          </label>
          <select
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm rounded-md"
          >
            <option value="jobs">Job Listings</option>
            <option value="resumes">Resumes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm rounded-md"
          >
            {Object.entries(algorithms).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
);
Controls.displayName = 'Controls';

const GraphContainer = ({ dataSource, algorithm }) => {
  const [graphData, setGraphData] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [rawNodes, setRawNodes] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edges, setEdges] = useState([]);

  const handleNodeHover = useCallback(
    (node) => {
      setHighlightNodes(new Set(node ? [node] : []));
      setHighlightLinks(
        new Set(
          node
            ? edges.filter(
                (link) => link.source === node || link.target === node
              )
            : []
        )
      );
      setHoverNode(node || null);
    },
    [edges]
  );

  const handleNodeClick = useCallback(
    (node) => {
      if (!node) return;
      if (node.uuids && node.uuids.length > 0) {
        const baseUrl = dataSource === 'jobs' ? '/jobs/' : '/';
        window.open(`${baseUrl}${node.uuids[0]}`, '_blank');
      }
    },
    [dataSource]
  );

  const processData = useCallback(
    (data) => {
      // Filter out items without valid embeddings
      const validData = data.filter((item) => {
        const embedding =
          dataSource === 'jobs'
            ? item.embedding
            : typeof item.embedding === 'string'
            ? JSON.parse(item.embedding)
            : item.embedding;
        return Array.isArray(embedding) && embedding.length > 0;
      });

      // Group similar items
      const groups = {};

      validData.forEach((item) => {
        const label =
          dataSource === 'jobs'
            ? item.title
            : item.position || 'Unknown Position';

        if (!groups[label]) {
          groups[label] = [];
        }
        groups[label].push(item);
      });

      // Create nodes with normalized embeddings
      const nodes = Object.entries(groups)
        .map(([label, items], index) => {
          const embeddings = items.map((item) => {
            if (dataSource === 'jobs') return item.embedding;
            return typeof item.embedding === 'string'
              ? JSON.parse(item.embedding)
              : item.embedding;
          });

          const normalizedEmbeddings = embeddings
            .map((emb) => normalizeVector(emb))
            .filter((emb) => emb !== null);

          if (normalizedEmbeddings.length === 0) return null;

          const avgEmbedding = getAverageEmbedding(normalizedEmbeddings);
          if (!avgEmbedding) return null;

          return {
            id: label,
            group: index,
            size: Math.log(items.length + 1) * 3,
            count: items.length,
            uuids: items.map((item) =>
              dataSource === 'jobs' ? item.uuid : item.username
            ),
            usernames:
              dataSource === 'jobs'
                ? null
                : [...new Set(items.map((item) => item.username))],
            avgEmbedding,
            color: colors[index % colors.length],
            companies:
              dataSource === 'jobs'
                ? [
                    ...new Set(
                      items.map((item) => item.company || 'Unknown Company')
                    ),
                  ]
                : null,
            countryCodes:
              dataSource === 'jobs'
                ? [
                    ...new Set(
                      items.map(
                        (item) => item.countryCode || 'Unknown Location'
                      )
                    ),
                  ]
                : null,
          };
        })
        .filter((node) => node !== null);

      if (nodes.length === 0) {
        throw new Error('No valid data found with embeddings');
      }

      return nodes;
    },
    [dataSource]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/${
          dataSource === 'jobs' ? 'job-' : ''
        }similarity?limit=250&algorithm=${algorithm}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const processedData = processData(data);
      setRawNodes(processedData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [dataSource, algorithm, processData]);

  const processLinks = useCallback(() => {
    if (!rawNodes) return;

    const { compute } = algorithms[algorithm];
    const links = compute(rawNodes);

    setGraphData({ nodes: rawNodes, links });
    setEdges(links);
  }, [rawNodes, algorithm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    processLinks();
  }, [processLinks]);

  if (loading)
    return (
      <div className="prose max-w-3xl mx-auto h-[calc(100vh-32rem)] flex items-start justify-center bg-white pt-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-secondary-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-secondary-600 font-medium">
            Loading graph data...
          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="prose max-w-3xl mx-auto h-[calc(100vh-32rem)] flex items-start justify-center bg-white pt-16">
        <div className="flex flex-col items-center gap-4 max-w-lg text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="text-lg text-red-600 font-medium">
            Error loading graph data
          </div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );

  return (
    <div className="w-full h-full relative">
      {graphData && (
        <ForceGraph2D
          graphData={graphData}
          nodeColor={(node) =>
            highlightNodes.has(node) ? '#FF4757' : node.color
          }
          nodeCanvasObject={(node, ctx, globalScale) => {
            // Draw node
            const size = node.size * (4 / Math.max(1, globalScale));
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = highlightNodes.has(node) ? '#FF4757' : node.color;
            ctx.fill();

            // Add a subtle glow effect
            if (highlightNodes.has(node)) {
              ctx.shadowColor = '#FF4757';
              ctx.shadowBlur = 15;
              ctx.strokeStyle = '#FF4757';
              ctx.lineWidth = 2;
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
            // Only draw label if node is highlighted
            if (highlightNodes.has(node)) {
              const label = node.id;
              const fontSize = Math.max(14, node.size * 1.5);
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000';

              // Add background to text
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(
                (n) => n + fontSize * 0.4
              );
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fillRect(
                node.x - bckgDimensions[0] / 2,
                node.y - bckgDimensions[1] / 2,
                bckgDimensions[0],
                bckgDimensions[1]
              );

              ctx.fillStyle = '#000';
              ctx.fillText(label, node.x, node.y);

              // Add count below label
              const countLabel = `${node.count} ${
                dataSource === 'jobs' ? 'jobs' : 'resumes'
              }`;
              const smallerFont = fontSize * 0.7;
              ctx.font = `${smallerFont}px Sans-Serif`;
              ctx.fillText(countLabel, node.x, node.y - bckgDimensions[1]);
            }
          }}
          nodeRelSize={4}
          linkWidth={(link) => (highlightLinks.has(link) ? 2 : 1)}
          linkColor={(link) =>
            highlightLinks.has(link) ? '#FF4757' : '#E5E9F2'
          }
          linkOpacity={0.5}
          linkDirectionalParticles={0}
          linkDirectionalParticleWidth={2}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          enableNodeDrag={false}
          cooldownTicks={50}
          d3AlphaDecay={0.05}
          d3VelocityDecay={0.4}
          warmupTicks={50}
          d3Force={{
            collision: 1,
            charge: -30,
          }}
          width={window.innerWidth}
          height={window.innerHeight - 32 * 16}
        />
      )}
      {hoverNode && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
          <h3 className="font-bold">{hoverNode.id}</h3>
          <p>
            {hoverNode.count}{' '}
            {dataSource === 'jobs' ? 'job listings' : 'resumes'}
          </p>
          {dataSource === 'jobs' && hoverNode.companies && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Companies:</p>
              <p className="text-sm">
                {hoverNode.companies.slice(0, 5).join(', ')}
                {hoverNode.companies.length > 5
                  ? `, +${hoverNode.companies.length - 5} more`
                  : ''}
              </p>
            </div>
          )}
          {dataSource === 'jobs' && hoverNode.countryCodes && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Locations:</p>
              <p className="text-sm">
                {hoverNode.countryCodes.slice(0, 5).join(', ')}
                {hoverNode.countryCodes.length > 5
                  ? `, +${hoverNode.countryCodes.length - 5} more`
                  : ''}
              </p>
            </div>
          )}
          {dataSource !== 'jobs' && hoverNode.usernames && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Usernames:</p>
              <div className="text-sm max-h-32 overflow-y-auto">
                {hoverNode.usernames.map((username, i) => (
                  <div
                    key={i}
                    className="hover:bg-gray-100 p-1 rounded cursor-pointer"
                    onClick={() => window.open(`/${username}`, '_blank')}
                  >
                    {username}
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2">
            Click to view {dataSource === 'jobs' ? 'job' : 'resume'}
          </p>
        </div>
      )}
    </div>
  );
};

export default function Page() {
  const [dataSource, setDataSource] = useState('jobs');
  const [algorithm, setAlgorithm] = useState('mst');

  return (
    <div className="min-h-screen bg-accent-100">
      <div className="prose max-w-3xl mx-auto pt-8">
        <Header />
        <Controls
          dataSource={dataSource}
          setDataSource={setDataSource}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />
      </div>
      <div className="w-full h-[calc(100vh-32rem)] bg-white">
        <GraphContainer dataSource={dataSource} algorithm={algorithm} />
      </div>
    </div>
  );
}
