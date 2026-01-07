'use client';

import { useState, useCallback, useMemo } from 'react';
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

import JobNode from '@/app/[username]/jobs-graph/components/JobNode';
import '@/app/[username]/jobs-graph/components/JobNode.css';

import { PathwaysGraphControls } from './graph/PathwaysGraphControls';
import { PathwaysJobPanel } from './graph/PathwaysJobPanel';
import { PathwaysGraphLoading } from './graph/PathwaysGraphLoading';

// Custom node types for React Flow
const nodeTypes = {
  jobNode: JobNode,
};

export default function PathwaysGraph() {
  const {
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    graphVersion,
    readJobIds,
    markAsRead,
    resume,
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

  // Fetch jobs data using the cached embedding
  const { jobInfo, isLoading, loadingStage, loadingDetails } =
    usePathwaysJobData({
      embedding,
      resume,
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

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilterText('');
    setRemoteOnly(false);
    setHideFiltered(false);
  }, []);

  // Calculate job counts (exclude resume node)
  const totalJobs = useMemo(
    () => nodes.filter((n) => !n.data?.isResume).length,
    [nodes]
  );
  const visibleJobCount = useMemo(
    () => visibleNodes.filter((n) => !n.data?.isResume).length,
    [visibleNodes]
  );

  // Debug logging
  console.log('[PathwaysGraph] Render state:', {
    isEmbeddingLoading,
    embeddingStage,
    isLoading,
    loadingStage,
    nodesCount: nodes.length,
    hasEmbedding: !!embedding,
  });

  // Show loading state if:
  // - Embedding is loading, OR
  // - Graph is loading and we have no nodes, OR
  // - We have embedding but no nodes yet (gap between embedding complete and graph loading start)
  const shouldShowLoading =
    isEmbeddingLoading ||
    (isLoading && nodes.length === 0) ||
    (embedding && nodes.length === 0);

  if (shouldShowLoading) {
    console.log('[PathwaysGraph] Showing loading screen', {
      isEmbeddingLoading,
      embeddingStage,
      isLoading,
      loadingStage,
      reason: isEmbeddingLoading
        ? 'embedding loading'
        : isLoading
        ? 'graph loading'
        : 'waiting for nodes',
    });
    return (
      <PathwaysGraphLoading
        isEmbeddingLoading={isEmbeddingLoading}
        embeddingStage={embeddingStage}
        loadingStage={loadingStage}
        loadingDetails={loadingDetails}
      />
    );
  }

  // Show empty state if no embedding
  if (!embedding) {
    console.log('[PathwaysGraph] Showing empty state (no embedding)');
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Loading resume embedding...</p>
      </div>
    );
  }

  console.log('[PathwaysGraph] Showing graph with', nodes.length, 'nodes');

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
        totalJobs={totalJobs}
        visibleJobs={visibleJobCount}
        hasActiveFilter={hasActiveFilter}
        onClearFilters={handleClearFilters}
      />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodesWithStyle}
          edges={edgesWithStyle}
          nodeTypes={nodeTypes}
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
          onClose={() => setSelectedNode(null)}
        />
      </div>
    </div>
  );
}
