/**
 * Pure scoring/outcome helpers for the decision tree.
 * Extracted from useDecisionTree so the AI-decision → reasons/outcome mapping
 * can be unit-tested independently of React Flow state.
 */

// Human-readable reason rows shown in the match summary, in check order.
export function buildReasons(decisions) {
  const reasons = [];
  const { checkRequiredSkills, checkExperience, checkWorkRights } = decisions;
  const { checkLocation, checkTimezone, checkAvailability, checkSalary } =
    decisions;

  if (checkRequiredSkills)
    reasons.push(['Required Skills', checkRequiredSkills.reasoning]);
  if (checkExperience) reasons.push(['Experience', checkExperience.reasoning]);
  if (checkWorkRights) reasons.push(['Work Rights', checkWorkRights.reasoning]);
  if (checkLocation) reasons.push(['Location', checkLocation.reasoning]);
  if (checkTimezone) reasons.push(['Timezone', checkTimezone.reasoning]);
  if (checkAvailability)
    reasons.push(['Availability', checkAvailability.reasoning]);
  if (checkSalary) reasons.push(['Salary', checkSalary.reasoning]);
  return reasons;
}

// Final outcome bucket from the AI decisions, mirroring the original priority.
export function determineOutcome(decisions) {
  const skillsCheck = decisions.checkRequiredSkills;
  const expCheck = decisions.checkExperience;
  const workRightsCheck = decisions.checkWorkRights;
  const locationCheck = decisions.checkLocation;
  const timezoneCheck = decisions.checkTimezone;
  const availCheck = decisions.checkAvailability;
  const salaryCheck = decisions.checkSalary;

  const matchPct = skillsCheck?.matchPercentage || 0;

  if (skillsCheck && matchPct < 0.5) return 'noMatch';
  if (skillsCheck && matchPct >= 0.5 && matchPct < 0.8) return 'possibleMatch';
  if (expCheck && !expCheck.hasEnoughExperience) return 'noMatch';
  if (workRightsCheck && !workRightsCheck.hasWorkRights) return 'noMatch';
  if (
    locationCheck &&
    !locationCheck.locationCompatible &&
    timezoneCheck &&
    !timezoneCheck.timezoneCompatible
  )
    return 'noMatch';
  if (availCheck && !availCheck.availableInTime) return 'possibleMatch';
  if (salaryCheck && !salaryCheck.salaryAligned) return 'possibleMatch';
  return 'strongMatch';
}

// Match-summary label for an outcome bucket.
export function bucketTextFor(outcome) {
  if (outcome === 'strongMatch') return '✅ Strong Match';
  if (outcome === 'possibleMatch') return '🟡 Possible Match';
  return '❌ Not a Match';
}
