/**
 * V2 analytics — Anti-Resume, Skill Adjacency, Archetypes, Market Drift, Readiness
 */
import { flattenJobSkills, skillMatches } from './helpers';

export function computeAntiResume(interestedJobs, rejectedJobs) {
  if (!rejectedJobs.length) return { skills: [], attributes: [] };
  const rejTotal = rejectedJobs.length || 1;
  const intTotal = interestedJobs.length || 1;

  const count = (jobs) => {
    const m = {};
    for (const j of jobs)
      for (const s of flattenJobSkills(j)) m[s] = (m[s] || 0) + 1;
    return m;
  };
  const rejSkills = count(rejectedJobs);
  const intSkills = count(interestedJobs);

  const skills = Object.entries(rejSkills)
    .map(([skill, rc]) => {
      const ic = intSkills[skill] || 0;
      const avoid = rc / rejTotal - ic / intTotal;
      return {
        skill,
        rejCount: rc,
        intCount: ic,
        avoidScore: Math.round(avoid * 100) / 100,
      };
    })
    .filter((s) => s.avoidScore > 0.05)
    .sort((a, b) => b.avoidScore - a.avoidScore)
    .slice(0, 8);

  const attrs = [];
  for (const attr of ['remote', 'experience', 'type']) {
    const rc = {},
      ic = {};
    for (const j of rejectedJobs)
      if (j[attr]) rc[j[attr]] = (rc[j[attr]] || 0) + 1;
    for (const j of interestedJobs)
      if (j[attr]) ic[j[attr]] = (ic[j[attr]] || 0) + 1;
    for (const [val, c] of Object.entries(rc)) {
      const score = c / rejTotal - (ic[val] || 0) / intTotal;
      if (score > 0.1)
        attrs.push({
          attribute: attr,
          value: val,
          avoidScore: Math.round(score * 100) / 100,
        });
    }
  }
  attrs.sort((a, b) => b.avoidScore - a.avoidScore);
  return { skills, attributes: attrs.slice(0, 6) };
}

export function computeSkillAdjacency(marketJobs, userSkills) {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const cooc = {};
  const totals = {};

  for (const job of marketJobs) {
    const sk = flattenJobSkills(job);
    for (const s of sk) totals[s] = (totals[s] || 0) + 1;
    for (let i = 0; i < sk.length; i++)
      for (let j = i + 1; j < sk.length; j++) {
        const key = sk[i] < sk[j] ? `${sk[i]}|${sk[j]}` : `${sk[j]}|${sk[i]}`;
        cooc[key] = (cooc[key] || 0) + 1;
      }
  }

  const hasSkill = (s) => skillMatches(s, userSet);
  const recs = {};
  for (const [pair, cnt] of Object.entries(cooc)) {
    const [a, b] = pair.split('|');
    if (hasSkill(a) && !hasSkill(b)) {
      if (!recs[b] || cnt > recs[b].coCount)
        recs[b] = {
          skill: b,
          because: a,
          coCount: cnt,
          totalJobs: totals[b] || 0,
        };
    } else if (hasSkill(b) && !hasSkill(a)) {
      if (!recs[a] || cnt > recs[a].coCount)
        recs[a] = {
          skill: a,
          because: b,
          coCount: cnt,
          totalJobs: totals[a] || 0,
        };
    }
  }
  return Object.values(recs)
    .sort((a, b) => b.coCount - a.coCount)
    .slice(0, 10);
}

