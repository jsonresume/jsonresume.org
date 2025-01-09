'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState, useCallback, useRef } from 'react';
import Hero from '../../../src/ui/Hero';
import Loading from '../../components/Loading';
import {
  forceSimulation,
  forceCollide,
  forceManyBody,
  forceCenter,
  forceLink,
} from 'd3-force';
import ForceGraph2D from 'react-force-graph-2d';

// const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
//   ssr: false,
// });

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

// Format skills array into a readable string
const formatSkills = (skills) => {
  if (!skills) return '';
  return skills.map((skill) => `${skill.name} (${skill.level})`).join(', ');
};

// Format qualifications array into a bullet list
const formatQualifications = (qualifications) => {
  if (!qualifications) return '';
  return qualifications.join('\n• ');
};

// Helper to format job info into tooltip text
const formatTooltip = (jobInfo) => {
  if (!jobInfo) return '';

  // Truncate description if needed
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const parts = [
    `${jobInfo.title || 'Untitled'} at ${jobInfo.company || 'Unknown Company'}`,
    jobInfo.remote ? `${jobInfo.remote} Remote` : '',
    jobInfo.location && jobInfo.location.city
      ? `Location: ${jobInfo.location.city}${jobInfo.location.region ? `, ${jobInfo.location.region}` : ''}`
      : '',
    `Type: ${jobInfo.type || 'Not specified'}`,
    '',
    'Description:',
    truncateText(jobInfo.description, 150),
    '',
    'Skills:',
    formatSkills(jobInfo.skills),
    '',
    'Qualifications:',
    `• ${formatQualifications(jobInfo.qualifications)}`,
  ];

  return parts.filter(Boolean).join('\n');
};

// Utility functions for vector similarity
const cosineSimilarity = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) {
    console.log('Invalid vectors:', { a, b });
    return 0;
  }
  if (a.length !== b.length) {
    console.log('Vector length mismatch:', {
      aLength: a.length,
      bLength: b.length,
    });
    return 0;
  }
  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

const calculateCollisionRadius = (node) => {
  // Replace this with your logic to determine node size
  const nodeSize = node.size || 1; // Default size if not specified
  return nodeSize + 3; // Add padding if desired
};

