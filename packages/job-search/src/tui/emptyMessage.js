/**
 * Honest empty-state message builder: when filters hide every job, say
 * which filters are active and how many jobs exist unfiltered.
 * Pure so it can be unit-tested without Ink.
 */

const FILTER_DESC = {
  remote: () => 'remote',
  globalRemote: () => 'global remote',
  minSalary: (f) => `min $${f.value}k`,
  days: (f) => `last ${f.value}d`,
  search: (f) => `'${f.value}'`,
};

/** Short human labels for the active filters plus any inline find query. */
export function describeActiveFilters(filters, appliedQuery) {
  const parts = (filters || []).map((f) =>
    (FILTER_DESC[f.type] || (() => `${f.type}: ${f.value}`))(f)
  );
  if (appliedQuery) parts.push(`'${appliedQuery}'`);
  return parts;
}

/**
 * Returns [summary, hint] lines when filters/find are actively hiding
 * jobs and the unfiltered total is known — otherwise null (caller falls
 * back to the per-tab default message).
 */
export function buildEmptyMessage({ tab, filters, appliedQuery, totalCount }) {
  const filterParts = describeActiveFilters(filters, appliedQuery);
  if (filterParts.length === 0 || !totalCount) return null;
  const parts = tab && tab !== 'all' ? [tab, ...filterParts] : filterParts;
  const hint = appliedQuery
    ? 'Try removing a filter (f) or clearing find (esc).'
    : 'Try removing a filter (f).';
  return [`0 of ${totalCount} jobs match: ${parts.join(' + ')}.`, hint];
}
