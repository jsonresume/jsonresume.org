'use client';

import dynamic from 'next/dynamic';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import Hero from '../../../src/ui/Hero';
import Loading from '../../components/Loading';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

export default function Jobs({ params }) {
  const { username } = params;
  const [jobs, setJobs] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [graphData, setGraphData] = useState({
    nodes: [
      {
        id: 'Current Resume',
        group: -1,
        size: 8,
        color: '#ff0000',
        x: 400,
        y: 300,
        fx: 400,
        fy: 300,
      },
    ],
    links: [],
  });

  // Initialize dimensions on mount
  useEffect(() => {
    // Set initial dimensions
    const container = document.getElementById('graph-container');
    if (container) {
      setDimensions({
        width: container.offsetWidth,
        height: 600,
      });
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/jobs', { username });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <Hero
        title="Jobs graph"
        description="This page shows the most related jobs to you in a directed force graph. Jobs with the most relevance appear linked to your resume. Less relevant jobs are connected to other jobs instead of directly to your resume."
      />

      {!jobs && <Loading />}
      <div className="mt-4 text-lg">
        {jobs ? (
          <p>Found {jobs.length} related jobs</p>
        ) : (
          <p>Loading jobs...</p>
        )}
      </div>

      <div
        id="graph-container"
        className="w-full h-[600px] bg-blue-50 relative mt-4"
      >
        <ForceGraph2D
          graphData={graphData}
          backgroundColor="#EFF6FF"
          nodeColor={(node) => node.color}
          nodeCanvasObject={(node, ctx) => {
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * 2, 0, 2 * Math.PI);
            ctx.fillStyle = node.color;
            ctx.fill();

            // Draw label
            const label = node.id;
            const fontSize = Math.max(14, node.size * 1.5);
            ctx.font = `${fontSize}px Sans-Serif`;
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
          nodeRelSize={6}
          linkWidth={1}
          linkColor="#cccccc"
          linkOpacity={0.3}
          enableNodeDrag={false}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          warmupTicks={100}
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </div>
  );
}
