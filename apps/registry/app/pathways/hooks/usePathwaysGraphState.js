'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { usePathways } from '../context/PathwaysContext';
import { usePathwaysJobData } from './usePathwaysJobData';
import { usePathwaysPreferences } from './usePathwaysPreferences';
import { useJobFiltering } from '@/app/[username]/jobs-graph/hooks/useJobFiltering';
import { useSalaryRange } from '@/app/[username]/jobs-graph/hooks/useSalaryRange';
import { usePathFinding } from '@/app/[username]/jobs-graph/hooks/usePathFinding';
import { useGraphFiltering } from '@/app/[username]/jobs-graph/hooks/useGraphFiltering';
import { useGraphStyling } from '@/app/[username]/jobs-graph/hooks/useGraphStyling';
import { useKeyboardNavigation } from '@/app/[username]/jobs-graph/hooks/useKeyboardNavigation';
import { useSiblingNavigation } from './useSiblingNavigation';

/**
 * Hook to manage PathwaysGraph state, filtering, and styling.
 * Extracts complex state management from the PathwaysGraph component.
 */
export function usePathwaysGraphState() {
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
  const { jobInfo, nearestNeighbors, isLoading, loadingStage, loadingDetails } =
    usePathwaysJobData({
      embedding,
      resume,
      graphVersion,
      setNodes,
      setEdges,
      timeRange,
    });

  // Convert job state Sets to the format expected by jobs-graph hooks
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
    nearestNeighbors,
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

  // Event handlers
  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const handleMarkAsReadAndMove = useCallback(
    (jobId) => {
      markAsRead(jobId);
      navigateToNextSibling(jobId);
    },
    [markAsRead, navigateToNextSibling]
  );

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

  const handleMoveEnd = useCallback(
    (_, viewport) => {
      if (!initializedRef.current) return;
      savePreferences({ viewport });
    },
    [savePreferences]
  );

  // Calculate job counts
  const totalJobs = useMemo(
    () => nodes.filter((n) => !n.data?.isResume).length,
    [nodes]
  );
  const visibleJobCount = useMemo(
    () => visibleNodes.filter((n) => !n.data?.isResume).length,
    [visibleNodes]
  );

  // Loading state determination
  const shouldShowLoading =
    isEmbeddingLoading ||
    (isLoading && nodes.length === 0) ||
    (embedding && nodes.length === 0);

  return {
    // Context values
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    readJobIds,
    promptJobFeedback,

    // React Flow state
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    nodesWithStyle,
    edgesWithStyle,

    // UI state
    selectedNode,
    setSelectedNode,
    filterText,
    setFilterText,
    showSalaryGradient,
    setShowSalaryGradient,
    remoteOnly,
    setRemoteOnly,
    hideFiltered,
    setHideFiltered,
    timeRange,
    setTimeRange,
    reactFlowInstance,
    setReactFlowInstance,
    initialViewport,

    // Data
    jobInfo,
    salaryRange,
    visibleNodes,
    totalJobs,
    visibleJobCount,
    hasActiveFilter,

    // Loading state
    isLoading,
    loadingStage,
    loadingDetails,
    shouldShowLoading,

    // Handlers
    handleNodeClick,
    handleMarkAsReadAndMove,
    handleClearFilters,
    handleMoveEnd,
  };
}

export default usePathwaysGraphState;
