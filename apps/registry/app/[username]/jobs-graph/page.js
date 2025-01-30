'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from '@dagrejs/dagre';

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
      ? `Location: ${jobInfo.location.city}${
          jobInfo.location.region ? `, ${jobInfo.location.region}` : ''
        }`
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

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.data.isResume ? 200 : 250,
      height: node.data.isResume ? 100 : 100,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - (node.data.isResume ? 100 : 125),
        y: nodeWithPosition.y - (node.data.isResume ? 50 : 50),
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function Jobs({ params }) {
  const { username } = params;
  const [jobs, setJobs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobInfo, setJobInfo] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // Convert graph data to React Flow format
  const convertToReactFlowFormat = useCallback((graphData, jobInfoMap) => {
    if (!graphData) return { nodes: [], edges: [] };

    const rfNodes = graphData.nodes.map((node) => {
      const isResume = node.group === -1;
      const jobData = jobInfoMap[node.id];

      return {
        id: node.id,
        type: 'default',
        position: { x: 0, y: 0 }, // Position will be set by dagre
        data: {
          label: isResume ? (
            'Your Resume'
          ) : (
            <div className="job-card-content">
              <div className="job-title">
                {jobData?.title || 'Unknown Position'}
              </div>
              <div className="company-name">
                {jobData?.company || 'Unknown Company'}
              </div>
              {jobData?.salary && (
                <div className="salary">{jobData.salary}</div>
              )}
            </div>
          ),
          jobInfo: jobInfoMap[node.id],
          isResume,
        },
        className: isResume ? 'resume-node' : 'job-node',
      };
    });

    const rfEdges = graphData.links.map((link, index) => ({
      id: `e${index}`,
      source: link.source,
      target: link.target,
      type: 'default',
      animated: true,
    }));

    // Apply dagre layout
    return getLayoutedElements(rfNodes, rfEdges, 'TB');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post('/api/jobs-graph', { username });
        const { graphData, jobInfoMap, allJobs } = response.data;

        setJobs(allJobs);
        setJobInfo(jobInfoMap);

        const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(
          graphData,
          jobInfoMap,
        );
        setNodes(rfNodes);
        setEdges(rfEdges);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username, convertToReactFlowFormat]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  if (isLoading || !nodes.length) {
    return (
      <div className="h-screen flex flex-col">
        <nav className="px-4 py-2 bg-white border-b">
          <Link
            href={`/${username}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to {username}'s Profile
          </Link>
        </nav>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-lg">
            <p>Loading jobs graph...</p>
            <p className="mt-2 text-sm text-gray-500">
              This might take a minute as we analyze job matches. Thanks for your
              patience!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <nav className="px-4 py-2 bg-white border-b">
        <Link
          href={`/${username}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to {username}'s Profile
        </Link>
      </nav>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
          minZoom={0.05}
          maxZoom={4}
          defaultZoom={0.5}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {selectedNode && selectedNode.data.jobInfo && (
          <div className="absolute top-4 right-4 max-w-sm bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{selectedNode.data.jobInfo.title}</h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="text-sm whitespace-pre-wrap">
              {formatTooltip(selectedNode.data.jobInfo)}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .resume-node {
          background: white;
          border: 2px solid #2563eb;
          border-radius: 8px;
          width: 200px !important;
          height: 100px !important;
          padding: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          font-weight: bold;
          color: #1e40af;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .job-node {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          width: 250px !important;
          height: 100px !important;
          padding: 12px;
          font-size: 14px;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.2s ease;
        }

        .job-node:hover {
          border-color: #2563eb;
          box-shadow: 0 8px 12px -1px rgb(0 0 0 / 0.1);
        }

        .job-card-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }

        .job-title {
          font-weight: 600;
          color: #111827;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .company-name {
          color: #4b5563;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .salary {
          color: #059669;
          font-size: 12px;
          font-weight: 500;
        }

        .react-flow__edge-path {
          stroke: #94a3b8;
          stroke-width: 2;
        }

        .react-flow__edge.animated path {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }

        @keyframes dashdraw {
          from {
            stroke-dashoffset: 10;
          }
        }
      `}</style>
    </div>
  );
}
