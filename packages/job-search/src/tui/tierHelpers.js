/**
 * Pure tier/digest logic for the TUI job list.
 * Extracted so grouping and digest rules can be unit-tested without Ink.
 *
 * Servers may or may not send `tier` ('strong'|'good'|'stretch'|null) —
 * everything here degrades gracefully when tier data is absent.
 */

const VALID_TIERS = new Set(['strong', 'good', 'stretch']);

export const TIER_ORDER = ['strong', 'good', 'stretch', 'other'];

export const TIER_LABELS = {
  strong: 'Strong matches',
  good: 'Good matches',
  stretch: 'Stretch',
  other: 'Other',
};

/** Normalized tier for a job — unknown/missing tiers land in 'other'. */
export function tierOf(job) {
  return job && VALID_TIERS.has(job.tier) ? job.tier : 'other';
}

/** True when at least one job carries a recognized tier. */
export function hasTierData(jobs) {
  return Array.isArray(jobs) && jobs.some((j) => VALID_TIERS.has(j?.tier));
}

/**
 * Order jobs by tier band (strong > good > stretch > other), keeping
 * server order within each band. Returns the input array untouched
 * (same reference) when no tier data exists.
 */
export function orderJobsByTier(jobs) {
  if (!hasTierData(jobs)) return jobs;
  const buckets = { strong: [], good: [], stretch: [], other: [] };
  for (const j of jobs) buckets[tierOf(j)].push(j);
  return TIER_ORDER.flatMap((t) => buckets[t]);
}

/**
 * Flatten tier-ordered jobs into display rows:
 *   { type: 'separator', tier, label } | { type: 'job', job, jobIndex }
 * With no tier data there are no separators and flat index === job index.
 */
export function buildTierRows(jobs) {
  if (!hasTierData(jobs)) {
    return jobs.map((job, i) => ({ type: 'job', job, jobIndex: i }));
  }
  const rows = [];
  let prev = null;
  jobs.forEach((job, i) => {
    const tier = tierOf(job);
    if (tier !== prev) {
      rows.push({ type: 'separator', tier, label: TIER_LABELS[tier] });
      prev = tier;
    }
    rows.push({ type: 'job', job, jobIndex: i });
  });
  return rows;
}

/** Compact colored chip shown in place of the raw score column. */
export function tierChip(tier) {
  if (tier === 'strong') return { char: 'S', color: 'green', dim: false };
  if (tier === 'good') return { char: 'G', color: 'cyan', dim: false };
  if (tier === 'stretch') return { char: 'T', color: 'yellow', dim: false };
  return { char: '·', color: undefined, dim: true };
}

/**
 * Digest counts for the header: total, strong/good counts (when tiers
 * exist) and how many jobs are new since the last visit.
 * lastSeenIds is a Set of stringified job ids; an empty set (first ever
 * run) reports 0 new rather than claiming everything is new.
 */
export function computeDigest(jobs, lastSeenIds) {
  const list = Array.isArray(jobs) ? jobs : [];
  const newCount =
    lastSeenIds && lastSeenIds.size > 0
      ? list.filter((j) => !lastSeenIds.has(String(j.id))).length
      : 0;
  return {
    total: list.length,
    strong: list.filter((j) => tierOf(j) === 'strong').length,
    good: list.filter((j) => tierOf(j) === 'good').length,
    hasTiers: hasTierData(list),
    newCount,
  };
}

/** One-line digest text, or null when there is nothing beyond the default display. */
export function formatDigest(digest) {
  if (!digest || digest.total === 0) return null;
  const parts = [];
  if (digest.hasTiers) {
    parts.push(
      `${digest.total} jobs`,
      `${digest.strong} strong`,
      `${digest.good} good`
    );
  }
  if (digest.newCount > 0) {
    parts.push(`${digest.newCount} new since last visit`);
  }
  return parts.length ? parts.join(' · ') : null;
}
