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
      width: node.data.isResume ? 150 : 80, 
      height: node.data.isResume ? 150 : 80 
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
        x: nodeWithPosition.x - (node.data.isResume ? 75 : 40),
        y: nodeWithPosition.y - (node.data.isResume ? 75 : 40),
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
      return {
        id: node.id,
        type: 'default',
        position: { x: 0, y: 0 }, // Position will be set by dagre
        data: { 
          label: isResume ? 'Your Resume' : `Job ${node.id}`,
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
        
        const { nodes: rfNodes, edges: rfEdges } = convertToReactFlowFormat(graphData, jobInfoMap);
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
      <div className="p-6">
        <nav className="mb-6">
          <Link
            href={`/${username}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-4 h-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to {username}'s Profile
          </Link>
        </nav>

        <div className="space-y-6 mb-8 max-w-4xl">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Job Matches Graph
            </h1>
            <p className="text-lg text-gray-600">
              This graph shows jobs that match your resume. The closer a job
              matches your skills and experience, the larger and more connected
              its circle will be.
            </p>
            <div className="mt-4 text-sm text-gray-500 space-y-2">
              <p>
                Jobs are sourced from Hacker News "Who is Hiring?" posts. The
                matching process takes a moment to analyze each position against
                your resume.
              </p>
              <p>
                Note: This is an experimental feature and may not catch every
                job or skill match perfectly.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How to Use the Graph
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Reading the Graph
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Your resume sits in the center
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Bigger circles mean closer skill matches
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Numbers show match rank (1 is the best match)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Tools to Help You
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Click any job to see its details
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Search helps find specific jobs
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Salary view shows pay ranges in blue
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Mark jobs as read to keep track
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-lg">
          <p>Loading jobs graph...</p>
          <p className="mt-2 text-sm text-gray-500">
            This might take a minute as we analyze job matches. Thanks for your
            patience!
          </p>
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
      <nav className="mb-6">
        <Link
          href={`/${username}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-4 h-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back to {username}'s Profile
        </Link>
      </nav>

      <div className="space-y-6 mb-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Matches Graph
          </h1>
          <p className="text-lg text-gray-600">
            This graph shows jobs that match your resume. The closer a job
            matches your skills and experience, the larger and more connected
            its circle will be.
          </p>
          <div className="mt-4 text-sm text-gray-500 space-y-2">
            <p>
              Jobs are sourced from Hacker News "Who is Hiring?" posts. The
              matching process takes a moment to analyze each position against
              your resume.
            </p>
            <p>
              Note: This is an experimental feature and may not catch every
              job or skill match perfectly.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How to Use the Graph
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Reading the Graph
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Your resume sits in the center
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Bigger circles mean closer skill matches
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Numbers show match rank (1 is the best match)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Tools to Help You
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Click any job to see its details
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Search helps find specific jobs
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Salary view shows pay ranges in blue
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Mark jobs as read to keep track
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-lg">
        {jobs && <p>Found {jobs.length} related jobs</p>}
      </div>

      <div style={{ width: '100%', height: '800px' }} className="bg-blue-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
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
          <div
            className="absolute top-4 right-4 max-w-sm bg-white p-4 rounded-lg shadow-lg border border-gray-200"
          >
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
          border: 2px solid black;
          border-radius: 50%;
          width: 150px !important;
          height: 150px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-weight: bold;
        }
        
        .job-node {
          background: #fef9c3;
          border: 1px solid black;
          border-radius: 50%;
          width: 80px !important;
          height: 80px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 12px;
        }

        .react-flow__edge-path {
          stroke: #cccccc;
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
