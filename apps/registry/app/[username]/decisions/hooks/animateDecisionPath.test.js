import { describe, it, expect, vi } from 'vitest';
import { animateDecisionPath } from './animateDecisionPath';

// Minimal stand-ins for the real config so the test is self-contained.
const NODE_IDS = {
  CORE: 'core',
  EXP: 'exp',
  WR: 'wr',
  LOC: 'loc',
  TZ: 'tz',
  AVAIL: 'avail',
  SAL: 'sal',
};
const colors = {
  paths: { blue: 'BLUE', orange: 'ORANGE', gray: 'GRAY' },
  outcomes: {
    strongMatch: { border: 'GREEN' },
    possibleMatch: { border: 'YELLOW' },
    noMatch: { border: 'RED' },
  },
};

/**
 * Oracle: a faithful, verbatim copy of the ORIGINAL useDecisionTree.animateAIPath
 * body (the un-deduplicated form) recording the same side effects. The refactor
 * must produce identical call sequences and result for every scenario.
 */
function oracle(decisions, { highlightEdge, updateNodeColor }) {
  const reasons = [];
  let score = 0;
  let finalOutcome = 'strongMatch';

  const skillsCheck = decisions.checkRequiredSkills;
  const expCheck = decisions.checkExperience;
  const workRightsCheck = decisions.checkWorkRights;
  const locationCheck = decisions.checkLocation;
  const timezoneCheck = decisions.checkTimezone;
  const availCheck = decisions.checkAvailability;
  const salaryCheck = decisions.checkSalary;

  if (skillsCheck) reasons.push(['Required Skills', skillsCheck.reasoning]);
  if (expCheck) reasons.push(['Experience', expCheck.reasoning]);
  if (workRightsCheck) reasons.push(['Work Rights', workRightsCheck.reasoning]);
  if (locationCheck) reasons.push(['Location', locationCheck.reasoning]);
  if (timezoneCheck) reasons.push(['Timezone', timezoneCheck.reasoning]);
  if (availCheck) reasons.push(['Availability', availCheck.reasoning]);
  if (salaryCheck) reasons.push(['Salary', salaryCheck.reasoning]);

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

  const matchPct = skillsCheck?.matchPercentage || 0;
  if (skillsCheck && matchPct < 0.5) finalOutcome = 'noMatch';
  else if (skillsCheck && matchPct >= 0.5 && matchPct < 0.8)
    finalOutcome = 'possibleMatch';
  else if (expCheck && !expCheck.hasEnoughExperience) finalOutcome = 'noMatch';
  else if (workRightsCheck && !workRightsCheck.hasWorkRights)
    finalOutcome = 'noMatch';
  else if (
    locationCheck &&
    !locationCheck.locationCompatible &&
    timezoneCheck &&
    !timezoneCheck.timezoneCompatible
  )
    finalOutcome = 'noMatch';
  else if (availCheck && !availCheck.availableInTime)
    finalOutcome = 'possibleMatch';
  else if (salaryCheck && !salaryCheck.salaryAligned)
    finalOutcome = 'possibleMatch';

  highlightEdge('e_root_core');

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

  function expBranch() {
    if (expCheck) {
      if (!expCheck.hasEnoughExperience) {
        updateNodeColor(NODE_IDS.EXP, false);
        highlightEdge('e_exp_reject_no', colors.outcomes.noMatch.border);
      } else {
        updateNodeColor(NODE_IDS.EXP, true);
        score += 20;
        highlightEdge('e_exp_wr_yes', colors.paths.blue);
        if (workRightsCheck) {
          if (!workRightsCheck.hasWorkRights) {
            updateNodeColor(NODE_IDS.WR, false);
            highlightEdge('e_wr_reject_no', colors.outcomes.noMatch.border);
          } else {
            updateNodeColor(NODE_IDS.WR, true);
            score += 8;
            highlightEdge('e_wr_loc_yes', colors.paths.blue);
            if (locationCheck) {
              if (!locationCheck.locationCompatible) {
                updateNodeColor(NODE_IDS.LOC, false);
                highlightEdge('e_loc_tz_no', colors.paths.orange);
                if (timezoneCheck) {
                  if (!timezoneCheck.timezoneCompatible) {
                    updateNodeColor(NODE_IDS.TZ, false);
                    highlightEdge(
                      'e_tz_reject_no',
                      colors.outcomes.noMatch.border
                    );
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
          }
        }
      }
    }
  }

  if (skillsCheck) {
    const skillMatchPct = skillsCheck.matchPercentage || 0;
    if (skillMatchPct < 0.5) {
      updateNodeColor(NODE_IDS.CORE, false);
      highlightEdge('e_core_reject_no', colors.outcomes.noMatch.border);
      score = 0;
    } else if (skillMatchPct >= 0.5 && skillMatchPct < 0.8) {
      updateNodeColor(NODE_IDS.CORE, false);
      score += Math.round(skillMatchPct * 40);
      highlightEdge('e_core_exp_yes', colors.paths.orange);
      expBranch();
    } else {
      updateNodeColor(NODE_IDS.CORE, true);
      score += Math.round(skillMatchPct * 40);
      highlightEdge('e_core_exp_yes', colors.paths.blue);
      expBranch();
    }
  }

  const bucketText =
    finalOutcome === 'strongMatch'
      ? '✅ Strong Match'
      : finalOutcome === 'possibleMatch'
      ? '🟡 Possible Match'
      : '❌ Not a Match';

  return {
    outcome: finalOutcome,
    bucket: bucketText,
    reasons,
    score: Math.min(100, score),
  };
}

function recorder() {
  const calls = [];
  return {
    calls,
    highlightEdge: vi.fn((...a) => calls.push(['edge', ...a])),
    updateNodeColor: vi.fn((...a) => calls.push(['node', ...a])),
  };
}

const full = (extra = {}) => ({
  checkRequiredSkills: { reasoning: 's', matchPercentage: 0.9 },
  checkExperience: { reasoning: 'e', hasEnoughExperience: true },
  checkWorkRights: { reasoning: 'w', hasWorkRights: true },
  checkLocation: { reasoning: 'l', locationCompatible: true },
  checkTimezone: { reasoning: 't', timezoneCompatible: true },
  checkAvailability: { reasoning: 'a', availableInTime: true },
  checkSalary: { reasoning: 'sa', salaryAligned: true },
  ...extra,
});

const scenarios = {
  'strong match (all pass)': full(),
  'skills hard fail <50%': full({
    checkRequiredSkills: { reasoning: 's', matchPercentage: 0.3 },
  }),
  'skills partial 50-80%': full({
    checkRequiredSkills: { reasoning: 's', matchPercentage: 0.65 },
  }),
  'experience fail': full({
    checkExperience: { reasoning: 'e', hasEnoughExperience: false },
  }),
  'work rights fail': full({
    checkWorkRights: { reasoning: 'w', hasWorkRights: false },
  }),
  'location fail, timezone pass': full({
    checkLocation: { reasoning: 'l', locationCompatible: false },
  }),
  'location + timezone fail': full({
    checkLocation: { reasoning: 'l', locationCompatible: false },
    checkTimezone: { reasoning: 't', timezoneCompatible: false },
  }),
  'availability fail': full({
    checkAvailability: { reasoning: 'a', availableInTime: false },
  }),
  'salary fail': full({
    checkSalary: { reasoning: 'sa', salaryAligned: false },
  }),
  'partial skills + location fail tz pass': full({
    checkRequiredSkills: { reasoning: 's', matchPercentage: 0.7 },
    checkLocation: { reasoning: 'l', locationCompatible: false },
  }),
  'only skills present': {
    checkRequiredSkills: { reasoning: 's', matchPercentage: 0.85 },
  },
  empty: {},
};

describe('animateDecisionPath matches the original oracle', () => {
  for (const [name, decisions] of Object.entries(scenarios)) {
    it(`scenario: ${name}`, () => {
      const a = recorder();
      const got = animateDecisionPath(decisions, {
        highlightEdge: a.highlightEdge,
        updateNodeColor: a.updateNodeColor,
        NODE_IDS,
        colors,
      });

      const b = recorder();
      const want = oracle(decisions, {
        highlightEdge: b.highlightEdge,
        updateNodeColor: b.updateNodeColor,
      });

      expect(got).toEqual(want);
      expect(a.calls).toEqual(b.calls);
    });
  }
});
