import { Schema } from 'effect';

/** The fixed terms a job post is filed under (job-schema facets, #353). */
export const RemoteScope = Schema.Literals([
  'onsite',
  'hybrid',
  'remote_region',
  'remote_global',
  'unspecified',
]);
export type RemoteScope = typeof RemoteScope.Type;

export const Seniority = Schema.Literals([
  'intern',
  'junior',
  'mid',
  'senior',
  'staff_plus',
  'lead_management',
  'unspecified',
]);
export type Seniority = typeof Seniority.Type;

export const EmploymentType = Schema.Literals([
  'full_time',
  'part_time',
  'contract',
  'internship',
  'cofounder',
  'unspecified',
]);
export type EmploymentType = typeof EmploymentType.Type;
