/**
 * Preference-signal analytics — deal-breakers, skill gaps, top companies,
 * recent activity, and second-look suggestions.
 */
import { flattenJobSkills, skillMatches } from '../helpers';

function round(n) {
  return Math.round(n * 100) / 100;
}

function truncCompany(name) {
  if (!name) {
    return 'Unknown';
  }
  const trimmed = name.split(/\.|,| is | builds | provides | turns /)[0].trim();
  return trimmed.length > 60 ? trimmed.slice(0, 57) + '...' : trimmed;
}

export function computeDealBreakers(acceptedJobs, rejectedJobs) {
  if (!rejectedJobs.length || !acceptedJobs.length) {
    return [];
  }
  const getVal = (j, f) => {
    if (f === 'country') {
      return j.location?.countryCode || 'Unknown';
    }
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
      if (!value) {
        continue;
      }
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

export function computeSkillGaps(marketJobs, interestedJobs, userSkills) {
  const countSkills = (jobs) => {
    const counts = {};
    for (const j of jobs) {
      for (const s of flattenJobSkills(j)) {
        counts[s] = (counts[s] || 0) + 1;
      }
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

export function computeTopCompanies(feedback) {
  const map = {};
  for (const f of feedback) {
    const co = truncCompany(f.job_company);
    if (!map[co]) {
      map[co] = { company: co, count: 0, sentiments: {} };
    }
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
  _allParsedJobs
) {
  if (!interestedJobs.length || !rejectedJobs.length) {
    return [];
  }
  const intSkills = new Set();
  for (const j of interestedJobs) {
    for (const s of flattenJobSkills(j)) {
      intSkills.add(s);
    }
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
