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
 * job's title, company, place or skills ("us" finds US, not Rust).
 */
export const filterJobs = <J extends JobSummary>(
  jobs: ReadonlyArray<J>,
  filters: JobFilters
): J[] => {
  const words = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  return jobs.filter((job) => {
    if (!matchesWhere(job, filters.where)) return false;
    if (filters.seniority && job.seniority !== filters.seniority) return false;
    if (filters.minSalary !== null) {
      const top = job.salaryMax ?? job.salaryMin;
      if (top === null || top < filters.minSalary) return false;
    }
    if (words.length === 0) return true;
    const text = haystack(job);
    return words.every((word) => text.some((w) => w.startsWith(word)));
  });
};
