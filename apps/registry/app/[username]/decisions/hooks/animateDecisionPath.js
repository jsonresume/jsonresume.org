/**
 * Decision-tree path animation + scoring.
 * Side effects (edge highlight, node color) are injected so the sequencing and
 * score accumulation can be exercised with spies in tests. Behavior is a
 * faithful extraction of the original useDecisionTree.animateAIPath.
 */

import {
  buildReasons,
  determineOutcome,
  bucketTextFor,
} from './decisionScoring';

/**
 * @param {object} decisions  AI decision object (checkRequiredSkills, …)
 * @param {object} deps
 * @param {(edgeId:string,color?:string)=>void} deps.highlightEdge
 * @param {(nodeId:string,passed:boolean)=>void} deps.updateNodeColor
 * @param {object} deps.NODE_IDS
 * @param {object} deps.colors
 * @returns {{ outcome:string, bucket:string, reasons:Array, score:number }}
 */
export function animateDecisionPath(
  decisions,
  { highlightEdge, updateNodeColor, NODE_IDS, colors }
) {
  let score = 0;
  const finalOutcome = determineOutcome(decisions);
  const reasons = buildReasons(decisions);

  const skillsCheck = decisions.checkRequiredSkills;
  const expCheck = decisions.checkExperience;
  const workRightsCheck = decisions.checkWorkRights;
  const locationCheck = decisions.checkLocation;
  const timezoneCheck = decisions.checkTimezone;
  const availCheck = decisions.checkAvailability;
  const salaryCheck = decisions.checkSalary;

  // COLOR ALL NODES based on their results
  if (skillsCheck) {
    const matchPct = skillsCheck.matchPercentage || 0;
    const skillsPassed = matchPct >= 0.8;
    updateNodeColor(NODE_IDS.CORE, skillsPassed);
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

  // Helper for the rest of the path after location/timezone.
  function animateRestOfPath() {
    if (availCheck) {
      if (!availCheck.availableInTime) {
        updateNodeColor(NODE_IDS.AVAIL, false);
        highlightEdge(
          'e_avail_possible_no',
          colors.outcomes.possibleMatch.border
        );
      } else {
        updateNodeColor(NODE_IDS.AVAIL, true);
        score += 8;
        highlightEdge('e_avail_sal_yes', colors.paths.blue);

        if (salaryCheck) {
          if (!salaryCheck.salaryAligned) {
            updateNodeColor(NODE_IDS.SAL, false);
            highlightEdge(
              'e_sal_possible_no',
              colors.outcomes.possibleMatch.border
            );
          } else {
            updateNodeColor(NODE_IDS.SAL, true);
            score += 5;
            highlightEdge(
              'e_sal_strong_yes',
              colors.outcomes.strongMatch.border
            );
          }
        }
      }
    }
  }

  // After core skills pass/partial, the experience → work rights → location/tz
  // sequence is identical; share it via this helper.
  function animateExpToLocation() {
    if (!expCheck) return;
    if (!expCheck.hasEnoughExperience) {
      updateNodeColor(NODE_IDS.EXP, false);
      highlightEdge('e_exp_reject_no', colors.outcomes.noMatch.border);
      return;
    }
    updateNodeColor(NODE_IDS.EXP, true);
    score += 20;
    highlightEdge('e_exp_wr_yes', colors.paths.blue);

    if (!workRightsCheck) return;
    if (!workRightsCheck.hasWorkRights) {
      updateNodeColor(NODE_IDS.WR, false);
      highlightEdge('e_wr_reject_no', colors.outcomes.noMatch.border);
      return;
    }
    updateNodeColor(NODE_IDS.WR, true);
    score += 8;
    highlightEdge('e_wr_loc_yes', colors.paths.blue);

    if (!locationCheck) return;
    if (!locationCheck.locationCompatible) {
      updateNodeColor(NODE_IDS.LOC, false);
      highlightEdge('e_loc_tz_no', colors.paths.orange);
      if (timezoneCheck) {
        if (!timezoneCheck.timezoneCompatible) {
          updateNodeColor(NODE_IDS.TZ, false);
          highlightEdge('e_tz_reject_no', colors.outcomes.noMatch.border);
        } else {
          updateNodeColor(NODE_IDS.TZ, true);
          score += 6;
          highlightEdge('e_tz_avail_yes', colors.paths.blue);
          animateRestOfPath();
        }
      }
    } else {
      updateNodeColor(NODE_IDS.LOC, true);
      score += 8;
      highlightEdge('e_loc_avail_yes', colors.paths.blue);
      animateRestOfPath();
    }
  }

  // Animate ONLY the actual path taken. Start: Root → Core Skills.
  highlightEdge('e_root_core');

  if (skillsCheck) {
    const skillMatchPct = skillsCheck.matchPercentage || 0;

    if (skillMatchPct < 0.5) {
      // FAILED (<50% match) — end path with rejection.
      updateNodeColor(NODE_IDS.CORE, false);
      highlightEdge('e_core_reject_no', colors.outcomes.noMatch.border);
      score = 0;
    } else if (skillMatchPct >= 0.5 && skillMatchPct < 0.8) {
      // PARTIAL (50-80%) — continue with orange warning.
      updateNodeColor(NODE_IDS.CORE, false);
      score += Math.round(skillMatchPct * 40);
      highlightEdge('e_core_exp_yes', colors.paths.orange);
      animateExpToLocation();
    } else {
      // PASSED (>=80%) — continue with green.
      updateNodeColor(NODE_IDS.CORE, true);
      score += Math.round(skillMatchPct * 40);
      highlightEdge('e_core_exp_yes', colors.paths.blue);
      animateExpToLocation();
    }
  }

  return {
    outcome: finalOutcome,
    bucket: bucketTextFor(finalOutcome),
    reasons,
    score: Math.min(100, score),
  };
}
