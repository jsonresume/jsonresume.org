/**
 * Pure prompt-construction helpers for the decisions/evaluate route.
 * Kept separate from the handler so they're unit-testable without the AI SDK.
 */

/**
 * Build the normalized job context object (gpt_content overrides, defaults).
 * @param {Object} job - Raw job row (may include gpt_content JSON string)
 * @param {Object} gptJob - Parsed gpt_content ({} if absent/invalid)
 */
export const buildJobContext = (job, gptJob) => ({
  title: gptJob.title || job.title,
  company: gptJob.company || job.company,
  location: gptJob.location || job.location,
  remote: gptJob.remote,
  description: job.description,
  skills: gptJob.skills || [],
  bonusSkills: gptJob.bonusSkills || [],
  minYearsExperience: gptJob.minYearsExperience || 0,
  salary: gptJob.salary || { min: 0, max: 999999 },
  startWithinWeeks: gptJob.startWithinWeeks || 12,
  workRightsRequired: gptJob.workRightsRequired !== false,
  timezone: gptJob.timezone,
});

/**
 * Render user preference criteria into a human-readable bullet list.
 * @param {Object} preferences - Map of criterion -> { enabled, value }
 * @returns {string} Multiline string (empty if no preferences)
 */
export const buildPreferencesInfo = (preferences) =>
  Object.entries(preferences)
    .map(([key, pref]) => {
      if (pref.enabled === false) {
        return `- ${key}: DISABLED (user doesn't care about this criterion)`;
      }
      if (pref.value && Object.keys(pref.value).length > 0) {
        return `- ${key}: ENABLED with custom values: ${JSON.stringify(
          pref.value
        )}`;
      }
      return `- ${key}: ENABLED (use standard evaluation)`;
    })
    .join('\n');

/**
 * Per-criterion inline hint appended to the numbered tool list. Returns the
 * parenthetical text when the criterion is disabled, otherwise ''. The single
 * separating space lives in the template literal (matching the original),
 * so an enabled criterion still renders a trailing space before the newline.
 */
const disabledHint = (pref, text) => (pref?.enabled === false ? text : '');

export const salaryHint = (salaryPref) => {
  if (salaryPref?.enabled === false) return '(User disabled - be lenient)';
  // Use != null so a legitimate min of 0 still produces a hint (0 is falsy).
  if (salaryPref?.value?.min != null) {
    return `(User expects ${salaryPref.value.min}-${salaryPref.value.max})`;
  }
  return '';
};

/**
 * Assemble the full evaluation prompt sent to the model.
 * @param {Object} params
 * @param {string} params.resumeContext - JSON-stringified resume
 * @param {string} params.jobContext - JSON-stringified job context
 * @param {string} params.preferencesInfo - Rendered preferences bullet list
 * @param {Object} params.preferences - Raw preferences map (for inline hints)
 */
export const buildEvaluationPrompt = ({
  resumeContext,
  jobContext,
  preferencesInfo,
  preferences,
}) => `You are an expert technical recruiter evaluating a candidate-job match.

CANDIDATE RESUME:
${resumeContext}

JOB POSTING:
${jobContext}

USER EVALUATION PREFERENCES:
The user has specified the following preferences for evaluation criteria:
${
  preferencesInfo ||
  'No custom preferences set - use standard evaluation for all criteria'
}

IMPORTANT INSTRUCTIONS:
- You MUST evaluate ALL criteria by calling every tool, regardless of whether earlier checks passed or failed
- For criteria marked as DISABLED, still call the tool but be lenient in your evaluation
- For criteria with custom values (e.g., salary ranges), use those values instead of the job's requirements
- Provide comprehensive feedback on all dimensions to give the candidate a complete picture
- CRITICAL: When checking for skills, search the ENTIRE resume including work.highlights, work.summary, projects, education, not just the skills array. Skills can be mentioned anywhere in the resume.

Call ALL of these tools in order:
1. checkRequiredSkills - Calculate skill match percentage (0.0-1.0). Search the ENTIRE resume (skills, work experience, projects, highlights) for evidence of each required skill. >=0.8 excellent, >=0.5 acceptable, <0.5 insufficient. ${disabledHint(
  preferences.skills,
  '(User disabled - be very lenient)'
)}
2. checkExperience - Does candidate have enough years of experience? ${disabledHint(
  preferences.experience,
  '(User disabled - be lenient)'
)}
3. checkWorkRights - Does candidate have work authorization if required?
4. checkLocation - Is location compatible (considering remote options)? ${disabledHint(
  preferences.location,
  '(User disabled - be lenient)'
)}
5. checkTimezone - Is timezone compatible for remote work? ${disabledHint(
  preferences.timezone,
  '(User disabled - be lenient)'
)}
6. checkAvailability - Can candidate start within required timeframe?
7. checkSalary - Are salary expectations aligned? ${salaryHint(
  preferences.salary
)}

Be thorough, honest, and realistic in your evaluation. Even if the candidate fails one check, continue evaluating all remaining criteria.`;
