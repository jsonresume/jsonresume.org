/**
 * Matching Criteria Configuration
 * Defines the rules and weights for job-candidate matching
 */

// Scoring weights (must sum to 100)
export const WEIGHTS = {
  coreSkills: 40, // Hard gate - must pass
  experience: 20, // Heavy penalty if fail
  location: 8,
  timezone: 6,
  workRights: 8, // Hard gate - must pass
  availability: 8,
  salary: 5,
  bonusSkills: 5,
};

// Criteria check functions
// Each returns { pass: boolean, reason: string, score?: number }

export const checks = {
  /**
   * Check if candidate has ALL required skills
   */
  coreSkills(candidate, job) {
    const candidateSkills = (candidate.skills || []).map((s) =>
      typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase()
    );

    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const requiredSkills = (gptJob.skills || []).map((s) =>
      typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase()
    );

    if (!requiredSkills.length) {
      return { pass: true, reason: 'No specific skills required' };
    }

    const missing = requiredSkills.filter(
      (skill) => !candidateSkills.includes(skill)
    );
    const pass = missing.length === 0;

    return {
      pass,
      reason: pass
        ? `All ${requiredSkills.length} required skills present`
        : `Missing: ${missing.slice(0, 3).join(', ')}${
            missing.length > 3 ? ` +${missing.length - 3} more` : ''
          }`,
      score: pass ? WEIGHTS.coreSkills : 0,
    };
  },

  /**
   * Check if candidate has enough experience
   */
  experience(candidate, job) {
    const candidateYears = calculateYearsOfExperience(candidate);
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const requiredYears = gptJob.minYearsExperience || 0;

    const pass = candidateYears >= requiredYears;

    return {
      pass,
      reason: pass
        ? `${candidateYears}y ≥ ${requiredYears}y required`
        : `${candidateYears}y < ${requiredYears}y required`,
      score: pass ? WEIGHTS.experience : 0,
    };
  },

  /**
   * Check if location is compatible
   */
  location(candidate, job) {
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const remoteOk =
      gptJob.remote || job.location?.toLowerCase().includes('remote');

    if (remoteOk) {
      return {
        pass: true,
        reason: 'Remote position accepted',
        score: WEIGHTS.location,
      };
    }

    const candidateLocation = (
      candidate.basics?.location?.city ||
      candidate.location ||
      ''
    ).toLowerCase();
    const jobLocation = (gptJob.location || job.location || '').toLowerCase();

    const pass =
      candidateLocation.includes(jobLocation) ||
      jobLocation.includes(candidateLocation);

    return {
      pass,
      reason: pass
        ? `Location match (${candidateLocation})`
        : `Needs ${jobLocation}`,
      score: pass ? WEIGHTS.location : 0,
    };
  },

  /**
   * Check if timezone is compatible
   */
  timezone(candidate, job) {
    const candidateTimezone = (
      candidate.basics?.location?.region ||
      candidate.timezone ||
      ''
    ).toUpperCase();
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const jobTimezone = (gptJob.timezone || '').toUpperCase();

    if (!jobTimezone) {
      return {
        pass: true,
        reason: 'No timezone requirement',
        score: WEIGHTS.timezone,
      };
    }

    const pass =
      candidateTimezone.includes(jobTimezone) ||
      jobTimezone.includes(candidateTimezone);

    return {
      pass,
      reason: pass
        ? `Timezone match (${candidateTimezone})`
        : `Needs ${jobTimezone}`,
      score: pass ? WEIGHTS.timezone : 0,
    };
  },

  /**
   * Check if work rights are verified
   */
  workRights(candidate, job) {
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const workRightsRequired = gptJob.workRightsRequired !== false; // Default true

    if (!workRightsRequired) {
      return {
        pass: true,
        reason: 'Work rights not required',
        score: WEIGHTS.workRights,
      };
    }

    // Check if candidate has work rights indicator
    const hasWorkRights =
      candidate.workRights === true || candidate.basics?.workRights === true;

    return {
      pass: hasWorkRights,
      reason: hasWorkRights ? 'Verified ✅' : 'Not verified',
      score: hasWorkRights ? WEIGHTS.workRights : 0,
    };
  },

  /**
   * Check if candidate is available within required timeframe
   */
  availability(candidate, job) {
    const candidateWeeks =
      candidate.availability?.weeks || candidate.availabilityWeeks || 0;
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const requiredWeeks = gptJob.startWithinWeeks || 12; // Default 12 weeks

    const pass = candidateWeeks <= requiredWeeks;

    return {
      pass,
      reason: pass
        ? `Available in ${candidateWeeks}w (≤ ${requiredWeeks}w)`
        : `Available in ${candidateWeeks}w (> ${requiredWeeks}w needed)`,
      score: pass ? WEIGHTS.availability : 0,
    };
  },

  /**
   * Check if salary expectations align
   */
  salary(candidate, job) {
    const candidateSalary =
      candidate.salary || candidate.basics?.expectedSalary || 0;
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const salaryMin = gptJob.salary?.min || gptJob.salaryMin || 0;
    const salaryMax = gptJob.salary?.max || gptJob.salaryMax || 999999;

    if (!candidateSalary) {
      return {
        pass: true,
        reason: 'No salary preference specified',
        score: WEIGHTS.salary,
      };
    }

    const pass = candidateSalary >= salaryMin && candidateSalary <= salaryMax;

    return {
      pass,
      reason: pass
        ? `$${Math.round(candidateSalary / 1000)}k within range ($${Math.round(
            salaryMin / 1000
          )}-${Math.round(salaryMax / 1000)}k)`
        : `$${Math.round(candidateSalary / 1000)}k outside $${Math.round(
            salaryMin / 1000
          )}-${Math.round(salaryMax / 1000)}k range`,
      score: pass ? WEIGHTS.salary : 0,
    };
  },

  /**
   * Check for bonus skill overlap
   */
  bonusSkills(candidate, job) {
    const candidateSkills = (candidate.skills || []).map((s) =>
      typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase()
    );

    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    const bonusSkills = (gptJob.bonusSkills || []).map((s) =>
      typeof s === 'string' ? s.toLowerCase() : s.name?.toLowerCase()
    );

    if (!bonusSkills.length) {
      return {
        pass: true,
        reason: 'No bonus skills defined',
        score: WEIGHTS.bonusSkills,
      };
    }

    const overlap = bonusSkills.filter((skill) =>
      candidateSkills.includes(skill)
    );
    const threshold = Math.max(1, Math.floor(bonusSkills.length / 2));
    const pass = overlap.length >= threshold;

    return {
      pass,
      reason: pass
        ? `${overlap.length}/${bonusSkills.length} bonus skills (${overlap
            .slice(0, 2)
            .join(', ')}${overlap.length > 2 ? '...' : ''})`
        : `Only ${overlap.length}/${bonusSkills.length} bonus skills`,
      score: pass ? WEIGHTS.bonusSkills : 0,
    };
  },
};

