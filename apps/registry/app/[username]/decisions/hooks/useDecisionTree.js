/**
 * useDecisionTree Hook
 * Manages decision tree state, animation, and AI-powered evaluation logic
 */

import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import {
  initialNodes,
  initialEdges,
  nodeStyle,
  NODE_IDS,
} from '../config/decisionTree';
import { colors } from '../config/designSystem';

export function useDecisionTree(resume) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [matchResult, setMatchResult] = useState(null);

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

      console.log('=== CLIENT: Starting AI Evaluation ===');
      console.log('Candidate:', candidate.basics?.name);
      console.log('Job:', job.title, job.company);

      resetHighlights();

      // Show loading state
      setMatchResult({
        outcome: 'loading',
        bucket: '🤖 AI Analyzing...',
        reasons: [['Status', 'Sending resume and job to AI for evaluation']],
        score: null,
      });

      try {
        const payload = { resume: candidate, job };
        console.log('Sending payload with keys:', Object.keys(payload));

        // Call AI evaluation endpoint
        const response = await fetch('/api/decisions/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error('AI evaluation failed');
        }

        const result = await response.json();
        console.log('Response data:', result);
        console.log('Decisions object:', result.decisions);
        console.log(
          'Number of decisions:',
          Object.keys(result.decisions || {}).length
        );

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
    [resetHighlights]
  );

  // Animate decision tree path based on AI results
  const animateAIPath = useCallback(
    (decisions) => {
      const reasons = [];
      let score = 0;

      // Start: Root → Core Skills
      highlightEdge('e_root_core');

      // Check 1: Required Skills (AI)
      const skillsCheck = decisions.checkRequiredSkills;
      if (skillsCheck) {
        reasons.push(['Required Skills', skillsCheck.reasoning]);
        if (!skillsCheck.hasAllSkills) {
          updateNodeColor(NODE_IDS.CORE, false);
          highlightEdge('e_core_reject_no', colors.outcomes.noMatch.border);
          setMatchResult({
            outcome: 'noMatch',
            bucket: '❌ Not a Match',
            reasons,
            score: 0,
          });
          return;
        }
        updateNodeColor(NODE_IDS.CORE, true);
        score += 40;
        highlightEdge('e_core_exp_yes', colors.paths.blue);
      }

      // Check 2: Experience (AI)
      const expCheck = decisions.checkExperience;
      if (expCheck) {
        reasons.push(['Experience', expCheck.reasoning]);
        if (!expCheck.hasEnoughExperience) {
          updateNodeColor(NODE_IDS.EXP, false);
          highlightEdge('e_exp_reject_no', colors.outcomes.noMatch.border);
          setMatchResult({
            outcome: 'noMatch',
            bucket: '❌ Not a Match',
            reasons,
            score,
          });
          return;
        }
        updateNodeColor(NODE_IDS.EXP, true);
        score += 20;
        highlightEdge('e_exp_wr_yes', colors.paths.blue);
      }

      // Check 3: Work Rights (AI)
      const workRightsCheck = decisions.checkWorkRights;
      if (workRightsCheck) {
        reasons.push(['Work Rights', workRightsCheck.reasoning]);
        if (!workRightsCheck.hasWorkRights) {
          updateNodeColor(NODE_IDS.WR, false);
          highlightEdge('e_wr_reject_no', colors.outcomes.noMatch.border);
          setMatchResult({
            outcome: 'noMatch',
            bucket: '❌ Not a Match',
            reasons,
            score,
          });
          return;
        }
        updateNodeColor(NODE_IDS.WR, true);
        score += 8;
        highlightEdge('e_wr_loc_yes', colors.paths.blue);
      }

      // Check 4: Location (AI)
      const locationCheck = decisions.checkLocation;
      if (locationCheck) {
        reasons.push(['Location', locationCheck.reasoning]);

        if (!locationCheck.locationCompatible) {
          updateNodeColor(NODE_IDS.LOC, false);
          // Location failed → check timezone
          highlightEdge('e_loc_tz_no', colors.paths.orange);
          const timezoneCheck = decisions.checkTimezone;
          if (timezoneCheck) {
            reasons.push(['Timezone', timezoneCheck.reasoning]);
            if (!timezoneCheck.timezoneCompatible) {
              updateNodeColor(NODE_IDS.TZ, false);
              highlightEdge('e_tz_reject_no', colors.outcomes.noMatch.border);
              setMatchResult({
                outcome: 'noMatch',
                bucket: '❌ Not a Match',
                reasons,
                score,
              });
              return;
            }
            updateNodeColor(NODE_IDS.TZ, true);
            score += 6;
            highlightEdge('e_tz_avail_yes', colors.paths.blue);
          }
        } else {
          updateNodeColor(NODE_IDS.LOC, true);
          score += 8;
          highlightEdge('e_loc_avail_yes', colors.paths.blue);
        }
      }

      // Check 5: Availability (AI)
      const availCheck = decisions.checkAvailability;
      if (availCheck) {
        reasons.push(['Availability', availCheck.reasoning]);
        if (!availCheck.availableInTime) {
          updateNodeColor(NODE_IDS.AVAIL, false);
          highlightEdge(
            'e_avail_possible_no',
            colors.outcomes.possibleMatch.border
          );
          setMatchResult({
            outcome: 'possibleMatch',
            bucket: '🟡 Possible Match',
            reasons,
            score,
          });
          return;
        }
        updateNodeColor(NODE_IDS.AVAIL, true);
        score += 8;
        highlightEdge('e_avail_sal_yes', colors.paths.blue);
      }

      // Check 6: Salary (AI)
      const salaryCheck = decisions.checkSalary;
      if (salaryCheck) {
        reasons.push(['Salary', salaryCheck.reasoning]);
        if (!salaryCheck.salaryAligned) {
          updateNodeColor(NODE_IDS.SAL, false);
          highlightEdge(
            'e_sal_possible_no',
            colors.outcomes.possibleMatch.border
          );
          setMatchResult({
            outcome: 'possibleMatch',
            bucket: '🟡 Possible Match',
            reasons,
            score,
          });
          return;
        }
        updateNodeColor(NODE_IDS.SAL, true);
        score += 5;
        highlightEdge('e_sal_bonus_yes', colors.paths.blue);
      }

      // Check 7: Bonus Skills (AI)
      const bonusCheck = decisions.checkBonusSkills;
      if (bonusCheck) {
        reasons.push(['Bonus Skills', bonusCheck.reasoning]);
        if (!bonusCheck.hasBonusSkills) {
          updateNodeColor(NODE_IDS.BONUS, false);
          highlightEdge(
            'e_bonus_possible_no',
            colors.outcomes.possibleMatch.border
          );
          setMatchResult({
            outcome: 'possibleMatch',
            bucket: '🟡 Possible Match',
            reasons,
            score,
          });
          return;
        }
        updateNodeColor(NODE_IDS.BONUS, true);
        score += 5;
        highlightEdge('e_bonus_strong_yes', colors.outcomes.strongMatch.border);
      }

      // Strong Match!
      setMatchResult({
        outcome: 'strongMatch',
        bucket: '✅ Strong Match',
        reasons,
        score: Math.min(100, score),
      });
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
