/**
 * Pipeline analytics — funnel counts, daily timeline, and review momentum.
 */
export function computePipeline(feedback) {
  const counts = {
    interested: 0,
    maybe: 0,
    applied: 0,
    not_interested: 0,
    dossier: 0,
    dismissed: 0,
  };
  for (const f of feedback) {
    if (counts[f.sentiment] !== undefined) {
      counts[f.sentiment]++;
    }
  }
  return {
    totalJobs: feedback.length,
    reviewed: feedback.length - counts.dossier,
    interested: counts.interested,
    maybe: counts.maybe,
    applied: counts.applied,
    notInterested: counts.not_interested + counts.dismissed,
    dossiers: counts.dossier,
  };
}

export function computeTimeline(feedback, days) {
  const map = {};
  const now = Date.now();
  for (let i = 0; i < days; i++) {
    const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
    map[d] = { date: d, interested: 0, maybe: 0, notInterested: 0, applied: 0 };
  }
  for (const f of feedback) {
    const d = new Date(f.created_at).toISOString().slice(0, 10);
    if (!map[d]) {
      continue;
    }
    if (f.sentiment === 'interested') {
      map[d].interested++;
    } else if (f.sentiment === 'maybe') {
      map[d].maybe++;
    } else if (f.sentiment === 'applied') {
      map[d].applied++;
    } else if (
      f.sentiment === 'not_interested' ||
      f.sentiment === 'dismissed'
    ) {
      map[d].notInterested++;
    }
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

export function computeMomentum(feedback) {
  const now = Date.now();
  const weekMs = 7 * 86400000;
  const thisWeek = feedback.filter(
    (f) =>
      now - new Date(f.created_at).getTime() < weekMs &&
      f.sentiment !== 'dossier'
  );
  const lastWeek = feedback.filter((f) => {
    const age = now - new Date(f.created_at).getTime();
    return age >= weekMs && age < weekMs * 2 && f.sentiment !== 'dossier';
  });
  const thisCount = thisWeek.length;
  const lastCount = lastWeek.length || 1;
  const ratio = thisCount / lastCount;
  const score = Math.max(-100, Math.min(100, Math.round((ratio - 1) * 100)));
  const label =
    score > 20 ? 'accelerating' : score < -20 ? 'slowing' : 'steady';
  return {
    score,
    label,
    reviewsThisWeek: thisCount,
    reviewsLastWeek: lastWeek.length,
  };
}
