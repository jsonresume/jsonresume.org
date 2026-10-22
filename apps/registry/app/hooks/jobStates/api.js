import { authHeaders } from '../../lib/authHeaders';

/**
 * Server sync for job states.
 *
 * Authenticated users have their read/interested/hidden states persisted to
 * Supabase via the `/api/job-states*` routes. These helpers own the fetch
 * calls so the hook stays focused on state wiring. The server identifies the
 * user from the Supabase access token sent here, never from the request body.
 */

/**
 * Fetch the signed-in user's job states from the server.
 * @returns {Promise<Object>} Job states map { jobId: state }
 * @throws {Error} If the request fails
 */
export const fetchJobStates = async () => {
  const response = await fetch('/api/job-states', {
    headers: await authHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch job states');
  }
  const data = await response.json();
  return data.states || {};
};

/**
 * Persist a single job state to the server.
 * @param {string} jobId - Job ID (string)
 * @param {string|null} state - New state, or null to clear
 * @returns {Promise<Response>}
 */
export const postJobState = async (jobId, state) =>
  fetch('/api/job-states', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ jobId, state }),
  });

/**
 * Persist a batch of job state updates to the server.
 * @param {Array<{jobId: string|number, state: string|null}>} updates
 * @returns {Promise<Response>}
 */
export const postJobStatesBatch = async (updates) =>
  fetch('/api/job-states/batch', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ updates }),
  });

/**
 * Migrate anonymous (session) states to the signed-in user.
 * @param {string} sessionId - Anonymous session ID
 * @param {Object} states - Anonymous states map { jobId: state }
 * @returns {Promise<Response>}
 */
export const postMigrate = async (sessionId, states) =>
  fetch('/api/job-states/migrate', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ sessionId, states }),
  });
