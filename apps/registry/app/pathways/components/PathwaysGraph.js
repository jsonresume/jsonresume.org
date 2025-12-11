'use client';

import { useState, useCallback } from 'react';
import {
  useNodesState,
  useEdgesState,
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { usePathways } from '../context/PathwaysContext';
import { usePathwaysJobData } from '../hooks/usePathwaysJobData';
import { useJobFiltering } from '@/app/[username]/jobs-graph/hooks/useJobFiltering';
import { useSalaryRange } from '@/app/[username]/jobs-graph/hooks/useSalaryRange';
import { usePathFinding } from '@/app/[username]/jobs-graph/hooks/usePathFinding';
import { useGraphFiltering } from '@/app/[username]/jobs-graph/hooks/useGraphFiltering';
import { useGraphStyling } from '@/app/[username]/jobs-graph/hooks/useGraphStyling';
import { useKeyboardNavigation } from '@/app/[username]/jobs-graph/hooks/useKeyboardNavigation';

import { PathwaysGraphControls } from './graph/PathwaysGraphControls';
import { PathwaysJobPanel } from './graph/PathwaysJobPanel';
import { PathwaysGraphLoading } from './graph/PathwaysGraphLoading';

export default function PathwaysGraph() {
  const {
    embedding,
    isEmbeddingLoading,
    graphVersion,
    readJobIds,
    markAsRead,
  } = usePathways();

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // UI state
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showSalaryGradient, setShowSalaryGradient] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [hideFiltered, setHideFiltered] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Fetch jobs data
  const { jobInfo, isLoading } = usePathwaysJobData({
    embedding,
    graphVersion,
    setNodes,
    setEdges,
  });

  // Convert readJobIds Set to the format expected by jobs-graph hooks
  // The jobs-graph hooks expect keys like `${username}_${jobId}` but we just use jobId
  const readJobs = new Set([...readJobIds].map((id) => `pathways_${id}`));

  // Filtering and styling hooks
  const filteredNodes = useJobFiltering(filterText, jobInfo, remoteOnly);
  const salaryRange = useSalaryRange(jobInfo);
  const findPathToResume = usePathFinding(nodes);

  const hasActiveFilter = Boolean(filterText || remoteOnly);

  const { visibleNodes, visibleEdges } = useGraphFiltering({
    nodes,
    edges,
    filteredNodes,
    readJobs,
    hideFiltered,
    username: 'pathways',
    hasActiveFilter,
  });

  const { nodesWithStyle, edgesWithStyle } = useGraphStyling({
    nodes: visibleNodes,
    edges: visibleEdges,
    jobInfo,
    username: 'pathways',
    readJobs,
    showSalaryGradient,
    salaryRange,
    filterText,
    filteredNodes,
    selectedNode,
    findPathToResume,
    remoteOnly,
    hideFiltered,
  });

  // Keyboard navigation
  useKeyboardNavigation({
    selectedNode,
    setSelectedNode,
    edges: visibleEdges,
    nodes: visibleNodes,
    reactFlowInstance,
    onMarkAsRead: markAsRead,
  });

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  // Show loading state
  if (isEmbeddingLoading || (isLoading && nodes.length === 0)) {
    return <PathwaysGraphLoading />;
  }

  // Show empty state if no embedding
  if (!embedding) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Loading resume embedding...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <PathwaysGraphControls
        filterText={filterText}
        setFilterText={setFilterText}
        showSalaryGradient={showSalaryGradient}
        setShowSalaryGradient={setShowSalaryGradient}
        remoteOnly={remoteOnly}
        setRemoteOnly={setRemoteOnly}
        hideFiltered={hideFiltered}
        setHideFiltered={setHideFiltered}
      />

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
          onInit={(instance) => {
            setReactFlowInstance(instance);
            setTimeout(() => {
              const resumeNode = nodes.find((node) => node.data?.isResume);
              if (resumeNode) {
                instance.setCenter(
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

        <PathwaysJobPanel
          selectedNode={selectedNode}
          filterText={filterText}
          readJobIds={readJobIds}
          onMarkAsRead={markAsRead}
        />
      </div>
    </div>
  );
}
