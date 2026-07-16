/**
 * localStorage persistence for job states.
 *
 * Anonymous users keep their read/interested/hidden states in localStorage,
 * keyed per session. All access is guarded for SSR (no `window`) and wrapped
 * in try/catch so a quota/parse failure never breaks the UI.
 */

const STORAGE_KEY_PREFIX = 'pathways_job_states';

/**
 * Get localStorage key for job states
 * @param {string} sessionId - Session ID for anonymous users
 * @returns {string} localStorage key
 */
export const getStorageKey = (sessionId) =>
  `${STORAGE_KEY_PREFIX}_${sessionId}`;

/**
 * Load job states from localStorage
 * @param {string} sessionId - Session ID
 * @returns {Object} Job states map { jobId: state }
 */
export const loadFromLocalStorage = (sessionId) => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(getStorageKey(sessionId));
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load job states from localStorage:', error);
    return {};
  }
};

/**
 * Save job states to localStorage
 * @param {string} sessionId - Session ID
 * @param {Object} states - Job states map
 */
export const saveToLocalStorage = (sessionId, states) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(sessionId), JSON.stringify(states));
  } catch (error) {
    console.error('Failed to save job states to localStorage:', error);
  }
};

/**
 * Clear job states from localStorage
 * @param {string} sessionId - Session ID
 */
export const clearLocalStorage = (sessionId) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(getStorageKey(sessionId));
  } catch (error) {
    console.error('Failed to clear job states from localStorage:', error);
  }
};