export function computeArchetypes(interestedJobs) {
  if (interestedJobs.length < 3) return [];
  const groups = {};

  for (const job of interestedJobs) {
    const sk = flattenJobSkills(job);
    const key = sk.slice(0, 3).sort().join('+') || 'general';
    if (!groups[key]) groups[key] = { jobs: [], skills: {} };
    groups[key].jobs.push(job);
    for (const s of sk)
      groups[key].skills[s] = (groups[key].skills[s] || 0) + 1;
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
  if (!parsedJobs.length) return { trends: [], growing: [], declining: [] };
  const weeks = {};

  for (const job of parsedJobs) {
    const d = new Date(job.posted_at);
    const day = d.getDay();
    const mondayOffset = d.getDate() - day + (day === 0 ? -6 : 1);
    const ws = new Date(d.getFullYear(), d.getMonth(), mondayOffset)
      .toISOString()
      .slice(0, 10);
    if (!weeks[ws]) weeks[ws] = { week: ws, skills: {}, total: 0 };
    weeks[ws].total++;
    for (const s of flattenJobSkills(job)) {
      weeks[ws].skills[s] = (weeks[ws].skills[s] || 0) + 1;
    }
  }

  const sorted = Object.values(weeks).sort((a, b) =>
    a.week.localeCompare(b.week)
  );
  if (sorted.length < 2) return { trends: sorted, growing: [], declining: [] };

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
    if (Math.abs(lr - fr) > 0.01)
      changes.push({
        skill: sk,
        change: Math.round((lr - fr) * 100) / 100,
        lastCount: last.skills[sk] || 0,
      });
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

export function computeReadinessScores(
  interestedJobs,
  userSkills,
  resume,
  salaryStats
) {
  const userSet = new Set(userSkills.map((s) => s.toLowerCase()));
  const workYears = (resume?.work || []).reduce((t, w) => {
    const s = w.startDate ? new Date(w.startDate) : null;
    const e = w.endDate ? new Date(w.endDate) : new Date();
    return s ? t + (e - s) / (365.25 * 86400000) : t;
  }, 0);

  // Use market salary percentiles for scoring
  const mktP25 = salaryStats?.market?.p25 || 50000;
  const mktP50 = salaryStats?.market?.p50 || 100000;
  const mktP75 = salaryStats?.market?.p75 || 150000;

  return interestedJobs.slice(0, 8).map((job) => {
    // Skill match: flatten both name and keywords, fuzzy match
    const jobSkills = flattenJobSkills(job);
    const matchedSkills = jobSkills.filter((s) => skillMatches(s, userSet));
    const missingSkills = jobSkills.filter((s) => !skillMatches(s, userSet));
    const matched = matchedSkills.length;
    const skillPct = jobSkills.length ? matched / jobSkills.length : 0.5;

    // Experience match
    let expPct = 0.5;
    const exp = (job.experience || '').toLowerCase();
    if (exp.includes('senior') || exp.includes('5+') || exp.includes('7+'))
      expPct = workYears >= 5 ? 1 : workYears >= 3 ? 0.6 : 0.3;
    else if (exp.includes('mid') || exp.includes('3+'))
      expPct = workYears >= 3 ? 1 : workYears >= 1 ? 0.7 : 0.4;
    else if (exp.includes('junior') || exp.includes('entry')) expPct = 1;

    // Remote match — case-insensitive
    const remote = (job.remote || '').toLowerCase();
    const remotePct =
      remote === 'full' ? 0.95 : remote === 'hybrid' ? 0.7 : 0.4;

    // Salary — percentile-based scoring against market
    let salaryPct = 0.5;
    const sal = job.salary_usd;
    if (sal) {
      if (sal >= mktP75) salaryPct = 0.95;
      else if (sal >= mktP50) salaryPct = 0.8;
      else if (sal >= mktP25) salaryPct = 0.6;
      else salaryPct = 0.35;
    }

    // Location compatibility (from evaluate criteria)
    const userCountry = resume?.basics?.location?.countryCode?.toUpperCase();
    const jobCountry = job.location?.countryCode?.toUpperCase();
    let locationPct = 0.5;
    if (remote === 'full') locationPct = 0.95;
    else if (userCountry && jobCountry) {
      locationPct = userCountry === jobCountry ? 0.9 : 0.3;
    }

    // Visa/work rights (from evaluate criteria)
    let visaPct = 0.7; // neutral default
    const visa = (job.visa_sponsorship || '').toLowerCase();
    if (visa === 'yes') visaPct = 0.95;
    else if (
      visa === 'no' &&
      userCountry &&
      jobCountry &&
      userCountry !== jobCountry
    ) {
      visaPct = 0.2;
    }

    const scores = {
      skills: Math.round(skillPct * 100),
      experience: Math.round(expPct * 100),
      remote: Math.round(remotePct * 100),
      salary: Math.round(salaryPct * 100),
      location: Math.round(locationPct * 100),
      visa: Math.round(visaPct * 100),
    };
    const vals = Object.values(scores);
    const overall = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);

    return {
      id: job.id,
      title: job.title,
      company: job.company,
      matchedSkills: matchedSkills.slice(0, 8),
      missingSkills: missingSkills.slice(0, 5),
      scores,
      overall,
    };
  });
}

/**
 * Find jobs similar to the user's best-liked jobs.
 * Uses skill overlap to suggest new jobs the user hasn't reviewed.
 */
export function computeBestMatchSimilar(
  interestedJobs,
  allParsedJobs,
  feedbackJobIds
) {
  if (!interestedJobs.length || allParsedJobs.length < 5) return [];

  const reviewedIds = new Set(feedbackJobIds.map(String));
  const intSkillSets = interestedJobs.map((j) => new Set(flattenJobSkills(j)));

  return allParsedJobs
    .filter((j) => !reviewedIds.has(String(j.id)))
    .map((job) => {
      const jobSkills = flattenJobSkills(job);
      let bestOverlap = 0;
      let bestMatch = null;
      for (let i = 0; i < intSkillSets.length; i++) {
        const overlap = jobSkills.filter((s) =>
          skillMatches(s, intSkillSets[i])
        ).length;
        if (overlap > bestOverlap) {
          bestOverlap = overlap;
          bestMatch = interestedJobs[i];
        }
      }
      return {
        id: job.id,
        title: job.title,
        company: job.company,
        overlap: bestOverlap,
        totalSkills: jobSkills.length,
        similarTo: bestMatch
          ? { title: bestMatch.title, company: bestMatch.company }
          : null,
      };
    })
    .filter((j) => j.overlap >= 2)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 8);
}
