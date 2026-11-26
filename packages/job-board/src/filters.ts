import type { JobSummary, Seniority } from '@repo/api';

/** Where the work happens, as the filter offers it. */
export type WhereFilter = 'remote' | 'anywhere' | 'onsite';

export interface JobFilters {
  query: string;
  where: WhereFilter | null;
  seniority: Seniority | null;
  /** Least annual pay in USD; jobs that state none are left out. */
  minSalary: number | null;
}

export const noFilters: JobFilters = {
  query: '',
  where: null,
  seniority: null,
  minSalary: null,
};

const matchesWhere = (job: JobSummary, where: WhereFilter | null) => {
  switch (where) {
    case null:
      return true;
    case 'remote':
      return job.remote === 'remote_region' || job.remote === 'remote_global';
    case 'anywhere':
      return job.remote === 'remote_global';
    case 'onsite':
      return job.remote === 'onsite' || job.remote === 'hybrid';
  }
};

const haystack = (job: JobSummary) =>
  [
    job.title,
    job.company,
    job.location ?? '',
    ...job.skills,
    ...job.remoteRegions,
  ]
    .join(' ')
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter(Boolean);

/**
 * Jobs matching every filter. Each search word must start a word of the
 * job's title, company, place or skills ("us" finds US, not Rust), so a
 * half-typed word already finds something. Jobs where every word is whole
 * come first ("java" lists Java jobs before JavaScript ones), each group
 * in the board's own order.
 */
export const filterJobs = <J extends JobSummary>(
  jobs: ReadonlyArray<J>,
  filters: JobFilters
): J[] => {
  const words = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  const whole: J[] = [];
  const started: J[] = [];
  for (const job of jobs) {
    if (!matchesWhere(job, filters.where)) continue;
    if (filters.seniority && job.seniority !== filters.seniority) continue;
    if (filters.minSalary !== null) {
      const top = job.salaryMax ?? job.salaryMin;
      if (top === null || top < filters.minSalary) continue;
    }
    const text = haystack(job);
    if (!words.every((word) => text.some((w) => w.startsWith(word)))) continue;
    (words.every((word) => text.includes(word)) ? whole : started).push(job);
  }
  return [...whole, ...started];
};
