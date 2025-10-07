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

  const { nodesWithStyle, edgesWithStyle } = useGraphStyling({
    nodes,
    edges,
    jobInfo,
    username,
    readJobs,
    showSalaryGradient,
    salaryRange,
    filterText,
    filteredNodes,
    selectedNode,
    findPathToResume,
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
          />
        </>
      )}
    </div>
  );
}
