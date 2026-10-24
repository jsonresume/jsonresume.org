import type { Job, JobSummary } from '@repo/api';
import type { Posting } from './posting';
import { postParagraphs } from './postText';

export interface JobRow {
  id: number;
  posting: Posting;
  postedAt: Date;
  months: number;
}

/** Models write "unspecified" or "null" for a company the post doesn't name. */
const PLACEHOLDER = /^(unspecified|unknown|null|none|n\/a|not specified|)$/i;
export const companyOf = (p: Posting) =>
  PLACEHOLDER.test(p.company.trim()) ? '' : p.company.trim();

export const placeOf = (p: Posting): string | null =>
  [p.city, p.region && p.region !== p.city ? p.region : null, p.countryCode]
    .filter(Boolean)
    .join(', ') || null;

export const toSummary = ({
  id,
  posting: p,
  postedAt,
  months,
}: JobRow): JobSummary => ({
  id,
  title: p.title,
  company: companyOf(p),
  location: placeOf(p),
  remote: p.remote,
  remoteRegions: p.remoteRegions,
  seniority: p.seniority,
  employmentType: p.employmentType,
  salary: p.salary,
  salaryMin: p.salaryMin,
  salaryMax: p.salaryMax,
  skills: p.skills.slice(0, 8).map((s) => s.name),
  postedAt: postedAt.toISOString(),
  months,
});

export const toJob = (
  row: JobRow,
  extra: { html: string; author: string; closed: boolean }
): Job => ({
  ...toSummary(row),
  summary: row.posting.summary,
  timezones: row.posting.timezones,
  visa: row.posting.visa,
  equity: row.posting.equity,
  skillDetails: row.posting.skills,
  responsibilities: row.posting.responsibilities,
  qualifications: row.posting.qualifications,
  apply: row.posting.apply,
  post: postParagraphs(extra.html),
  author: extra.author,
  closed: extra.closed,
});