/**
 * Calculate years of experience from work history
 */
function calculateYearsOfExperience(resume) {
  if (!resume.work || !resume.work.length) return 0;

  const totalMonths = resume.work.reduce((total, job) => {
    const startDate = job.startDate ? new Date(job.startDate) : null;
    const endDate = job.endDate ? new Date(job.endDate) : new Date();

    if (!startDate) return total;

    const months = Math.round(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    return total + months;
  }, 0);

  return Math.round(totalMonths / 12);
}

/**
 * Calculate overall match score for a candidate-job pair
 * Returns { score: 0-100, breakdown: object }
 */
export function scoreCandidateForJob(candidate, job) {
  const breakdown = {};
  let totalScore = 0;

  // Core skills check (hard gate)
  const r1 = checks.coreSkills(candidate, job);
  breakdown.coreSkills = r1;
  if (!r1.pass) {
    return { score: 0, breakdown }; // Immediate rejection
  }
  totalScore += r1.score;

  // Experience check (heavy penalty if fail)
  const r2 = checks.experience(candidate, job);
  breakdown.experience = r2;
  if (!r2.pass) {
    return { score: totalScore, breakdown }; // Likely rejection
  }
  totalScore += r2.score;

  // Work rights check (hard gate)
  const r5 = checks.workRights(candidate, job);
  breakdown.workRights = r5;
  if (!r5.pass) {
    return { score: totalScore, breakdown }; // Rejection
  }
  totalScore += r5.score;

  // Location check (can fail if remote OK)
  const r3 = checks.location(candidate, job);
  breakdown.location = r3;
  totalScore += r3.score;

  // Timezone check (only matters if location failed and remote not OK)
  if (!r3.pass) {
    const r4 = checks.timezone(candidate, job);
    breakdown.timezone = r4;
    totalScore += r4.score;
  }

  // Availability check (fail = possible match later)
  const r6 = checks.availability(candidate, job);
  breakdown.availability = r6;
  totalScore += r6.score;

  // Salary check (fail = negotiable)
  const r7 = checks.salary(candidate, job);
  breakdown.salary = r7;
  totalScore += r7.score;

  // Bonus skills check (fail = still possible match)
  const r8 = checks.bonusSkills(candidate, job);
  breakdown.bonusSkills = r8;
  totalScore += r8.score;

  return {
    score: Math.max(0, Math.min(100, totalScore)),
    breakdown,
  };
}

/**
 * Determine match outcome based on score and breakdown
 */
export function determineOutcome(scoreResult) {
  const { score, breakdown } = scoreResult;

  // Check hard gates
  if (!breakdown.coreSkills?.pass) return 'noMatch';
  if (!breakdown.experience?.pass) return 'noMatch';
  if (!breakdown.workRights?.pass) return 'noMatch';

  // Strong match: high score + all important criteria passed
  if (score >= 85 && breakdown.bonusSkills?.pass) {
    return 'strongMatch';
  }

  // Possible match: decent score but some gaps
  if (score >= 60) {
    return 'possibleMatch';
  }

  // Not a match: low score
  return 'noMatch';
}
