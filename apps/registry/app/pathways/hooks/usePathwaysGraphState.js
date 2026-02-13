'use client';

import { useState, useCallback, useMemo, useDeferredValue } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { usePathways } from '../context/PathwaysContext';
import { usePathwaysJobData } from './usePathwaysJobData';
import { useGraphPreferences } from './useGraphPreferences';
import { useJobFiltering } from '@/app/[username]/jobs-graph/hooks/useJobFiltering';
import { useSalaryRange } from '@/app/[username]/jobs-graph/hooks/useSalaryRange';
import { usePathFinding } from '@/app/[username]/jobs-graph/hooks/usePathFinding';
import { useGraphFiltering } from '@/app/[username]/jobs-graph/hooks/useGraphFiltering';
import { useGraphStyling } from '@/app/[username]/jobs-graph/hooks/useGraphStyling';
import { useKeyboardNavigation } from '@/app/[username]/jobs-graph/hooks/useKeyboardNavigation';
import { useSiblingNavigation } from './useSiblingNavigation';

/**
 * Hook to manage PathwaysGraph state, filtering, and styling.
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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Preferences (filter state + persistence)
  const prefs = useGraphPreferences();
  const deferredFilterText = useDeferredValue(prefs.filterText);

  // Fetch jobs data
  const { jobInfo, nearestNeighbors, isLoading, loadingStage, loadingDetails } =
    usePathwaysJobData({
      embedding,
      resume,
      graphVersion,
      setNodes,
      setEdges,
      timeRange: prefs.timeRange,
    });

  // Convert job state Sets to prefixed format
  const readJobs = new Set([...readJobIds].map((id) => `pathways_${id}`));
  const interestedJobs = new Set(
    [...(interestedJobIds || [])].map((id) => `pathways_${id}`)
  );

  // Filtering and styling
  const filteredNodes = useJobFiltering(
    deferredFilterText,
    jobInfo,
    prefs.remoteOnly
  );
  const salaryRange = useSalaryRange(jobInfo);
  const findPathToResume = usePathFinding(nodes);
  const hasActiveFilter = Boolean(
    deferredFilterText || prefs.remoteOnly || prefs.timeRange !== '1m'
  );

  const { visibleNodes, visibleEdges } = useGraphFiltering({
    nodes,
    edges,
    filteredNodes,
    readJobs,
    hideFiltered: prefs.hideFiltered,
    username: 'pathways',
    hasActiveFilter,
    jobInfo,
    salaryFilterRange: salaryRange.filterRange,
    showSalaryGradient: prefs.showSalaryGradient,
    timeRange: prefs.timeRange,
    nearestNeighbors,
  });

  const { nodesWithStyle, edgesWithStyle } = useGraphStyling({
    nodes: visibleNodes,
    edges: visibleEdges,
    jobInfo,
    username: 'pathways',
    readJobs,
    interestedJobs,
    showSalaryGradient: prefs.showSalaryGradient,
    salaryRange,
    filterText: deferredFilterText,
    filteredNodes,
    selectedNode,
    findPathToResume,
    remoteOnly: prefs.remoteOnly,
    hideFiltered: prefs.hideFiltered,
  });

  // Navigation
  useKeyboardNavigation({
    selectedNode,
    setSelectedNode,
    edges: visibleEdges,
    nodes: visibleNodes,
    reactFlowInstance,
    onMarkAsRead: markAsRead,
  });

  const { navigateToNextSibling } = useSiblingNavigation({
    edges: visibleEdges,
    nodes: visibleNodes,
    setSelectedNode,
    reactFlowInstance,
  });

  // Event handlers
  const handleNodeClick = useCallback((_, node) => setSelectedNode(node), []);
  const handleMarkAsReadAndMove = useCallback(
    (jobId) => {
      markAsRead(jobId);
      navigateToNextSibling(jobId);
    },
    [markAsRead, navigateToNextSibling]
  );

  // Job counts
  const totalJobs = useMemo(
    () => nodes.filter((n) => !n.data?.isResume).length,
    [nodes]
  );
  const visibleJobCount = useMemo(
    () => visibleNodes.filter((n) => !n.data?.isResume).length,
    [visibleNodes]
  );

  const shouldShowLoading =
    isEmbeddingLoading ||
    (isLoading && nodes.length === 0) ||
    (embedding && nodes.length === 0);

  return {
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    readJobIds,
    promptJobFeedback,
    onNodesChange,
    onEdgesChange,
    nodesWithStyle,
    edgesWithStyle,
    selectedNode,
    setSelectedNode,
    filterText: prefs.filterText,
    setFilterText: prefs.setFilterText,
    showSalaryGradient: prefs.showSalaryGradient,
    setShowSalaryGradient: prefs.setShowSalaryGradient,
    remoteOnly: prefs.remoteOnly,
    setRemoteOnly: prefs.setRemoteOnly,
    hideFiltered: prefs.hideFiltered,
    setHideFiltered: prefs.setHideFiltered,
    timeRange: prefs.timeRange,
    setTimeRange: prefs.setTimeRange,
    setReactFlowInstance,
    initialViewport: prefs.initialViewport,
    salaryRange,
    totalJobs,
    visibleJobCount,
    hasActiveFilter,
    isLoading,
    loadingStage,
    loadingDetails,
    shouldShowLoading,
    handleNodeClick,
    handleMarkAsReadAndMove,
    handleClearFilters: prefs.handleClearFilters,
    handleMoveEnd: prefs.handleMoveEnd,
  };
}

export default usePathwaysGraphState;
