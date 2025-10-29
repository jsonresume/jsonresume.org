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
  recalculateLayout,
  createBridgeEdges,
} from '../config/decisionTree';
import { colors } from '../config/designSystem';

// Map node IDs to preference keys (constant outside component)
const nodeToPreferenceMap = {
  [NODE_IDS.CORE]: 'skills',
  [NODE_IDS.EXP]: 'experience',
  [NODE_IDS.LOC]: 'location',
  [NODE_IDS.TZ]: 'timezone',
  [NODE_IDS.SAL]: 'salary',
  // WR (work rights) and AVAIL (availability) always enabled
};

export function useDecisionTree(resume, preferences = {}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [matchResult, setMatchResult] = useState(null);

  // Update node visibility and layout based on preferences
  useEffect(() => {
    // Step 1: Mark nodes as hidden based on preferences
    const nodesWithVisibility = initialNodes.map((node) => {
      const prefKey = nodeToPreferenceMap[node.id];

      // If this node has a preference mapping, check if it's enabled
      if (prefKey) {
        const isEnabled = preferences[prefKey]?.enabled !== false;
        return {
          ...node,
          hidden: !isEnabled,
        };
      }

      // Always show root, outcome nodes, and nodes without preference mapping
      return { ...node, hidden: false };
    });

    // Step 2: Recalculate layout for visible nodes
    const layoutedNodes = recalculateLayout(nodesWithVisibility, initialEdges);

    // Step 3: Add smooth transition styles
    const nodesWithTransitions = layoutedNodes.map((node) => ({
      ...node,
      style: {
        ...node.style,
        transition: 'all 0.3s ease-in-out',
      },
    }));

    // Update nodes
    setNodes(nodesWithTransitions);

    // Step 4: Create bridge edges that skip hidden nodes
    const bridgedEdges = createBridgeEdges(
      nodesWithVisibility,
      initialEdges,
      nodeToPreferenceMap
    );

    // Add smooth transitions to edges
    const edgesWithTransitions = bridgedEdges.map((edge) => ({
      ...edge,
      style: {
        ...edge.style,
        transition: 'all 0.3s ease-in-out',
      },
    }));

    // Update edges
    setEdges(edgesWithTransitions);
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

      console.log('=== CLIENT: Starting AI Evaluation ===');
      console.log('Candidate:', candidate.basics?.name);
      console.log('Job:', job.title, job.company);
      console.log('Preferences:', preferences);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resetHighlights, preferences]
  );

  // Animate decision tree path based on AI results
  const animateAIPath = useCallback(
    (decisions) => {
      const reasons = [];
      let score = 0;
      let finalOutcome = 'strongMatch'; // Assume best case, downgrade as needed
      // eslint-disable-next-line no-unused-vars
      let failedAtNode = null; // Track where the critical failure happened

      // Collect all evaluation results first
      const skillsCheck = decisions.checkRequiredSkills;
      const expCheck = decisions.checkExperience;
      const workRightsCheck = decisions.checkWorkRights;
      const locationCheck = decisions.checkLocation;
      const timezoneCheck = decisions.checkTimezone;
      const availCheck = decisions.checkAvailability;
      const salaryCheck = decisions.checkSalary;

      // Build reasons array
      if (skillsCheck) reasons.push(['Required Skills', skillsCheck.reasoning]);
      if (expCheck) reasons.push(['Experience', expCheck.reasoning]);
      if (workRightsCheck)
        reasons.push(['Work Rights', workRightsCheck.reasoning]);
      if (locationCheck) reasons.push(['Location', locationCheck.reasoning]);
      if (timezoneCheck) reasons.push(['Timezone', timezoneCheck.reasoning]);
      if (availCheck) reasons.push(['Availability', availCheck.reasoning]);
      if (salaryCheck) reasons.push(['Salary', salaryCheck.reasoning]);

      // COLOR ALL NODES based on their results
      if (skillsCheck) {
        // Percentage-based: >=0.8 pass, 0.5-0.8 partial, <0.5 fail
        const matchPct = skillsCheck.matchPercentage || 0;
        const skillsPassed = matchPct >= 0.8;
        updateNodeColor(NODE_IDS.CORE, skillsPassed);
        // Score scales with match percentage (max 40 points)
        score += Math.round(matchPct * 40);
      }
      if (expCheck) {
        updateNodeColor(NODE_IDS.EXP, expCheck.hasEnoughExperience);
        if (expCheck.hasEnoughExperience) score += 20;
      }
      if (workRightsCheck) {
        updateNodeColor(NODE_IDS.WR, workRightsCheck.hasWorkRights);
        if (workRightsCheck.hasWorkRights) score += 8;
      }
      if (locationCheck) {
        updateNodeColor(NODE_IDS.LOC, locationCheck.locationCompatible);
        if (locationCheck.locationCompatible) score += 8;
      }
      if (timezoneCheck) {
        updateNodeColor(NODE_IDS.TZ, timezoneCheck.timezoneCompatible);
        if (timezoneCheck.timezoneCompatible) score += 6;
      }
      if (availCheck) {
        updateNodeColor(NODE_IDS.AVAIL, availCheck.availableInTime);
        if (availCheck.availableInTime) score += 8;
      }
      if (salaryCheck) {
        updateNodeColor(NODE_IDS.SAL, salaryCheck.salaryAligned);
        if (salaryCheck.salaryAligned) score += 5;
      }

      // Determine outcome and where we fail on the path
      const matchPct = skillsCheck?.matchPercentage || 0;
      if (skillsCheck && matchPct < 0.5) {
        // Less than 50% skill match = instant reject
        finalOutcome = 'noMatch';
        failedAtNode = NODE_IDS.CORE;
      } else if (skillsCheck && matchPct >= 0.5 && matchPct < 0.8) {
        // 50-80% skill match = downgrade to possible match later
        finalOutcome = 'possibleMatch';
      } else if (expCheck && !expCheck.hasEnoughExperience) {
        finalOutcome = 'noMatch';
        failedAtNode = NODE_IDS.EXP;
      } else if (workRightsCheck && !workRightsCheck.hasWorkRights) {
        finalOutcome = 'noMatch';
        failedAtNode = NODE_IDS.WR;
      } else if (
        locationCheck &&
        !locationCheck.locationCompatible &&
        timezoneCheck &&
        !timezoneCheck.timezoneCompatible
      ) {
        finalOutcome = 'noMatch';
        failedAtNode = NODE_IDS.TZ; // eslint-disable-line no-unused-vars
      } else if (availCheck && !availCheck.availableInTime) {
        finalOutcome = 'possibleMatch';
        // failedAtNode = NODE_IDS.AVAIL;
      } else if (salaryCheck && !salaryCheck.salaryAligned) {
        finalOutcome = 'possibleMatch';
        // failedAtNode = NODE_IDS.SAL;
      }

      // Now animate ONLY the actual path taken
      // Start: Root → Core Skills
      highlightEdge('e_root_core');

      // Check 1: Required Skills (percentage-based)
      if (skillsCheck) {
        const skillMatchPct = skillsCheck.matchPercentage || 0;

        if (skillMatchPct < 0.5) {
          // FAILED (<50% match) - end path here with rejection
          updateNodeColor(NODE_IDS.CORE, false);
          highlightEdge('e_core_reject_no', colors.outcomes.noMatch.border);
          score = 0;
        } else if (skillMatchPct >= 0.5 && skillMatchPct < 0.8) {
          // PARTIAL (50-80% match) - continue with orange warning
          updateNodeColor(NODE_IDS.CORE, false); // Show orange (warn state)
          score += Math.round(skillMatchPct * 40);
          highlightEdge('e_core_exp_yes', colors.paths.orange); // Orange path

          // Continue evaluation for partial match (same logic as full pass)
          // Check 2: Experience
          if (expCheck) {
            if (!expCheck.hasEnoughExperience) {
              // FAILED - end path here
              updateNodeColor(NODE_IDS.EXP, false);
              highlightEdge('e_exp_reject_no', colors.outcomes.noMatch.border);
            } else {
              // PASSED - continue
              updateNodeColor(NODE_IDS.EXP, true);
              score += 20;
              highlightEdge('e_exp_wr_yes', colors.paths.blue);

              // Check 3: Work Rights
              if (workRightsCheck) {
                if (!workRightsCheck.hasWorkRights) {
                  // FAILED - end path here
                  updateNodeColor(NODE_IDS.WR, false);
                  highlightEdge(
                    'e_wr_reject_no',
                    colors.outcomes.noMatch.border
                  );
                } else {
                  // PASSED - continue
                  updateNodeColor(NODE_IDS.WR, true);
                  score += 8;
                  highlightEdge('e_wr_loc_yes', colors.paths.blue);

                  // Check 4: Location
                  if (locationCheck) {
                    if (!locationCheck.locationCompatible) {
                      // Location FAILED - check timezone
                      updateNodeColor(NODE_IDS.LOC, false);
                      highlightEdge('e_loc_tz_no', colors.paths.orange);

                      if (timezoneCheck) {
                        if (!timezoneCheck.timezoneCompatible) {
                          // Timezone FAILED - end path here
                          updateNodeColor(NODE_IDS.TZ, false);
                          highlightEdge(
                            'e_tz_reject_no',
                            colors.outcomes.noMatch.border
                          );
                        } else {
                          // Timezone PASSED - continue to availability
                          updateNodeColor(NODE_IDS.TZ, true);
                          score += 6;
                          highlightEdge('e_tz_avail_yes', colors.paths.blue);
                          animateRestOfPath();
                        }
                      }
                    } else {
                      // Location PASSED - skip timezone, go to availability
                      updateNodeColor(NODE_IDS.LOC, true);
                      score += 8;
                      highlightEdge('e_loc_avail_yes', colors.paths.blue);
                      animateRestOfPath();
                    }
                  }
                }
              }
            }
          }
        } else {
          // PASSED (>=80% match) - continue with green
          updateNodeColor(NODE_IDS.CORE, true);
          score += Math.round(skillMatchPct * 40);
          highlightEdge('e_core_exp_yes', colors.paths.blue);

          // Check 2: Experience
          if (expCheck) {
            if (!expCheck.hasEnoughExperience) {
              // FAILED - end path here
              updateNodeColor(NODE_IDS.EXP, false);
              highlightEdge('e_exp_reject_no', colors.outcomes.noMatch.border);
            } else {
              // PASSED - continue
              updateNodeColor(NODE_IDS.EXP, true);
              score += 20;
              highlightEdge('e_exp_wr_yes', colors.paths.blue);

              // Check 3: Work Rights
              if (workRightsCheck) {
                if (!workRightsCheck.hasWorkRights) {
                  // FAILED - end path here
                  updateNodeColor(NODE_IDS.WR, false);
                  highlightEdge(
                    'e_wr_reject_no',
                    colors.outcomes.noMatch.border
                  );
                } else {
                  // PASSED - continue
                  updateNodeColor(NODE_IDS.WR, true);
                  score += 8;
                  highlightEdge('e_wr_loc_yes', colors.paths.blue);

                  // Check 4: Location
                  if (locationCheck) {
                    if (!locationCheck.locationCompatible) {
                      // Location FAILED - check timezone
                      updateNodeColor(NODE_IDS.LOC, false);
                      highlightEdge('e_loc_tz_no', colors.paths.orange);

                      if (timezoneCheck) {
                        if (!timezoneCheck.timezoneCompatible) {
                          // Timezone FAILED - end path here
                          updateNodeColor(NODE_IDS.TZ, false);
                          highlightEdge(
                            'e_tz_reject_no',
                            colors.outcomes.noMatch.border
                          );
                        } else {
                          // Timezone PASSED - continue to availability
                          updateNodeColor(NODE_IDS.TZ, true);
                          score += 6;
                          highlightEdge('e_tz_avail_yes', colors.paths.blue);
                          animateRestOfPath();
                        }
                      }
                    } else {
                      // Location PASSED - skip timezone, go to availability
                      updateNodeColor(NODE_IDS.LOC, true);
                      score += 8;
                      highlightEdge('e_loc_avail_yes', colors.paths.blue);
                      animateRestOfPath();
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Helper function for the rest of the path after location/timezone
      function animateRestOfPath() {
        // Check 5: Availability
        if (availCheck) {
          if (!availCheck.availableInTime) {
            // FAILED - end as possible match
            updateNodeColor(NODE_IDS.AVAIL, false);
            highlightEdge(
              'e_avail_possible_no',
              colors.outcomes.possibleMatch.border
            );
          } else {
            // PASSED - continue
            updateNodeColor(NODE_IDS.AVAIL, true);
            score += 8;
            highlightEdge('e_avail_sal_yes', colors.paths.blue);

            // Check 6: Salary
            if (salaryCheck) {
              if (!salaryCheck.salaryAligned) {
                // FAILED - end as possible match
                updateNodeColor(NODE_IDS.SAL, false);
                highlightEdge(
                  'e_sal_possible_no',
                  colors.outcomes.possibleMatch.border
                );
              } else {
                // PASSED - continue
                updateNodeColor(NODE_IDS.SAL, true);
                score += 5;
                // PASSED salary - strong match!
                highlightEdge(
                  'e_sal_strong_yes',
                  colors.outcomes.strongMatch.border
                );
              }
            }
          }
        }
      }

      // Determine final result
      const bucketText =
        finalOutcome === 'strongMatch'
          ? '✅ Strong Match'
          : finalOutcome === 'possibleMatch'
          ? '🟡 Possible Match'
          : '❌ Not a Match';

      setMatchResult({
        outcome: finalOutcome,
        bucket: bucketText,
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
