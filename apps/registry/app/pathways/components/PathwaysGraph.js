'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
import { usePathwaysPreferences } from '../hooks/usePathwaysPreferences';
import { useJobFiltering } from '@/app/[username]/jobs-graph/hooks/useJobFiltering';
import { useSalaryRange } from '@/app/[username]/jobs-graph/hooks/useSalaryRange';
import { usePathFinding } from '@/app/[username]/jobs-graph/hooks/usePathFinding';
import { useGraphFiltering } from '@/app/[username]/jobs-graph/hooks/useGraphFiltering';
import { useGraphStyling } from '@/app/[username]/jobs-graph/hooks/useGraphStyling';
import { useKeyboardNavigation } from '@/app/[username]/jobs-graph/hooks/useKeyboardNavigation';
import { useSiblingNavigation } from '../hooks/useSiblingNavigation';

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
    interestedJobIds,
    markAsRead,
    resume,
    promptJobFeedback,
  } = usePathways();

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Load user preferences
  const { preferences, savePreferences } = usePathwaysPreferences();
  const initializedRef = useRef(false);

  // UI state - initialized from preferences
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showSalaryGradient, setShowSalaryGradient] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [hideFiltered, setHideFiltered] = useState(false);
  const [timeRange, setTimeRange] = useState('1m');
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [initialViewport, setInitialViewport] = useState(null);

  // Initialize state from preferences once loaded
  useEffect(() => {
    if (preferences && !initializedRef.current) {
      initializedRef.current = true;
      setFilterText(preferences.filterText || '');
      setShowSalaryGradient(preferences.showSalaryGradient || false);
      setRemoteOnly(preferences.remoteOnly || false);
      setHideFiltered(preferences.hideFiltered || false);
      setTimeRange(preferences.timeRange || '1m');
      if (preferences.viewport) {
        setInitialViewport(preferences.viewport);
      }
    }
  }, [preferences]);

  // Fetch jobs data using the cached embedding
  const { jobInfo, isLoading, loadingStage, loadingDetails } =
    usePathwaysJobData({
      embedding,
      resume,
      graphVersion,
      setNodes,
      setEdges,
      timeRange,
    });

  // Convert job state Sets to the format expected by jobs-graph hooks
  // The jobs-graph hooks expect keys like `${username}_${jobId}` but we just use jobId
  const readJobs = new Set([...readJobIds].map((id) => `pathways_${id}`));
  const interestedJobs = new Set(
    [...(interestedJobIds || [])].map((id) => `pathways_${id}`)
  );

  // Filtering and styling hooks
  const filteredNodes = useJobFiltering(filterText, jobInfo, remoteOnly);
  const salaryRange = useSalaryRange(jobInfo);
  const findPathToResume = usePathFinding(nodes);

  const hasActiveFilter = Boolean(
    filterText || remoteOnly || timeRange !== '1m'
  );

  const { visibleNodes, visibleEdges } = useGraphFiltering({
    nodes,
    edges,
    filteredNodes,
    readJobs,
    hideFiltered,
    username: 'pathways',
    hasActiveFilter,
    jobInfo,
    salaryFilterRange: salaryRange.filterRange,
    showSalaryGradient,
    timeRange,
  });

  const { nodesWithStyle, edgesWithStyle } = useGraphStyling({
    nodes: visibleNodes,
    edges: visibleEdges,
    jobInfo,
    username: 'pathways',
    readJobs,
    interestedJobs,
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

  // Sibling navigation for mark as read + move
  const { navigateToNextSibling } = useSiblingNavigation({
    edges: visibleEdges,
    nodes: visibleNodes,
    setSelectedNode,
    reactFlowInstance,
  });

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  // Handle mark as read and move to next sibling
  const handleMarkAsReadAndMove = useCallback(
    (jobId) => {
      markAsRead(jobId);
      navigateToNextSibling(jobId);
    },
    [markAsRead, navigateToNextSibling]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilterText('');
    setRemoteOnly(false);
    setHideFiltered(false);
    setTimeRange('1m');
  }, []);

  // Save preferences when filters change
  useEffect(() => {
    if (!initializedRef.current) return;
    savePreferences({
      filterText,
      showSalaryGradient,
      remoteOnly,
      hideFiltered,
      timeRange,
    });
  }, [
    filterText,
    showSalaryGradient,
    remoteOnly,
    hideFiltered,
    timeRange,
    savePreferences,
  ]);

  // Save viewport on move/zoom end
  const handleMoveEnd = useCallback(
    (_, viewport) => {
      if (!initializedRef.current) return;
      savePreferences({ viewport });
    },
    [savePreferences]
  );

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
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        totalJobs={totalJobs}
        visibleJobs={visibleJobCount}
        hasActiveFilter={hasActiveFilter}
        onClearFilters={handleClearFilters}
        salaryRange={salaryRange}
      />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodesWithStyle}
          edges={edgesWithStyle}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onMoveEnd={handleMoveEnd}
          fitView={false}
          minZoom={0.05}
          maxZoom={4}
          defaultViewport={initialViewport || { x: 0, y: 0, zoom: 1.2 }}
          onInit={(instance) => {
            setReactFlowInstance(instance);
            // If we have saved viewport, use it; otherwise center on resume
            if (initialViewport) {
              instance.setViewport(initialViewport, { duration: 0 });
            } else {
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
            }
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
          onMarkAsRead={handleMarkAsReadAndMove}
          onClose={() => setSelectedNode(null)}
          onPromptFeedback={promptJobFeedback}
        />
      </div>
    </div>
  );
}
