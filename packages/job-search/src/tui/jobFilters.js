/**
 * Pure tab/count/filter logic for the TUI App.
 * Extracted so the categorization rules can be unit-tested without Ink.
 */

export const TABS = [
  'all',
  'new',
  'reviewed',
  'interested',
  'applied',
  'maybe',
  'passed',
];

export const TAB_LABELS = {
  all: 'All',
  new: 'New',
  reviewed: 'Reviewed',
  interested: 'Interested',
  applied: 'Applied',
  maybe: 'Maybe',
  passed: 'Passed',
};

// Next/previous tab id with wraparound.
export function nextTab(tab, dir = 1) {
  const idx = TABS.indexOf(tab);
  return TABS[(idx + dir + TABS.length) % TABS.length];
}

// Free-text filter over the visible job fields.
export function filterJobsByQuery(jobs, query) {
  if (!query) return jobs;
  const q = query.toLowerCase();
  return jobs.filter((j) => {
    const fields = [
      j.title,
      j.company,
      j.description,
      j.remote,
      j.location?.city,
      j.location?.countryCode,
      ...(j.skills || []).map((s) => s.name || s),
    ];
    return fields.some((f) => f && String(f).toLowerCase().includes(q));
  });
}

// Per-tab counts for the header. getDossierStatus(jobId) → 'done'|'generating'|null
export function computeCounts(allJobs, getDossierStatus) {
  return {
    all: allJobs.length,
    new: allJobs.filter(
      (j) =>
        !j.state &&
        !j.has_dossier &&
        getDossierStatus(j.id) !== 'done' &&
        getDossierStatus(j.id) !== 'generating'
    ).length,
    reviewed: allJobs.filter(
      (j) => (j.has_dossier || getDossierStatus(j.id) === 'done') && !j.state
    ).length,
    interested: allJobs.filter((j) => j.state === 'interested').length,
    applied: allJobs.filter((j) => j.state === 'applied').length,
    maybe: allJobs.filter((j) => j.state === 'maybe').length,
    passed: allJobs.filter((j) => j.state === 'not_interested').length,
  };
}
