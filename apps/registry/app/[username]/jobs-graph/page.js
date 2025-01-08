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

export default function Jobs({ params }) {
  const { username } = params;
  const [jobs, setJobs] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const graphRef = useRef();
  const [graphData, setGraphData] = useState({
    nodes: [
      {
        id: username,
        group: -1,
        size: 4,
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

        // Split into most relevant (top 20) and less relevant
        const topJobs = sortedJobs.slice(0, 20);
        const otherJobs = sortedJobs.slice(20);

        setMostRelevant(topJobs);
        setLessRelevant(otherJobs);
        setJobs(sortedJobs);

        // Create nodes and links for the graph
        const jobNodes = topJobs.map((job) => {
          const parsedJob = JSON.parse(job.gpt_content);
          return {
            id: job.uuid,
            label: parsedJob.title,
            group: 1,
            size: 3,
            color: '#4287f5', // Blue color for job nodes
          };
        });

        const jobLinks = topJobs.map((job) => ({
          source: username,
          target: job.uuid,
          value: job.similarity,
        }));

        // Update graph with new nodes and links
        setGraphData({
          nodes: [
            {
              id: username,
              group: -1,
              size: 4,
              color: '#ff0000',
              x: 0,
              y: 0,
            },
            ...jobNodes,
          ],
          links: jobLinks,
        });

        // Log the most relevant jobs
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
          nodeCanvasObject={(node, ctx) => {
            // Draw node with border
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label
            const label = node.label || node.id;
            // Larger font for resume node, smaller for job nodes
            const fontSize = node.group === -1 ? Math.max(14, node.size) : 6;
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
          }}
          nodeRelSize={1}
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
