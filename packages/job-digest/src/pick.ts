import type { DecidedJob } from '@repo/api';

/** At most this many jobs in one email. */
export const DIGEST_SIZE = 5;
/** New means posted within this many days (a little over a week). */
export const NEW_DAYS = 8;

/**
 * The jobs one email carries: unmarked apply jobs, then stretch, posted in
 * the last NEW_DAYS and never sent before, in the dashboard's order (best
 * value first within each verdict).
 */
export function pickJobs(
  jobs: ReadonlyArray<DecidedJob>,
  sent: ReadonlySet<number>,
  now: Date
): ReadonlyArray<DecidedJob> {
  const since = now.getTime() - NEW_DAYS * 24 * 60 * 60 * 1000;
  const fresh = jobs.filter(
    (job) =>
      job.mark === null &&
      !sent.has(job.id) &&
      Date.parse(job.postedAt) >= since &&
      (job.decision.verdict === 'apply' || job.decision.verdict === 'stretch')
  );
  const order = (verdict: string) => (verdict === 'apply' ? 0 : 1);
  return [...fresh]
    .sort(
      (a, b) =>
        order(a.decision.verdict) - order(b.decision.verdict) ||
        b.decision.value - a.decision.value
    )
    .slice(0, DIGEST_SIZE);
}
