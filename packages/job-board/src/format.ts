import type {
  EmploymentType,
  JobSummary,
  RemoteScope,
  Seniority,
} from '@repo/api';

export const remoteLabels: Record<RemoteScope, string> = {
  onsite: 'On-site',
  hybrid: 'Hybrid',
  remote_region: 'Remote',
  remote_global: 'Remote, anywhere',
  unspecified: '',
};

export const seniorityLabels: Record<Seniority, string> = {
  intern: 'Intern',
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  staff_plus: 'Staff+',
  lead_management: 'Lead / manager',
  unspecified: '',
};

export const employmentLabels: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  cofounder: 'Co-founder',
  unspecified: '',
};

/** "Remote (US, Canada)", "Hybrid", or '' when the post doesn't say. */
export const remoteText = (job: Pick<JobSummary, 'remote' | 'remoteRegions'>) =>
  job.remote === 'remote_region' && job.remoteRegions.length > 0
    ? `Remote (${job.remoteRegions.join(', ')})`
    : remoteLabels[job.remote];

const thousands = (n: number) =>
  n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;

/** "$150k–$200k" from the stated numbers, else the post's own words. */
export const salaryText = (
  job: Pick<JobSummary, 'salary' | 'salaryMin' | 'salaryMax'>
): string | null => {
  const { salaryMin: min, salaryMax: max } = job;
  if (min !== null && max !== null && min !== max) {
    return `${thousands(min)}–${thousands(max)}`;
  }
  if (min !== null || max !== null) return thousands(min ?? max ?? 0);
  return job.salary && job.salary.length <= 40 ? job.salary : null;
};

const DAY = 86_400_000;

/** "Today", "3 days ago", "Sep 2": how long a post has been up. */
export const postedText = (iso: string, now = Date.now()) => {
  const days = Math.floor((now - new Date(iso).getTime()) / DAY);
  if (days < 1) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

/** "Posted 4 months running", for a role reposted each month. */
export const monthsText = (months: number) =>
  months > 1 ? `Posted ${months} months running` : null;

/** The HN discussion for a post. */
export const hnUrl = (id: number) =>
  `https://news.ycombinator.com/item?id=${id}`;
