'use client';

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { usePathwaysGraphState } from '../hooks/usePathwaysGraphState';
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
    // Context values
    embedding,
    isEmbeddingLoading,
    embeddingStage,
    readJobIds,
    promptJobFeedback,

    // React Flow state
    nodes,
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
    setReactFlowInstance,
    initialViewport,

    // Data
    salaryRange,
    totalJobs,
    visibleJobCount,
    hasActiveFilter,

    // Loading state
    loadingStage,
    loadingDetails,
    shouldShowLoading,

    // Handlers
    handleNodeClick,
    handleMarkAsReadAndMove,
    handleClearFilters,
    handleMoveEnd,
  } = usePathwaysGraphState();

  // Show loading state
  if (shouldShowLoading) {
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
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
          minZoom={0.05}
          maxZoom={4}
          defaultViewport={initialViewport || { x: 0, y: 0, zoom: 1 }}
          onInit={(instance) => {
            setReactFlowInstance(instance);
            // If we have saved viewport, use it; otherwise fit view
            if (initialViewport) {
              instance.setViewport(initialViewport, { duration: 0 });
            } else {
              // Fit view to show all nodes
              setTimeout(() => instance.fitView({ padding: 0.2 }), 100);
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
