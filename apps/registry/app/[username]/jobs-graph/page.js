'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { LoadingAnimation } from './components/LoadingAnimation';
import { JobDetailPanel } from './components/JobDetailPanel';
import { useJobGraphData } from './hooks/useJobGraphData';
import { useReadJobs } from './hooks/useReadJobs';
import { useJobFiltering } from './hooks/useJobFiltering';
import { useSalaryRange } from './hooks/useSalaryRange';
import { usePathFinding } from './hooks/usePathFinding';
import { getNodeBackground, getEdgeStyle } from './utils/colorUtils';
import './styles.css';

export default function JobsGraph({ params }) {
  const { username } = params;

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI state
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showSalaryGradient, setShowSalaryGradient] = useState(false);

  // Custom hooks
  const { jobInfo, isLoading } = useJobGraphData(username, setNodes, setEdges);
  const { readJobs, markJobAsRead } = useReadJobs(username);
  const filteredNodes = useJobFiltering(filterText, jobInfo);
  const salaryRange = useSalaryRange(jobInfo);
  const findPathToResume = usePathFinding(nodes);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  // Calculate node backgrounds
  const nodesWithStyle = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      opacity:
        filterText && !node.data.isResume && !filteredNodes.has(node.id)
          ? 0.2
          : 1,
      background: getNodeBackground({
        node,
        jobData: jobInfo[node.id],
        username,
        readJobs,
        showSalaryGradient,
        salaryRange,
        filterText,
        filteredNodes,
      }),
    },
  }));

  // Calculate edge styles
  const edgesWithStyle = edges.map((edge) => {
    if (!selectedNode) return edge;
    const pathToResume = findPathToResume(edges, selectedNode.id);
    return {
      ...edge,
      animated: pathToResume.has(edge.id),
      style: getEdgeStyle(edge, pathToResume),
    };
  });

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

      <div className="px-4 py-3 bg-white border-b">
        <div className="max-w-6xl">
          <p className="mb-2">
            This graph uses vector similarity to match your resume with relevant
            job postings from Hacker News "Who is Hiring?" threads. Jobs are
            analyzed and matched against your resume using natural language
            processing.
          </p>
          <p className="text-sm text-gray-600">
            Note: This is an experimental feature and may not catch every job or
            skill match perfectly.
          </p>
        </div>
      </div>

      {isLoading || !nodes.length ? (
        <div className="flex-1 flex justify-center items-center">
          <LoadingAnimation />
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

          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodesWithStyle}
              edges={edgesWithStyle}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              fitView={false}
              minZoom={0.05}
              maxZoom={4}
              defaultZoom={1.2}
              onInit={(reactFlowInstance) => {
                setTimeout(() => {
                  const resumeNode = nodes.find((node) => node.data.isResume);
                  if (resumeNode) {
                    reactFlowInstance.setCenter(
                      resumeNode.position.x,
                      resumeNode.position.y,
                      { zoom: 1.2, duration: 800 }
                    );
                  }
                }, 100);
              }}
              proOptions={{ hideAttribution: true }}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>

            <JobDetailPanel
              selectedNode={selectedNode}
              filterText={filterText}
              username={username}
              readJobs={readJobs}
              onMarkAsRead={markJobAsRead}
            />
          </div>
        </>
      )}
    </div>
  );
}
