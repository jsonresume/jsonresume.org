/**
 * Reserved routes that cannot be used as GitHub usernames
 * These routes correspond to actual pages/APIs in the application
 */

// Top-level reserved routes (apps/registry/app/)
export const RESERVED_ROUTES = [
  'api',
  'auth',
  'editor',
  'explore',
  'job-similarity',
  'login',
  'privacy',
  'settings',
  'signup',
  '_next',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
];

// User-specific sub-routes (apps/registry/app/[username]/)
export const RESERVED_SUB_ROUTES = [
  'ats',
  'decisions',
  'interview',
  'jobs',
  'jobs-graph',
  'json',
  'letter',
  'timeline',
  'dashboard',
  'pdf',
  'yaml',
];

/**
 * Check if a username conflicts with a reserved route
 * @param {string} username - GitHub username to check
 * @returns {boolean} - True if username is reserved
 */
export function isReservedUsername(username) {
  if (!username || typeof username !== 'string') {
    return false;
  }

  const normalized = username.toLowerCase().trim();
  return RESERVED_ROUTES.includes(normalized);
}

/**
 * Check if a path segment conflicts with a reserved sub-route
 * @param {string} path - Path segment to check
 * @returns {boolean} - True if path is reserved
 */
export function isReservedSubRoute(path) {
  if (!path || typeof path !== 'string') {
    return false;
  }

  const normalized = path.toLowerCase().trim();
  return RESERVED_SUB_ROUTES.includes(normalized);
}

/**
 * Get a user-friendly error message for reserved username
 * @param {string} username - The reserved username
 * @returns {string} - Error message
 */
export function getReservedUsernameError(username) {
  return `The username "${username}" is reserved and cannot be used. This is a system route. Please choose a different GitHub username or contact support.`;
}
