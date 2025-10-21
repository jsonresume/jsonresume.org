/**
 * useDecisionTree Hook
 * Manages decision tree state, animation, and evaluation logic
 */

import { useState, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { initialNodes, initialEdges } from '../config/decisionTree';
import { checks } from '../config/matchingCriteria';
import { colors } from '../config/designSystem';

export function useDecisionTree(resume) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [matchResult, setMatchResult] = useState(null);

  // Reset all edges to default gray
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
    setMatchResult(null);
  }, [setEdges]);

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

  // Evaluate a candidate-job match and animate the path
  const evaluateJob = useCallback(
    (candidate, job) => {
      if (!candidate || !job) return;

      resetHighlights();
      const reasons = [];

      // Start: Root → Core Skills
      highlightEdge('e_root_core');

      // Check 1: Core Skills
      const r1 = checks.coreSkills(candidate, job);
      reasons.push(['Required Skills', r1.reason]);

      if (!r1.pass) {
        highlightEdge('e_core_reject_no', colors.outcomes.noMatch.border);
        setMatchResult({
          outcome: 'noMatch',
          bucket: '❌ Not a Match',
          reasons,
          score: 0,
        });
        return;
      }
      highlightEdge('e_core_exp_yes', colors.paths.blue);

      // Check 2: Experience
      const r2 = checks.experience(candidate, job);
      reasons.push(['Experience', r2.reason]);

      if (!r2.pass) {
        highlightEdge('e_exp_reject_no', colors.outcomes.noMatch.border);
        setMatchResult({
          outcome: 'noMatch',
          bucket: '❌ Not a Match',
          reasons,
          score: r1.score || 0,
        });
        return;
      }
      highlightEdge('e_exp_wr_yes', colors.paths.blue);

      // Check 3: Work Rights
      const r5 = checks.workRights(candidate, job);
      reasons.push(['Work Rights', r5.reason]);

      if (!r5.pass) {
        highlightEdge('e_wr_reject_no', colors.outcomes.noMatch.border);
        setMatchResult({
          outcome: 'noMatch',
          bucket: '❌ Not a Match',
          reasons,
          score: (r1.score || 0) + (r2.score || 0),
        });
        return;
      }
      highlightEdge('e_wr_loc_yes', colors.paths.blue);

      // Check 4: Location
      const r3 = checks.location(candidate, job);
      reasons.push(['Location', r3.reason]);

      if (!r3.pass) {
        // Location failed → check timezone
        highlightEdge('e_loc_tz_no', colors.paths.orange);
        const r4 = checks.timezone(candidate, job);
        reasons.push(['Timezone', r4.reason]);

        if (!r4.pass) {
          highlightEdge('e_tz_reject_no', colors.outcomes.noMatch.border);
          setMatchResult({
            outcome: 'noMatch',
            bucket: '❌ Not a Match',
            reasons,
            score: (r1.score || 0) + (r2.score || 0) + (r5.score || 0),
          });
          return;
        }
        highlightEdge('e_tz_avail_yes', colors.paths.blue);
      } else {
        highlightEdge('e_loc_avail_yes', colors.paths.blue);
      }

      // Check 5: Availability
      const r6 = checks.availability(candidate, job);
      reasons.push(['Availability', r6.reason]);

      if (!r6.pass) {
        highlightEdge(
          'e_avail_possible_no',
          colors.outcomes.possibleMatch.border
        );
        setMatchResult({
          outcome: 'possibleMatch',
          bucket: '🟡 Possible Match',
          reasons,
          score:
            (r1.score || 0) +
            (r2.score || 0) +
            (r3.score || 0) +
            (r5.score || 0),
        });
        return;
      }
      highlightEdge('e_avail_sal_yes', colors.paths.blue);

      // Check 6: Salary
      const r7 = checks.salary(candidate, job);
      reasons.push(['Salary', r7.reason]);

      if (!r7.pass) {
        highlightEdge(
          'e_sal_possible_no',
          colors.outcomes.possibleMatch.border
        );
        setMatchResult({
          outcome: 'possibleMatch',
          bucket: '🟡 Possible Match',
          reasons,
          score:
            (r1.score || 0) +
            (r2.score || 0) +
            (r3.score || 0) +
            (r5.score || 0) +
            (r6.score || 0),
        });
        return;
      }
      highlightEdge('e_sal_bonus_yes', colors.paths.blue);

      // Check 7: Bonus Skills
      const r8 = checks.bonusSkills(candidate, job);
      reasons.push(['Bonus Skills', r8.reason]);

      if (!r8.pass) {
        highlightEdge(
          'e_bonus_possible_no',
          colors.outcomes.possibleMatch.border
        );
        setMatchResult({
          outcome: 'possibleMatch',
          bucket: '🟡 Possible Match',
          reasons,
          score:
            (r1.score || 0) +
            (r2.score || 0) +
            (r3.score || 0) +
            (r5.score || 0) +
            (r6.score || 0) +
            (r7.score || 0),
        });
        return;
      }
      highlightEdge('e_bonus_strong_yes', colors.outcomes.strongMatch.border);

      // Strong Match!
      setMatchResult({
        outcome: 'strongMatch',
        bucket: '✅ Strong Match',
        reasons,
        score:
          (r1.score || 0) +
          (r2.score || 0) +
          (r3.score || 0) +
          (r5.score || 0) +
          (r6.score || 0) +
          (r7.score || 0) +
          (r8.score || 0),
      });
    },
    [resetHighlights, highlightEdge]
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