export default function Jobs({ params }) {
  const { username } = params;
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // Track if initialized

  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const graphRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [jobInfo, setJobInfo] = useState({}); // Store parsed job info
  const [graphData, setGraphData] = useState(null);

  const [mostRelevant, setMostRelevant] = useState([]);
  const [lessRelevant, setLessRelevant] = useState([]);

  // Center and zoom the graph when it's ready
  const handleEngineStop = useCallback(() => {
    console.log('ENGINE STOPPED Graph instance:', graphRef.current);
    if (graphRef.current) {
      if (!isInitialized) {
        const fg = graphRef.current;
        console.log('FG IS STARTING', fg);
        if (fg) {
          // Deactivate existing forces if necessary
          // fg.d3Force('center', null);
          fg.d3Force(
            'charge',
            forceManyBody()
              .strength(-300) // Negative values repel nodes; adjust this value for more/less repulsion
              .distanceMax(600) // Maximum distance where the charge force is applied
              .distanceMin(20), // Minimum distance where the charge force is applied
          );

          // Add custom collision force
          fg.d3Force(
            'collide',
            forceCollide().radius((node) => calculateCollisionRadius(node)),
          );

          // Update link distance
          // fg.d3Force(
          //   'link',
          //   forceLink().distance((link) => {
          //     const sourceSize = link.source.size || 1;
          //     const targetSize = link.target.size || 1;
          //     const baseDistance = 150; // Base distance between nodes
          //     return baseDistance + sourceSize + targetSize;
          //   }),
          // );
          setIsInitialized(true);
        }
      }
    }
  }, []);

  // Update dimensions when component mounts
  useEffect(() => {
    const container = document.getElementById('graph-container');
    if (container) {
      const width = container.offsetWidth;
      const height = 600;
      setDimensions({ width, height });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/jobs-graph', { username });
        const { graphData, jobInfoMap, mostRelevant, lessRelevant, allJobs } =
          response.data;

        setMostRelevant(mostRelevant);
        setLessRelevant(lessRelevant);
        setJobs(allJobs);
        setJobInfo(jobInfoMap);
        setGraphData(graphData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  if (isLoading || !graphData) {
    return (
      <div className="p-6">
        <div className="mt-4 text-lg">
          <p>Loading jobs graph...</p>
        </div>
        <div
          id="graph-container"
          className="w-full h-[600px] bg-blue-50 relative mt-4"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* <Hero
        title="Jobs graph"
        description="This page shows the most related jobs to you in a directed force graph. Jobs with the most relevance appear linked to your resume. Less relevant jobs are connected to other jobs instead of directly to your resume."
      /> */}

      {/* {!jobs && <Loading />} */}
      <div className="mt-4 text-lg">
        {jobs ? (
          <p>
            Found {jobs.length} related jobs ({mostRelevant.length} highly
            relevant)
          </p>
        ) : (
          <p>Loading jobs...</p>
        )}
      </div>

      <div
        id="graph-container"
        className="w-full h-[600px] bg-blue-50 relative mt-4"
      >
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          backgroundColor="#EFF6FF"
          nodeColor={(node) => node.color}
          onNodeHover={setHoveredNode}
          nodeVal={(node) => node.size}
          nodeCanvasObjectMode={() => 'after'}
          nodeCanvasObject={(node, ctx) => {
            ctx.beginPath();
            ctx.arc(
              node.x,
              node.y,
              calculateCollisionRadius(node),
              0,
              2 * Math.PI,
            );
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.stroke();

            if (node.group !== -1) {
              const jobIndex = [...mostRelevant, ...lessRelevant].findIndex(
                (j) => j.uuid === node.id,
              );
              if (jobIndex !== -1) {
                // Start with size 12 for rank 1, decrease gradually to minimum size 3
                const maxSize = 22;
                const minSize = 4;
                const sizeRange = maxSize - minSize;
                const totalJobs = mostRelevant.length + lessRelevant.length;
                // node.size = Math.max(minSize, maxSize);
                node.size = Math.max(
                  minSize,
                  maxSize - (sizeRange * jobIndex) / totalJobs,
                );
              }
            }

            //   // Draw node with border
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();

            //   // Draw rank number for job nodes
            if (node.group !== -1) {
              const jobIndex = [...mostRelevant, ...lessRelevant].findIndex(
                (j) => j.uuid === node.id,
              );
              if (jobIndex !== -1) {
                const fontSize = Math.max(10, node.size * 0.8);
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#000';
                ctx.fillText(jobIndex + 1, node.x, node.y);
              }
            }

            //   // Draw regular label for resume node
            if (node.group === -1) {
              const label = node.label || node.id;
              const fontSize = Math.max(14, node.size);
              ctx.font = `bold ${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(
                (n) => n + fontSize * 0.2,
              );

              // Draw background for label
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.roundRect(
                node.x - bckgDimensions[0] / 2,
                node.y - bckgDimensions[1] * 2,
                bckgDimensions[0],
                bckgDimensions[1],
                5,
              );
              ctx.fill();
              ctx.stroke();

              // Draw label
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#000';
              ctx.fillText(label, node.x, node.y - bckgDimensions[1] * 1.5);
            }
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            // Draw a larger hit area for hover detection
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * 2, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          onRenderFramePost={(ctx, rootGroup) => {
            // Render tooltip after everything else
            if (hoveredNode && hoveredNode.group !== -1) {
              const info = jobInfo[hoveredNode.id];
              if (!info) return;

              const tooltip = formatTooltip(info);
              const maxWidth = 300;
              const fontSize = 12;
              const lineHeight = fontSize + 4;
              ctx.font = `${fontSize}px Sans-Serif`;

              // Word wrap function
              const wrapText = (text, maxWidth) => {
                const words = text.split(' ');
                const lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                  const word = words[i];
                  const width = ctx.measureText(currentLine + ' ' + word).width;
                  if (width < maxWidth) {
                    currentLine += ' ' + word;
                  } else {
                    lines.push(currentLine);
                    currentLine = word;
                  }
                }
                lines.push(currentLine);
                return lines;
              };

              // Process each line of the tooltip
              const rawLines = tooltip.split('\n');
              const wrappedLines = [];
              rawLines.forEach((line) => {
                if (line.trim() === '') {
                  wrappedLines.push('');
                } else {
                  wrappedLines.push(...wrapText(line, maxWidth - 20));
                }
              });

              // Calculate tooltip dimensions
              const tooltipWidth = Math.min(
                maxWidth,
                Math.max(
                  ...wrappedLines.map((line) => ctx.measureText(line).width),
                ) + 20,
              );
              const tooltipHeight = wrappedLines.length * lineHeight + 10;

              // Position tooltip, checking for screen boundaries
              let tooltipX = hoveredNode.x - tooltipWidth / 2;
              let tooltipY =
                hoveredNode.y - hoveredNode.size - tooltipHeight - 10;

              // Check if tooltip would go off the top of the screen
              if (tooltipY < 0) {
                // Position below the node instead
                tooltipY = hoveredNode.y + hoveredNode.size + 10;
              }

              // Check horizontal boundaries
              if (tooltipX < 0) {
                tooltipX = 0;
              } else if (tooltipX + tooltipWidth > ctx.canvas.width) {
                tooltipX = ctx.canvas.width - tooltipWidth;
              }

              // Draw tooltip background
              ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
              ctx.strokeStyle = '#000';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5);
              ctx.fill();
              ctx.stroke();

              // Draw tooltip text
              ctx.fillStyle = '#000';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'top';
              wrappedLines.forEach((line, i) => {
                ctx.fillText(
                  line,
                  tooltipX + 10,
                  tooltipY + 5 + i * lineHeight,
                );
              });
            }
          }}
          linkWidth={(link) => Math.sqrt(link.value) * 2}
          linkColor="#cccccc"
          linkOpacity={0.3}
          enableNodeDrag={true}
          cooldownTicks={100}
          warmupTicks={100}
          width={dimensions.width}
          height={dimensions.height}
          onEngineStop={handleEngineStop}
          minZoom={0.1}
          maxZoom={5}
          forceEngine="d3"
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      </div>
    </div>
  );
}
