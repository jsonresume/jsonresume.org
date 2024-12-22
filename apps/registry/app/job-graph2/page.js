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
  <div className="mb-8">
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
  ({ dataSource, setDataSource }) => (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
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
      </div>
    </div>
  )
);
Controls.displayName = 'Controls';

const GraphContainer = ({ dataSource }) => {
  const [graphData, setGraphData] = useState(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [rawNodes, setRawNodes] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [edges, setEdges] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

      if (isMobile) {
        // On mobile, just show the tooltip
        setHoverNode(node);
        return;
      }

      if (node.uuids && node.uuids.length > 0) {
        const baseUrl = dataSource === 'jobs' ? '/jobs/' : '/';
        window.open(`${baseUrl}${node.uuids[0]}`, '_blank');
      }
    },
    [dataSource, isMobile]
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
      // Check if we're in development environment
      const isLocal = process.env.NODE_ENV === 'development';
      const limit = isLocal ? 300 : 1500;

      const response = await fetch(
        `/api/${dataSource === 'jobs' ? 'job-' : ''}similarity?limit=${limit}`
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
  }, [dataSource, processData]);

  const processLinks = useCallback(() => {
    if (!rawNodes) return;

    const links = algorithms.hierarchical.compute(rawNodes);
    setGraphData({ nodes: rawNodes, links });
    setEdges(links);
  }, [rawNodes]);

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
    <div className="w-full h-[600px] relative">
      {graphData && (
        <ForceGraph2D
          graphData={graphData}
          nodeColor={(node) =>
            highlightNodes.has(node) ? '#ff0000' : node.color
          }
          nodeCanvasObject={(node, ctx) => {
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
              const bckgDimensions = [textWidth, fontSize].map(
                (n) => n + fontSize * 0.2
              );

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
          linkWidth={(link) => (highlightLinks.has(link) ? 2 : 1)}
          linkColor={(link) =>
            highlightLinks.has(link) ? '#ff0000' : '#cccccc'
          }
          linkOpacity={0.3}
          linkDirectionalParticles={0}
          linkDirectionalParticleWidth={2}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          enableNodeDrag={false}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          warmupTicks={100}
          width={window.innerWidth}
          height={600}
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
                    onClick={() => {
                      const baseUrl = dataSource === 'jobs' ? '/jobs/' : '/';
                      window.open(`${baseUrl}${hoverNode.uuids[0]}`, '_blank');
                    }}
                  >
                    {username}
                  </div>
                ))}
              </div>
            </div>
          )}
          {dataSource === 'jobs' && (
            <div className="mt-4">
              <a
                href={`/jobs/${hoverNode.uuids[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View job listing →
              </a>
            </div>
          )}
          {dataSource !== 'jobs' && (
            <div className="mt-4">
              <a
                href={`/${hoverNode.uuids[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View resume →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Page() {
  const [dataSource, setDataSource] = useState('jobs');

  return (
    <div className="min-h-screen bg-accent-100">
      <div className="prose max-w-3xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Header />
        <Controls
          dataSource={dataSource}
          setDataSource={setDataSource}
        />
      </div>
      <div className="w-full h-[600px] bg-white">
        <GraphContainer dataSource={dataSource} />
      </div>
    </div>
  );
}
