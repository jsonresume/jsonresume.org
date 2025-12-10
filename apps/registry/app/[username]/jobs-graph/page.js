'use client';

import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';

import { LoadingAnimation } from './components/LoadingAnimation';
import { GraphNavigation } from './components/graph/GraphNavigation';
import { GraphInfo } from './components/graph/GraphInfo';
import { GraphControls } from './components/graph/GraphControls';
import { GraphVisualization } from './components/graph/GraphVisualization';
import { useJobGraphData } from './hooks/useJobGraphData';
import { useReadJobs } from './hooks/useReadJobs';
import { useJobFiltering } from './hooks/useJobFiltering';
import { useSalaryRange } from './hooks/useSalaryRange';
import { usePathFinding } from './hooks/usePathFinding';
import { useGraphStyling } from './hooks/useGraphStyling';
import { useGraphFiltering } from './hooks/useGraphFiltering';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
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
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [hideFiltered, setHideFiltered] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Custom hooks
  const { jobInfo, isLoading } = useJobGraphData(username, setNodes, setEdges);
  const { readJobs, markJobAsRead } = useReadJobs(username);
  const filteredNodes = useJobFiltering(filterText, jobInfo, remoteOnly);
  const salaryRange = useSalaryRange(jobInfo);
  const findPathToResume = usePathFinding(nodes);

  // Check if any filter is active
  const hasActiveFilter = Boolean(filterText || remoteOnly);

  // Filter and reconnect nodes when hideFiltered is enabled
  const { visibleNodes, visibleEdges } = useGraphFiltering({
    nodes,
    edges,
    filteredNodes,
    readJobs,
    hideFiltered,
    username,
    hasActiveFilter,
  });

  const { nodesWithStyle, edgesWithStyle } = useGraphStyling({
    nodes: visibleNodes,
    edges: visibleEdges,
    jobInfo,
    username,
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

  // Enable keyboard navigation (arrow keys to move between nodes)
  useKeyboardNavigation({
    selectedNode,
    setSelectedNode,
    edges: visibleEdges,
    nodes: visibleNodes,
    reactFlowInstance,
  });

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <GraphNavigation username={username} />
      <GraphInfo />

      {isLoading || !nodes.length ? (
        <div className="flex-1 flex justify-center items-center">
          <LoadingAnimation />
        </div>
      ) : (
        <>
          <GraphControls
            filterText={filterText}
            setFilterText={setFilterText}
            showSalaryGradient={showSalaryGradient}
            setShowSalaryGradient={setShowSalaryGradient}
            remoteOnly={remoteOnly}
            setRemoteOnly={setRemoteOnly}
            hideFiltered={hideFiltered}
            setHideFiltered={setHideFiltered}
          />
          <GraphVisualization
            nodesWithStyle={nodesWithStyle}
            edgesWithStyle={edgesWithStyle}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            handleNodeClick={handleNodeClick}
            nodes={nodes}
            selectedNode={selectedNode}
            filterText={filterText}
            username={username}
            readJobs={readJobs}
            onMarkAsRead={markJobAsRead}
            onReactFlowInit={setReactFlowInstance}
          />
        </>
      )}
    </div>
  );
}
