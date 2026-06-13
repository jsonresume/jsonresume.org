/**
 * Pure operations over the in-memory dossier cache Map.
 * Map shape: jobId → { text, done, loading }.
 * Kept separate from the hook so the status/seed logic is unit-testable.
 */

// Map an entry to a job-list icon status.
export function dossierStatus(cache, jobId) {
  const entry = cache.get(jobId);
  if (!entry) return null;
  if (entry.loading) return 'generating';
  if (entry.done) return 'done';
  return null;
}

// Seed cache from server-side has_dossier flags. Returns true if anything changed.
export function seedDossierFlags(cache, jobs) {
  let changed = false;
  for (const job of jobs) {
    if (job.has_dossier && !cache.has(job.id)) {
      cache.set(job.id, { text: '', done: true, loading: false });
      changed = true;
    }
  }
  return changed;
}
