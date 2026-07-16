/**
 * Salary & remote analytics — distribution/percentiles and remote index.
 */
function percentiles(values) {
  if (!values.length) {
    return { min: 0, p25: 0, p50: 0, p75: 0, max: 0 };
  }
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
  if (hi === Infinity) {
    return `$${lo / 1000}k+`;
  }
  return `$${lo / 1000}k-$${hi / 1000}k`;
}

function parseSalaryFallback(job) {
  if (job.salary_usd) {
    return job.salary_usd;
  }
  if (!job.salary) {
    return null;
  }
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
        if (r === 'full') {
          t.full++;
        } else if (r === 'hybrid') {
          t.hybrid++;
        } else {
          t.none++;
        }
        return t;
      },
      { full: 0, hybrid: 0, none: 0 }
    );
  return { market: count(marketJobs), interested: count(interestedJobs) };
}
