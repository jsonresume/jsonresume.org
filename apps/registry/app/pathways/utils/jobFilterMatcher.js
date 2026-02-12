/**
 * Shared job filtering utility.
 * Used by both useToolHandler (client hook) and JobService (Effect service).
 */
export function findMatchingJobs(criteria, jobs, jobInfo) {
  const matchingIds = [];

  for (const job of jobs) {
    const info = jobInfo[job.uuid] || {};
    let matches = true;

    // Company filter
    if (criteria.companies?.length) {
      const company = (info.company || '').toLowerCase();
      const companyMatch = criteria.companies.some((c) =>
        company.includes(c.toLowerCase())
      );
      if (!companyMatch) matches = false;
    }

    // Keywords in title, description, skills
    if (matches && criteria.keywords?.length) {
      const searchText = [
        info.title,
        info.description,
        info.skills?.map((s) => s.name || s).join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const keywordMatch = criteria.keywords.some((k) =>
        searchText.includes(k.toLowerCase())
      );
      if (!keywordMatch) matches = false;
    }

    // Industries
    if (matches && criteria.industries?.length) {
      const searchText = [info.title, info.description, info.company]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const industryMatch = criteria.industries.some((ind) =>
        searchText.includes(ind.toLowerCase())
      );
      if (!industryMatch) matches = false;
    }

    // Salary range (using normalized salary data)
    if (matches && (criteria.salaryMin || criteria.salaryMax)) {
      const salary = info.salaryUsd || info.salaryMax || info.salaryMin;
      if (salary) {
        if (criteria.salaryMin && salary < criteria.salaryMin * 1000)
          matches = false;
        if (criteria.salaryMax && salary > criteria.salaryMax * 1000)
          matches = false;
      } else {
        matches = false;
      }
    }

    // Remote only
    if (matches && criteria.remoteOnly) {
      const remote = (info.remote || '').toLowerCase();
      const location = (info.location?.city || '').toLowerCase();
      const isRemote =
        remote.includes('remote') ||
        remote.includes('full') ||
        location.includes('remote');
      if (!isRemote) matches = false;
    }

    // Job types
    if (matches && criteria.jobTypes?.length) {
      const jobType = (info.type || '').toLowerCase();
      const typeMatch = criteria.jobTypes.some((t) =>
        jobType.includes(t.toLowerCase())
      );
      if (!typeMatch) matches = false;
    }

    if (matches) {
      matchingIds.push(job.uuid);
    }
  }

  return matchingIds;
}
