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

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    align: 'UL',
    nodesep: 80,
    ranksep: 100,
    edgesep: 40,
    marginx: 20,
    marginy: 20,
    acyclicer: 'greedy',
    ranker: 'network-simplex',
  });

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
  const [filterText, setFilterText] = useState('');
  const [filteredNodes, setFilteredNodes] = useState(new Set());
  const [showSalaryGradient, setShowSalaryGradient] = useState(false);
  const [salaryRange, setSalaryRange] = useState({
    min: Infinity,
    max: -Infinity,
  });
  const [readJobs, setReadJobs] = useState(new Set());

  // Load read jobs from local storage
  useEffect(() => {
    const storedReadJobs = localStorage.getItem(`readJobs_${username}`);
    if (storedReadJobs) {
      setReadJobs(new Set(JSON.parse(storedReadJobs)));
    }
  }, [username]);

  // Save read jobs to local storage
  const markJobAsRead = useCallback((jobId) => {
    const newReadJobs = new Set(readJobs);
    const key = `${username}_${jobId}`;
    newReadJobs.add(key);
    setReadJobs(newReadJobs);
    localStorage.setItem(`readJobs_${username}`, JSON.stringify([...newReadJobs]));
  }, [readJobs, username]);

  // Parse salary from various string formats
  const parseSalary = useCallback((salary) => {
    if (!salary) return null;
    if (typeof salary === 'number') return salary;

    const str = salary.toString().toLowerCase();
    // Extract all numbers from the string
    const numbers = str.match(/\d+(?:\.\d+)?/g);
    if (!numbers) return null;

    // Convert numbers considering k/K multiplier
    const values = numbers.map((num) => {
      const multiplier = str.includes('k') ? 1000 : 1;
      return parseFloat(num) * multiplier;
    });

    // If range, return average
    if (values.length > 1) {
      values.sort((a, b) => a - b);
      return (values[0] + values[values.length - 1]) / 2;
    }

    return values[0];
  }, []);

  // Calculate salary range when jobs data changes
  useEffect(() => {
    if (!jobInfo) return;

    let min = Infinity;
    let max = -Infinity;

    Object.values(jobInfo).forEach((job) => {
      const salary = parseSalary(job.salary);
      if (salary) {
        min = Math.min(min, salary);
        max = Math.max(max, salary);
      }
    });

    if (min !== Infinity && max !== -Infinity) {
      setSalaryRange({ min, max });
    }
  }, [jobInfo, parseSalary]);

  // Get background color based on salary and read status
  const getNodeBackground = useCallback(
    (node, jobData) => {
      if (node.data.isResume) return 'white';

      const key = `${username}_${node.id}`;
      if (readJobs.has(key)) return '#f1f5f9';

      if (showSalaryGradient && jobData) {
        const salary = parseSalary(jobData.salary);
        if (salary) {
          const percentage =
            (salary - salaryRange.min) / (salaryRange.max - salaryRange.min);
          const lightBlue = [219, 234, 254]; // bg-blue-100
          const darkBlue = [30, 64, 175]; // bg-blue-800

          const r = Math.round(
            lightBlue[0] + (darkBlue[0] - lightBlue[0]) * percentage,
          );
          const g = Math.round(
            lightBlue[1] + (darkBlue[1] - lightBlue[1]) * percentage,
          );
          const b = Math.round(
            lightBlue[2] + (darkBlue[2] - lightBlue[2]) * percentage,
          );

          return `rgb(${r}, ${g}, ${b})`;
        }
        return '#e2e8f0'; // Light gray for no salary
      }

      return filterText && !node.data.isResume && !filteredNodes.has(node.id)
        ? '#f1f5f9'
        : 'rgb(255 241 143)';
    },
    [showSalaryGradient, salaryRange, filterText, filteredNodes, parseSalary, readJobs, username],
  );

  // Find path to resume node
  const findPathToResume = useCallback(
    (edges, startNodeId) => {
      const pathEdges = new Set();
      const visited = new Set();

      const findPath = (currentId) => {
        if (visited.has(currentId)) return false;
        visited.add(currentId);

        // Find edge going to parent
        const parentEdge = edges.find(
          (edge) => edge.target === currentId && !visited.has(edge.source),
        );

        if (!parentEdge) return false;

        pathEdges.add(parentEdge.id);

        // If we've reached the resume node (which should be a source node)
        const isParentResume = nodes.find(
          (n) => n.id === parentEdge.source && n.data.isResume,
        );

        if (isParentResume) return true;

        // Continue up the tree
        return findPath(parentEdge.source);
      };

      findPath(startNodeId);
      return pathEdges;
    },
    [nodes],
  );

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
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    }));

    return getLayoutedElements(rfNodes, rfEdges, 'TB');
  }, []);

  const getEdgeStyle = useCallback(
    (edge) => {
      if (!selectedNode) return { stroke: '#94a3b8', strokeWidth: 2 };

      const pathToResume = findPathToResume(edges, selectedNode.id);

      if (pathToResume.has(edge.id)) {
        return {
          stroke: '#3b82f6',
          strokeWidth: 2,
        };
      }

      return { stroke: '#94a3b8', strokeWidth: 2 };
    },
    [selectedNode, edges, findPathToResume],
  );

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

  // Filter nodes based on search text
  useEffect(() => {
    if (!filterText.trim() || !jobInfo) {
      setFilteredNodes(new Set());
      return;
    }

    const searchText = filterText.toLowerCase();
    const matches = new Set();

    Object.entries(jobInfo).forEach(([id, job]) => {
      const searchableText = [
        job.title,
        job.company,
        job.description,
        job.type,
        job.location?.city,
        job.location?.region,
        job.skills?.map((s) => s.name).join(' '),
        job.qualifications?.join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (searchableText.includes(searchText)) {
        matches.add(id);
      }
    });

    setFilteredNodes(matches);
  }, [filterText, jobInfo]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <nav className="px-4 py-2 bg-white border-b">
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

      <div className="px-4 py-3 bg-white border-b">
        <div className="max-w-4xl">
          <p className="mb-2">
            This graph uses vector similarity to match your resume with relevant job postings from Hacker News "Who is Hiring?" threads.
          </p>
          <p className="mb-2">
            Jobs are analyzed and matched against your resume using natural language processing. The matching process takes a moment to analyze each position.
          </p>
          <p className="text-sm text-gray-600">
            Note: This is an experimental feature and may not catch every job or skill match perfectly.
          </p>
        </div>
      </div>

      {isLoading || !nodes.length ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="text-lg">
            <p>Loading jobs graph...</p>
            <p className="mt-2 text-sm text-gray-500">
              This might take a minute as we analyze job matches. Thanks for
              your patience!
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="px-4 py-2 bg-white border-b flex items-center gap-4">
            <input
              type="text"
              placeholder="Filter jobs by title, company, skills..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showSalaryGradient}
                  onChange={(e) => setShowSalaryGradient(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Salary View
                </span>
              </label>
            </div>
          </div>

          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes.map((node) => ({
                ...node,
                style: {
                  ...node.style,
                  opacity:
                    filterText && !node.data.isResume && !filteredNodes.has(node.id)
                      ? 0.2
                      : 1,
                  background: getNodeBackground(node, jobInfo[node.id]),
                },
              }))}
              edges={edges.map((edge) => {
                if (!selectedNode) return edge;

                const pathToResume = findPathToResume(edges, selectedNode.id);
                return {
                  ...edge,
                  animated: pathToResume.has(edge.id),
                  style: getEdgeStyle(edge),
                };
              })}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView={false}
              minZoom={0.05}
              maxZoom={4}
              defaultZoom={1.2}
              onInit={(reactFlowInstance) => {
                setTimeout(() => {
                  const resumeNode = nodes.find(node => node.data.isResume);
                  if (resumeNode) {
                    reactFlowInstance.setCenter(resumeNode.position.x, resumeNode.position.y, { zoom: 1.2, duration: 800 });
                  }
                }, 100);
              }}
              proOptions={{ hideAttribution: true }}
              edgeOptions={{
                type: 'smoothstep',
              }}
              defaultEdgeOptions={{
                type: 'smoothstep',
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
                    onClick={() => markJobAsRead(selectedNode.id)}
                    className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Mark as Read
                  </button>
                </div>
                <div className="text-sm whitespace-pre-wrap">
                  {formatTooltip(selectedNode.data.jobInfo)}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <style jsx global>{`
        .resume-node {
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
          color: #1e293b;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .company-name {
          color: #334155;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .salary {
          color: #0f766e;
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
