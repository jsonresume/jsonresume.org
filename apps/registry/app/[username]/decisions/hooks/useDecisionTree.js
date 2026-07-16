/**
 * useDecisionTree Hook
 * Manages decision tree state, animation, and AI-powered evaluation logic
 */

import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import {
  initialNodes,
  initialEdges,
  nodeStyle,
  NODE_IDS,
} from '../config/decisionTree';
import { colors } from '../config/designSystem';
import { animateDecisionPath } from './animateDecisionPath';
import { buildVisibleGraph } from './decisionGraph';

export function useDecisionTree(resume, preferences = {}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [matchResult, setMatchResult] = useState(null);

  // Update node visibility and layout based on preferences
  useEffect(() => {
    const { nodes: visibleNodes, edges: visibleEdges } =
      buildVisibleGraph(preferences);
    setNodes(visibleNodes);
    setEdges(visibleEdges);
  }, [preferences, setNodes, setEdges]);

  // Reset all edges and nodes to default state
  const resetHighlights = useCallback(() => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        animated: false,
        style: {
          ...e.style,
          stroke: e.data?.baseColor || colors.paths.gray,
          strokeWidth: 2,
        },
      }))
    );
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style:
          n.type === 'output' || n.id === NODE_IDS.ROOT
            ? n.style // Keep outcome nodes and root styled
            : nodeStyle(), // Reset decision nodes to default
      }))
    );
    setMatchResult(null);
  }, [setEdges, setNodes]);

  // Update node color based on pass/fail
  const updateNodeColor = useCallback(
    (nodeId, passed) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                style: nodeStyle(passed ? 'success' : 'danger'),
              }
            : n
        )
      );
    },
    [setNodes]
  );

  // Highlight a specific edge with color and animation
  const highlightEdge = useCallback(
    (edgeId, color = colors.paths.blue) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId
            ? {
                ...e,
                animated: true,
                style: {
                  ...e.style,
                  stroke: color,
                  strokeWidth: 3,
                },
              }
            : e
        )
      );
    },
    [setEdges]
  );

  // Evaluate a candidate-job match using AI and animate the path
  const evaluateJob = useCallback(
    async (candidate, job) => {
      if (!candidate || !job) return;

      resetHighlights();

      // Show loading state with animated messages
      setMatchResult({
        outcome: 'loading',
        bucket: '🤖 AI is analyzing your match...',
        reasons: [
          ['Analyzing Skills', 'Comparing your skills with job requirements'],
          ['Checking Experience', 'Evaluating years of experience'],
          ['Reviewing Location', 'Assessing location compatibility'],
          ['Computing Match Score', 'Calculating overall fit percentage'],
        ],
        score: null,
      });

      try {
        const payload = { resume: candidate, job, preferences };

        // Call AI evaluation endpoint
        const response = await fetch('/api/decisions/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('AI evaluation failed');
        }

        const result = await response.json();

        // Animate path based on AI decisions
        animateAIPath(result.decisions);
      } catch (error) {
        console.error('AI evaluation error:', error);
        setMatchResult({
          outcome: 'error',
          bucket: '⚠️ Evaluation Error',
          reasons: [['Error', error.message]],
          score: 0,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resetHighlights, preferences]
  );

  // Animate decision tree path based on AI results
  const animateAIPath = useCallback(
    (decisions) => {
      const result = animateDecisionPath(decisions, {
        highlightEdge,
        updateNodeColor,
        NODE_IDS,
        colors,
      });
      setMatchResult(result);
    },
    [highlightEdge, setMatchResult, updateNodeColor]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    evaluateJob,
    matchResult,
    resetHighlights,
  };
}
