/**
 * DecisionTreePane Component
 * Center pane - React Flow decision tree visualization
 */

'use client';

import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { reactFlowOptions } from '../config/decisionTree';

export function DecisionTreePane({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
}) {
  return (
    <div className="h-full bg-white rounded-2xl shadow-md overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        {...reactFlowOptions}
      >
        <Background
          gap={16}
          size={1}
          color="#e2e8f0"
          style={{ backgroundColor: '#f8fafc' }}
        />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          style={{
            button: {
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#1e293b',
            },
          }}
        />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => {
            // Color nodes based on their type in the style
            if (node.style?.background) {
              return node.style.background;
            }
            return '#ffffff';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        />
      </ReactFlow>
    </div>
  );
}
