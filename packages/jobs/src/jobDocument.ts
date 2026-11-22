import type { JobDocument } from '@repo/api';
import { companyOf, type JobRow, titleOf } from './summary';

const SCHEMA =
  'https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/job-schema.json';

const remote = {
  onsite: 'None',
  hybrid: 'Hybrid',
  remote_region: 'Full',
  remote_global: 'Full',
} as const;

const employment = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  cofounder: 'Cofounder',
} as const;

const level = {
  intern: 'Intern',
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  staff_plus: 'Staff+',
  lead_management: 'Lead or management',
} as const;

const some = (v: string | null | undefined) =>
  v?.trim() ? v.trim() : undefined;

/** Drops keys whose value is undefined, so optional fields are absent. */
const present = <T extends object>(o: T): T =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;

/**
 * A board job as a job-schema v1 document (#353). Pay stays the post's
 * words in `salary`: the board's annual USD figures are converted, so they
 * are derived data and left out, as the schema decision says.
 */
export const toJobDocument = (
  { id, posting: p, postedAt }: JobRow,
  canonical: string
): JobDocument => {
  const location = present({
    city: some(p.city),
    region: some(p.region),
    countryCode: some(p.countryCode),
  });
  return present({
    $schema: SCHEMA,
    title: some(titleOf(p)),
    company: some(companyOf(p)),
    type:
      p.employmentType === 'unspecified'
        ? undefined
        : employment[p.employmentType],
    date: postedAt.toISOString().slice(0, 10),
    description: some(p.summary),
    location: Object.keys(location).length > 0 ? location : undefined,
    remote: p.remote === 'unspecified' ? undefined : remote[p.remote],
    salary: some(p.salary),
    experience: p.seniority === 'unspecified' ? undefined : level[p.seniority],
    facets: present({
      remoteScope: p.remote,
      remoteRegions: p.remoteRegions.length > 0 ? p.remoteRegions : undefined,
      timezoneRange: some(p.timezones),
      seniority: p.seniority,
      employmentType: p.employmentType,
      visaSponsorship: p.visa,
      salaryProvenance:
        some(p.salary) || p.salaryMin !== null ? 'stated' : 'absent',
    }),
    responsibilities: p.responsibilities,
    qualifications: p.qualifications,
    skills: p.skills.map((s) => ({ name: s.name, keywords: [...s.keywords] })),
    meta: { canonical, lastModified: postedAt.toISOString() },
  });
};
