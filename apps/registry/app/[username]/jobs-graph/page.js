'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState, useCallback, useRef } from 'react';
import Hero from '../../../src/ui/Hero';
import Loading from '../../components/Loading';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

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

export default function Jobs({ params }) {
  const { username } = params;
  const [jobs, setJobs] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const graphRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [graphData, setGraphData] = useState({
    nodes: [
      {
        id: username,
        group: -1,
        size: 8,
        color: '#ff0000',
        x: 0,
        y: 0,
      },
    ],
    links: [],
  });

  const [mostRelevant, setMostRelevant] = useState([]);
  const [lessRelevant, setLessRelevant] = useState([]);

  // Center and zoom the graph when it's ready
  const handleEngineStop = useCallback(() => {
    if (graphRef.current) {
      graphRef.current.centerAt(0, 0);
      graphRef.current.zoom(10);
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
      try {
        const response = await axios.post('/api/jobs', { username });
        const sortedJobs = response.data.sort(
          (a, b) => b.similarity - a.similarity,
        );

        // Debug job structure
        console.log('Sample job:', sortedJobs[0]);

        // Split into most relevant (top 20) and less relevant
        const topJobs = sortedJobs.slice(0, 20);
        const otherJobs = sortedJobs.slice(20);

        setMostRelevant(topJobs);
        setLessRelevant(otherJobs);
        setJobs(sortedJobs);

        // Create nodes for most relevant jobs
        const jobNodes = topJobs.map((job) => {
          const parsedJob = JSON.parse(job.gpt_content);
          return {
            id: job.uuid,
            label: parsedJob.title,
            group: 1,
            size: 5,
            color: '#4287f5',
            vector: JSON.parse(job.embedding_v5),
          };
        });

        // Create nodes for less relevant jobs
        const lessRelevantNodes = otherJobs.map((job) => {
          const parsedJob = JSON.parse(job.gpt_content);
          return {
            id: job.uuid,
            label: parsedJob.title,
            group: 2,
            size: 3,
            color: '#87ceeb',
            vector: JSON.parse(job.embedding_v5),
          };
        });

        // Create links from resume to most relevant jobs
        const resumeLinks = topJobs.map((job) => ({
          source: username,
          target: job.uuid,
          value: job.similarity,
        }));

        // Keep track of nodes that are already in the graph
        const graphNodeIds = new Set([username, ...topJobs.map(job => job.uuid)]);
        
        // Create links from less relevant jobs to their most similar plotted job
        const jobToJobLinks = [];
        
        // Process less relevant jobs one at a time
        otherJobs.forEach((lessRelevantJob) => {
          // Find the most similar job from already plotted nodes
          let maxSimilarity = -1;
          let mostSimilarJobId = null;
          const lessRelevantVector = JSON.parse(lessRelevantJob.embedding_v5);

          // Only compare against jobs already in the graph
          sortedJobs.forEach((otherJob) => {
            if (!graphNodeIds.has(otherJob.uuid)) return; // Skip jobs not yet in graph
            if (otherJob.uuid === lessRelevantJob.uuid) return; // Skip self-comparison
            
            const otherVector = JSON.parse(otherJob.embedding_v5);
            const similarity = cosineSimilarity(
              lessRelevantVector,
              otherVector,
            );

            if (similarity > maxSimilarity) {
              maxSimilarity = similarity;
              mostSimilarJobId = otherJob.uuid;
            }
          });

          // Add the link and mark this node as now in the graph
          if (mostSimilarJobId) {
            jobToJobLinks.push({
              source: mostSimilarJobId,
              target: lessRelevantJob.uuid,
              value: maxSimilarity,
            });
            graphNodeIds.add(lessRelevantJob.uuid);
          }
        });

        // Update graph with all nodes and links
        setGraphData({
          nodes: [
            {
              id: username,
              group: -1,
              size: 8,
              color: '#ff0000',
              x: 0,
              y: 0,
            },
            ...jobNodes,
            ...lessRelevantNodes,
          ],
          links: [...resumeLinks, ...jobToJobLinks],
        });

        console.log(
          'Most relevant jobs:',
          topJobs.map((job) => {
            const parsedJob = JSON.parse(job.gpt_content);

            return {
              uuid: job.uuid,
              title: parsedJob.title,
              similarity: job.similarity,
            };
          }),
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [username]);

  return (
    <div className="p-6">
      <Hero
        title="Jobs graph"
        description="This page shows the most related jobs to you in a directed force graph. Jobs with the most relevance appear linked to your resume. Less relevant jobs are connected to other jobs instead of directly to your resume."
      />

      {!jobs && <Loading />}
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
          nodeRelSize={1}
          nodeVal={8}  // Base node size
          nodeVisibility={true}
          nodeCanvasObjectMode={() => "after"}
          nodeCanvasObject={(node, ctx) => {
            // Draw node with border
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Only draw label for resume node or hovered node
            if (node.group === -1 || node === hoveredNode) {
              const label = node.label || node.id;
              const fontSize = node.group === -1 ? Math.max(14, node.size) : 12;
              ctx.font = `${node.group === -1 ? 'bold' : 'normal'} ${fontSize}px Sans-Serif`;
              const textWidth = ctx.measureText(label).width;
              const bckgDimensions = [textWidth, fontSize].map(
                (n) => n + fontSize * 0.2,
              );

              // Draw background for label
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillRect(
                node.x - bckgDimensions[0] / 2,
                node.y - bckgDimensions[1] * 2,
                bckgDimensions[0],
                bckgDimensions[1],
              );

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
          linkWidth={(link) => Math.sqrt(link.value) * 2}
          linkColor="#cccccc"
          linkOpacity={0.3}
          enableNodeDrag={false}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          warmupTicks={100}
          width={dimensions.width}
          height={dimensions.height}
          onEngineStop={handleEngineStop}
          minZoom={0.1}
          maxZoom={5}
          d3Force="charge"
          d3ForceStrength={-200}
          linkDistance={100}
        />
      </div>
    </div>
  );
}
