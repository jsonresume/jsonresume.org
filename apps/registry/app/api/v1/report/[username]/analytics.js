import { flattenJobSkills, skillMatches } from './helpers';

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
    if (counts[f.sentiment] !== undefined) counts[f.sentiment]++;
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
    if (!map[d]) continue;
    if (f.sentiment === 'interested') map[d].interested++;
    else if (f.sentiment === 'maybe') map[d].maybe++;
    else if (f.sentiment === 'applied') map[d].applied++;
    else if (f.sentiment === 'not_interested' || f.sentiment === 'dismissed') {
      map[d].notInterested++;
    }
  }
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
}

function percentiles(values) {
  if (!values.length) return { min: 0, p25: 0, p50: 0, p75: 0, max: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const p = (pct) =>
    sorted[Math.min(Math.floor(sorted.length * pct), sorted.length - 1)];
  return {
    min: sorted[0],
    p25: p(0.25),
    p50: p(0.5),
    p75: p(0.75),
    max: sorted[sorted.length - 1],
  };
}

const SALARY_RANGES = [
  [0, 50000],
  [50000, 80000],
  [80000, 120000],
  [120000, 160000],
  [160000, 200000],
  [200000, 300000],
  [300000, Infinity],
];

function rangeLabel([lo, hi]) {
  if (hi === Infinity) return `$${lo / 1000}k+`;
  return `$${lo / 1000}k-$${hi / 1000}k`;
}

function parseSalaryFallback(job) {
  if (job.salary_usd) return job.salary_usd;
  if (!job.salary) return null;
  const kMatches = job.salary.match(/\$?([\d,]+)\s*k/gi);
  if (kMatches?.length) {
    const nums = kMatches.map(
      (m) => parseFloat(m.replace(/[$,k]/gi, '')) * 1000
    );
    return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
  }
  const raw = (job.salary.match(/\$?([\d,]+)/g) || [])
    .map((m) => parseFloat(m.replace(/[$,]/g, '')))
    .filter((n) => n > 20000 && n < 1000000);
  return raw.length
    ? Math.round(raw.reduce((a, b) => a + b, 0) / raw.length)
    : null;
}

export function computeSalary(marketJobs, interestedJobs) {
  const marketSals = marketJobs.map(parseSalaryFallback).filter(Boolean);
  const intSals = interestedJobs.map(parseSalaryFallback).filter(Boolean);
  const distribution = SALARY_RANGES.map(([lo, hi]) => ({
    range: rangeLabel([lo, hi]),
    market: marketSals.filter((s) => s >= lo && s < hi).length,
    interested: intSals.filter((s) => s >= lo && s < hi).length,
  }));
  return {
    market: percentiles(marketSals),
    interested: percentiles(intSals),
    distribution,
  };
}

export function computeRemoteIndex(marketJobs, interestedJobs) {
  const count = (jobs) =>
    jobs.reduce(
      (t, j) => {
        const r = (j.remote || '').toLowerCase();
        if (r === 'full') t.full++;
        else if (r === 'hybrid') t.hybrid++;
        else t.none++;
        return t;
      },
      { full: 0, hybrid: 0, none: 0 }
    );
  return { market: count(marketJobs), interested: count(interestedJobs) };
}

export function computeDealBreakers(acceptedJobs, rejectedJobs) {
  if (!rejectedJobs.length || !acceptedJobs.length) return [];
  const getVal = (j, f) => {
    if (f === 'country') return j.location?.countryCode || 'Unknown';
    return j[f];
  };
  const features = ['remote', 'experience', 'type', 'country'];
  const results = [];
  for (const feature of features) {
    const values = new Set([
      ...acceptedJobs.map((j) => getVal(j, feature)),
      ...rejectedJobs.map((j) => getVal(j, feature)),
    ]);
    for (const value of values) {
      if (!value) continue;
      const acceptRate =
        acceptedJobs.filter((j) => getVal(j, feature) === value).length /
        acceptedJobs.length;
      const rejectRate =
        rejectedJobs.filter((j) => getVal(j, feature) === value).length /
        rejectedJobs.length;
      const divergence = Math.round((rejectRate - acceptRate) * 100) / 100;
      if (Math.abs(divergence) > 0.05) {
        results.push({
          feature,
          value,
          rejectRate: round(rejectRate),
          acceptRate: round(acceptRate),
          divergence,
        });
      }
    }
  }
  return results
    .sort((a, b) => Math.abs(b.divergence) - Math.abs(a.divergence))
    .slice(0, 10);
}

function round(n) {
  return Math.round(n * 100) / 100;
}

export function computeSkillGaps(marketJobs, interestedJobs, userSkills) {
  const countSkills = (jobs) => {
    const counts = {};
    for (const j of jobs)
      for (const s of flattenJobSkills(j)) {
        counts[s] = (counts[s] || 0) + 1;
      }
    return counts;
  };
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const topDemanded = Object.entries(countSkills(marketJobs))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([skill, count]) => ({ skill, count }));
  const gaps = Object.entries(countSkills(interestedJobs))
    .filter(([skill]) => !skillMatches(skill, userSet))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count }));
  return { gaps, topDemanded, userSkills };
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

function truncCompany(name) {
  if (!name) return 'Unknown';
  const trimmed = name.split(/\.|,| is | builds | provides | turns /)[0].trim();
  return trimmed.length > 60 ? trimmed.slice(0, 57) + '...' : trimmed;
}

export function computeTopCompanies(feedback) {
  const map = {};
  for (const f of feedback) {
    const co = truncCompany(f.job_company);
    if (!map[co]) map[co] = { company: co, count: 0, sentiments: {} };
    map[co].count++;
    map[co].sentiments[f.sentiment] =
      (map[co].sentiments[f.sentiment] || 0) + 1;
  }
  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map(({ company, count, sentiments }) => {
      const top = Object.entries(sentiments).sort((a, b) => b[1] - a[1])[0];
      return { company, count, sentiment: top ? top[0] : 'none' };
    });
}

export function computeRecentActivity(feedback) {
  return feedback
    .filter((f) => f.sentiment !== 'dossier')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20)
    .map((f) => ({
      date: f.created_at,
      sentiment: f.sentiment,
      company: truncCompany(f.job_company),
      title: f.job_title || 'Unknown',
    }));
}

export function findSecondLookJobs(
  rejectedJobs,
  interestedJobs,
  allParsedJobs
) {
  if (!interestedJobs.length || !rejectedJobs.length) return [];
  const intSkills = new Set();
  for (const j of interestedJobs) {
    for (const s of flattenJobSkills(j)) intSkills.add(s);
  }
  return rejectedJobs
    .map((j) => {
      const jobSkills = flattenJobSkills(j);
      const overlap = jobSkills.filter((s) => intSkills.has(s)).length;
      return { ...j, _overlap: overlap };
    })
    .filter((j) => j._overlap > 0)
    .sort((a, b) => b._overlap - a._overlap)
    .slice(0, 5)
    .map(({ _overlap, ...rest }) => rest);
}
