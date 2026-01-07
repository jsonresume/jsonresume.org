/**
 * Get or create a session ID for anonymous users
 */
export function getSessionId() {
  if (typeof window === 'undefined') return null;

  let id = localStorage.getItem('pathways_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('pathways_session_id', id);
  }
  return id;
}

/**
 * Clear the session ID (for when user logs in)
 */
export function clearSessionId() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('pathways_session_id');
}

/**
 * Get all job states from localStorage for migration
 */
export function getLocalJobStates() {
  if (typeof window === 'undefined') return {};

  const localStates = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('pathways_job_')) {
      const jobId = key.replace('pathways_job_', '');
      localStates[jobId] = localStorage.getItem(key);
    }
  }
  return localStates;
}

/**
 * Clear all job states from localStorage
 */
export function clearLocalJobStates(states) {
  if (typeof window === 'undefined') return;
  Object.keys(states).forEach((jobId) => {
    localStorage.removeItem(`pathways_job_${jobId}`);
  });
}
