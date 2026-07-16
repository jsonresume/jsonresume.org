/**
 * Readiness analytics — per-job readiness scoring against market stats and
 * best-match similarity suggestions.
 */
import { flattenJobSkills, skillMatches } from '../helpers';

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
    if (exp.includes('senior') || exp.includes('5+') || exp.includes('7+')) {
      expPct = workYears >= 5 ? 1 : workYears >= 3 ? 0.6 : 0.3;
    } else if (exp.includes('mid') || exp.includes('3+')) {
      expPct = workYears >= 3 ? 1 : workYears >= 1 ? 0.7 : 0.4;
    } else if (exp.includes('junior') || exp.includes('entry')) {
      expPct = 1;
    }

    // Remote match — case-insensitive
    const remote = (job.remote || '').toLowerCase();
    const remotePct =
      remote === 'full' ? 0.95 : remote === 'hybrid' ? 0.7 : 0.4;

    // Salary — percentile-based scoring against market
    let salaryPct = 0.5;
    const sal = job.salary_usd;
    if (sal) {
      if (sal >= mktP75) {
        salaryPct = 0.95;
      } else if (sal >= mktP50) {
        salaryPct = 0.8;
      } else if (sal >= mktP25) {
        salaryPct = 0.6;
      } else {
        salaryPct = 0.35;
      }
    }

    // Location compatibility (from evaluate criteria)
    const userCountry = resume?.basics?.location?.countryCode?.toUpperCase();
    const jobCountry = job.location?.countryCode?.toUpperCase();
    let locationPct = 0.5;
    if (remote === 'full') {
      locationPct = 0.95;
    } else if (userCountry && jobCountry) {
      locationPct = userCountry === jobCountry ? 0.9 : 0.3;
    }

    // Visa/work rights (from evaluate criteria)
    let visaPct = 0.7; // neutral default
    const visa = (job.visa_sponsorship || '').toLowerCase();
    if (visa === 'yes') {
      visaPct = 0.95;
    } else if (
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
  if (!interestedJobs.length || allParsedJobs.length < 5) {
    return [];
  }

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
