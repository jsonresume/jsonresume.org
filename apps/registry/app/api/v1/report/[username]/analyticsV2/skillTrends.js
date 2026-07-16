/**
 * Skill-trend analytics — adjacency recommendations, job archetypes, and
 * market skill drift over time.
 */
import { flattenJobSkills, skillMatches } from '../helpers';

export function computeSkillAdjacency(marketJobs, userSkills) {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const cooc = {};
  const totals = {};

  for (const job of marketJobs) {
    const sk = flattenJobSkills(job);
    for (const s of sk) {
      totals[s] = (totals[s] || 0) + 1;
    }
    for (let i = 0; i < sk.length; i++) {
      for (let j = i + 1; j < sk.length; j++) {
        const key = sk[i] < sk[j] ? `${sk[i]}|${sk[j]}` : `${sk[j]}|${sk[i]}`;
        cooc[key] = (cooc[key] || 0) + 1;
      }
    }
  }

  const hasSkill = (s) => skillMatches(s, userSet);
  const recs = {};
  for (const [pair, cnt] of Object.entries(cooc)) {
    const [a, b] = pair.split('|');
    if (hasSkill(a) && !hasSkill(b)) {
      if (!recs[b] || cnt > recs[b].coCount) {
        recs[b] = {
          skill: b,
          because: a,
          coCount: cnt,
          totalJobs: totals[b] || 0,
        };
      }
    } else if (hasSkill(b) && !hasSkill(a)) {
      if (!recs[a] || cnt > recs[a].coCount) {
        recs[a] = {
          skill: a,
          because: b,
          coCount: cnt,
          totalJobs: totals[a] || 0,
        };
      }
    }
  }
  return Object.values(recs)
    .sort((a, b) => b.coCount - a.coCount)
    .slice(0, 10);
}

export function computeArchetypes(interestedJobs) {
  if (interestedJobs.length < 3) {
    return [];
  }
  const groups = {};

  for (const job of interestedJobs) {
    const sk = flattenJobSkills(job);
    const key = sk.slice(0, 3).sort().join('+') || 'general';
    if (!groups[key]) {
      groups[key] = { jobs: [], skills: {} };
    }
    groups[key].jobs.push(job);
    for (const s of sk) {
      groups[key].skills[s] = (groups[key].skills[s] || 0) + 1;
    }
  }

  return Object.values(groups)
    .filter((g) => g.jobs.length >= 2)
    .map((g) => {
      const top = Object.entries(g.skills)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([s]) => s);
      return {
        name: top
          .slice(0, 2)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' + '),
        skills: top,
        count: g.jobs.length,
        titles: g.jobs.slice(0, 3).map((j) => j.title),
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function computeMarketDrift(parsedJobs) {
  if (!parsedJobs.length) {
    return { trends: [], growing: [], declining: [] };
  }
  const weeks = {};

  for (const job of parsedJobs) {
    const d = new Date(job.posted_at);
    const day = d.getDay();
    const mondayOffset = d.getDate() - day + (day === 0 ? -6 : 1);
    const ws = new Date(d.getFullYear(), d.getMonth(), mondayOffset)
      .toISOString()
      .slice(0, 10);
    if (!weeks[ws]) {
      weeks[ws] = { week: ws, skills: {}, total: 0 };
    }
    weeks[ws].total++;
    for (const s of flattenJobSkills(job)) {
      weeks[ws].skills[s] = (weeks[ws].skills[s] || 0) + 1;
    }
  }

  const sorted = Object.values(weeks).sort((a, b) =>
    a.week.localeCompare(b.week)
  );
  if (sorted.length < 2) {
    return { trends: sorted, growing: [], declining: [] };
  }

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const all = new Set([
    ...Object.keys(first.skills),
    ...Object.keys(last.skills),
  ]);
  const changes = [];
  for (const sk of all) {
    const fr = (first.skills[sk] || 0) / (first.total || 1);
    const lr = (last.skills[sk] || 0) / (last.total || 1);
    if (Math.abs(lr - fr) > 0.01) {
      changes.push({
        skill: sk,
        change: Math.round((lr - fr) * 100) / 100,
        lastCount: last.skills[sk] || 0,
      });
    }
  }
  changes.sort((a, b) => b.change - a.change);

  return {
    trends: sorted.map((w) => ({ week: w.week, total: w.total })),
    growing: changes.filter((c) => c.change > 0).slice(0, 5),
    declining: changes
      .filter((c) => c.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 5),
  };
}
