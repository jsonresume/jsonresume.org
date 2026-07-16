/**
 * Pure transforms over the job-states map.
 *
 * These have no React/localStorage/network dependencies so they're trivially
 * testable and shared by the hook's memoized derivations.
 */

/**
 * Apply a single job state change to a states map, returning a new map.
 * A `null` state deletes the entry. Job ids are coerced to strings.
 * @param {Object} states - Current states map
 * @param {string|number} jobId - Job ID
 * @param {string|null} state - New state, or null to clear
 * @returns {Object} New states map
 */
export const applyStateChange = (states, jobId, state) => {
  const jobIdStr = String(jobId);
  const next = { ...states };
  if (state === null) {
    delete next[jobIdStr];
  } else {
    next[jobIdStr] = state;
  }
  return next;
};

/**
 * Apply a batch of job state changes to a states map, returning a new map.
 * @param {Object} states - Current states map
 * @param {Array<{jobId: string|number, state: string|null}>} updates
 * @returns {Object} New states map
 */
export const applyStateChanges = (states, updates) => {
  const next = { ...states };
  updates.forEach(({ jobId, state }) => {
    const jobIdStr = String(jobId);
    if (state === null) {
      delete next[jobIdStr];
    } else {
      next[jobIdStr] = state;
    }
  });
  return next;
};

/**
 * Build the Set of job ids currently in a given state.
 * @param {Object} states - Current states map
 * @param {string} target - State to filter for (e.g. 'read')
 * @returns {Set<string>}
 */
export const jobIdsInState = (states, target) =>
  new Set(
    Object.entries(states)
      .filter(([, state]) => state === target)
      .map(([jobId]) => jobId)
  );
