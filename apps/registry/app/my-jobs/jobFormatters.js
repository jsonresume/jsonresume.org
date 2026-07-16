/**
 * Presentation constants + pure helpers for the My Jobs page.
 */

export const STATE_COLORS = {
  interested: 'bg-green-100 text-green-800',
  applied: 'bg-blue-100 text-blue-800',
  maybe: 'bg-yellow-100 text-yellow-800',
  not_interested: 'bg-gray-100 text-gray-500',
  dismissed: 'bg-gray-100 text-gray-400',
};

export const STATE_ICONS = {
  interested: '⭐',
  applied: '📨',
  not_interested: '✗',
  dismissed: '👁',
  maybe: '?',
};

export function formatSalary(salary, salaryUsd) {
  if (salaryUsd) return `$${Math.round(salaryUsd / 1000)}k`;
  if (salary) return salary;
  return null;
}

export function formatLocation(loc, remote) {
  const parts = [];
  if (loc?.city) parts.push(loc.city);
  if (loc?.countryCode) parts.push(loc.countryCode);
  if (remote) parts.push(remote);
  return parts.join(', ') || null;
}

/**
 * Apply the state + remote filters to a job list.
 * @param {Array} jobs - Jobs (may be null)
 * @param {{ stateFilter: string, remote: boolean }} filters
 * @returns {Array} Filtered jobs
 */
export function filterJobs(jobs, filters) {
  let filtered = jobs || [];
  if (filters.stateFilter === 'unmarked') {
    filtered = filtered.filter((j) => !j.state);
  } else if (filters.stateFilter !== 'all') {
    filtered = filtered.filter((j) => j.state === filters.stateFilter);
  }
  if (filters.remote) {
    filtered = filtered.filter((j) => j.remote === 'Full');
  }
  return filtered;
}
