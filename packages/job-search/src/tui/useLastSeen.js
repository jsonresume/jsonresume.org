import { useState, useEffect, useMemo, useRef } from 'react';
import { loadLastSeenIds, saveLastSeenIds } from '../lastSeen.js';
import { computeDigest } from './tierHelpers.js';

/**
 * Header digest state ("N jobs · X strong · Y good · Z new since last
 * visit"): snapshots the last-seen job ids at mount, persists the current
 * ids once after the first successful load, and returns the digest.
 */
export function useLastSeenDigest(allJobs, loading) {
  const [lastSeenIds] = useState(() => loadLastSeenIds());
  const saved = useRef(false);

  useEffect(() => {
    if (loading || saved.current || allJobs.length === 0) return;
    saved.current = true;
    try {
      saveLastSeenIds(allJobs.map((j) => j.id));
    } catch {}
  }, [loading, allJobs]);

  return useMemo(
    () => computeDigest(allJobs, lastSeenIds),
    [allJobs, lastSeenIds]
  );
}
