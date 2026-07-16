/**
 * Server sync for job states.
 *
 * Authenticated users have their read/interested/hidden states persisted to
 * Supabase via the `/api/job-states*` routes. These helpers own the fetch
 * calls so the hook stays focused on state wiring.
 */

/**
 * Fetch a user's job states from the server.
 * @param {string} userId - User ID UUID
 * @returns {Promise<Object>} Job states map { jobId: state }
 * @throws {Error} If the request fails
 */
export const fetchJobStates = async (userId) => {
  const response = await fetch(`/api/job-states?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job states');
  }
  const data = await response.json();
  return data.states || {};
};

/**
 * Persist a single job state to the server.
 * @param {string} userId - User ID UUID
 * @param {string} jobId - Job ID (string)
 * @param {string|null} state - New state, or null to clear
 * @returns {Promise<Response>}
 */
export const postJobState = (userId, jobId, state) =>
  fetch('/api/job-states', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, jobId, state }),
  });

/**
 * Persist a batch of job state updates to the server.
 * @param {string} userId - User ID UUID
 * @param {Array<{jobId: string|number, state: string|null}>} updates
 * @returns {Promise<Response>}
 */
export const postJobStatesBatch = (userId, updates) =>
  fetch('/api/job-states/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, updates }),
  });

/**
 * Migrate anonymous (session) states to a newly created user.
 * @param {string} sessionId - Anonymous session ID
 * @param {string} userId - Newly created user ID UUID
 * @returns {Promise<Response>}
 */
export const postMigrate = (sessionId, userId) =>
  fetch('/api/job-states/migrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, userId }),
  });
