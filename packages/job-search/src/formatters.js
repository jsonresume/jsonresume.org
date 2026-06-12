export function formatSalary(salary, salaryUsd) {
  if (salaryUsd) return `$${Math.round(salaryUsd / 1000)}k`;
  if (salary) return salary;
  return '—';
}

/**
 * Defensive location normalizer for job records.
 *
 * The registry API serves `job.location` straight from the parsed
 * `gpt_content`, whose canonical shape is an OBJECT
 * (`{ address, postalCode, city, region, countryCode }`, see the
 * extraction schema in apps/registry/scripts/jobs/job-parser/jobSchema.js).
 * Remote status is a SEPARATE field (`job.remote` → 'Full' | 'Hybrid' | 'None').
 *
 * Historic rows may still carry `location` as a plain string, so this
 * normalizer accepts strings, objects, or nullish input and always returns a
 * stable shape:
 *   { city, region, countryCode, display, remote }
 * where `remote` is a boolean derived from either the separate `remote`
 * field or a "remote" hint inside a string location.
 *
 * @param {Object|string|null} job - a job record, or a bare location value.
 * @returns {{city:string|null, region:string|null, countryCode:string|null, display:string|null, remote:boolean}}
 */
export function normalizeLocation(job) {
  // Allow passing either a full job record or a bare location value.
  const isJobRecord = job && typeof job === 'object' && 'location' in job;
  const loc = isJobRecord ? job.location : job;
  const remoteField = isJobRecord ? job.remote : undefined;

  let city = null;
  let region = null;
  let countryCode = null;
  let display = null;
  let stringRemote = false;

  if (typeof loc === 'string') {
    const trimmed = loc.trim();
    display = trimmed || null;
    stringRemote = /remote/i.test(trimmed);
  } else if (loc && typeof loc === 'object') {
    city = loc.city || null;
    region = loc.region || null;
    countryCode = loc.countryCode || null;
    const parts = [city, region, countryCode].filter(Boolean);
    display = parts.length ? parts.join(', ') : null;
  }

  // Mirror the server-side remote filter (matchingHelpers.js), which treats
  // only fully-remote roles as "remote" (j.remote === 'Full'). For historic
  // string locations with no separate `remote` field, fall back to the
  // "remote" hint in the location text.
  const remote = remoteField === 'Full' || stringRemote;

  return { city, region, countryCode, display, remote };
}

export function formatLocation(loc, remote) {
  const norm = normalizeLocation(loc);
  const parts = [];
  if (norm.display) parts.push(norm.display);
  if (remote) parts.push(`(${remote})`);
  return parts.join(', ') || '—';
}

export function stateIcon(state) {
  const icons = {
    interested: '⭐',
    applied: '📨',
    not_interested: '✗',
    dismissed: '👁',
    maybe: '?',
  };
  return icons[state] || ' ';
}

export function stateColor(state) {
  const colors = {
    interested: 'green',
    applied: 'blue',
    not_interested: 'red',
    dismissed: 'gray',
    maybe: 'yellow',
  };
  return colors[state] || 'white';
}

export function truncate(str, len) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len - 1) + '…' : str;
}

export function formatAge(postedAt) {
  if (!postedAt) return '';
  const days = Math.floor(
    (Date.now() - new Date(postedAt).getTime()) / 86400000
  );
  if (days === 0) return 'today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function stateLabel(state) {
  const labels = {
    interested: 'Interested',
    applied: 'Applied',
    not_interested: 'Passed',
    dismissed: 'Dismissed',
    maybe: 'Maybe',
  };
  return labels[state] || '';
}
