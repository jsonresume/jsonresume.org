import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { JobDetailPanel } from '../JobDetailPanel';
import JobNode from '../JobNode';
import '../JobNode.css';

// Defined at module level so React Flow doesn't re-register on every render
const nodeTypes = { jobNode: JobNode };

export function GraphVisualization({
  nodesWithStyle,
  edgesWithStyle,
  onNodesChange,
  onEdgesChange,
  handleNodeClick,
  nodes,
  selectedNode,
  filterText,
  username,
  readJobs,
  onMarkAsRead,
  onReactFlowInit,
}) {
  return (
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
        onInit={(reactFlowInstance) => {
          // Store the instance for keyboard navigation
          if (onReactFlowInit) {
            onReactFlowInit(reactFlowInstance);
          }
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
        onMarkAsRead={onMarkAsRead}
      />
    </div>
  );
}
