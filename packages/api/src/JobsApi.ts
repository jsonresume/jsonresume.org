import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';
import { JobNotFound, NoResume } from './errors';
import { CareerTree } from './CareerTree';

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

/** What a signed-in user said about a job. */
export const JobMark = Schema.Literals([
  'interested',
  'maybe',
  'applied',
  'not_interested',
]);
export type JobMark = typeof JobMark.Type;

/** A job as lists show it. */
export const JobSummary = Schema.Struct({
  /** The Hacker News item id of the post. */
  id: Schema.Number,
  title: Schema.String,
  /** Empty when the post doesn't name the company. */
  company: Schema.String,
  /** "Berlin, DE", or null when the post names no place. */
  location: Schema.NullOr(Schema.String),
  remote: RemoteScope,
  remoteRegions: Schema.Array(Schema.String),
  seniority: Seniority,
  employmentType: EmploymentType,
  /** The pay as the post words it. */
  salary: Schema.NullOr(Schema.String),
  /** Annual USD, from numbers the post states. */
  salaryMin: Schema.NullOr(Schema.Number),
  salaryMax: Schema.NullOr(Schema.Number),
  skills: Schema.Array(Schema.String),
  postedAt: Schema.String,
  /** How many monthly threads this company has posted the role in. */
  months: Schema.Number,
});
export type JobSummary = typeof JobSummary.Type;

/** One job in full: the structured posting and the post itself. */
export const Job = Schema.Struct({
  ...JobSummary.fields,
  summary: Schema.String,
  timezones: Schema.NullOr(Schema.String),
  visa: Schema.Literals(['yes', 'no', 'unspecified']),
  equity: Schema.NullOr(Schema.String),
  skillDetails: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      keywords: Schema.Array(Schema.String),
    })
  ),
  responsibilities: Schema.Array(Schema.String),
  qualifications: Schema.Array(Schema.String),
  apply: Schema.NullOr(Schema.String),
  /** The post's text, as paragraphs. */
  post: Schema.Array(Schema.String),
  author: Schema.String,
  /** True when the post is older than the board's window or was removed. */
  closed: Schema.Boolean,
});
export type Job = typeof Job.Type;

export const JobBoard = Schema.Struct({
  jobs: Schema.Array(JobSummary),
  /** The newest "Who is hiring?" thread imported. */
  thread: Schema.NullOr(
    Schema.Struct({ id: Schema.Number, title: Schema.String })
  ),
});
export type JobBoard = typeof JobBoard.Type;

export const JobMatch = Schema.Struct({
  ...JobSummary.fields,
  /** How well the job fits the resume, 0 to 100. */
  score: Schema.Number,
  mark: Schema.NullOr(JobMark),
  /** The role in the post that fits best (posts can list several), once judged. */
  role: Schema.optional(Schema.NullOr(Schema.String)),
  /** Why it fits, or doesn't, in a few words, once judged. */
  why: Schema.optional(Schema.NullOr(Schema.String)),
});
export type JobMatch = typeof JobMatch.Type;

/** A kind of role the resume could move into, from the open jobs that fit it. */
export const Direction = Schema.Struct({
  /** e.g. "Founding engineer", "Engineering leadership". */
  name: Schema.String,
  /** Open jobs of this kind among the best fits. */
  jobs: Schema.Number,
  bestFit: Schema.Number,
  typicalFit: Schema.Number,
  /** Annual USD, of the jobs that state pay. */
  medianPay: Schema.NullOr(Schema.Number),
  /** Percent of these jobs that are remote. */
  remoteShare: Schema.Number,
  /** The skills these jobs ask for most. */
  skillsAsked: Schema.Array(Schema.String),
  /** Of those, the ones the resume doesn't show. */
  skillsToAdd: Schema.Array(Schema.String),
  companies: Schema.Array(Schema.String),
  /** The best-fitting jobs of this kind. */
  examples: Schema.Array(JobMatch),
});
export type Direction = typeof Direction.Type;

/** How the import pipeline is doing, for monitoring. */
export const JobsStatus = Schema.Struct({
  lastRun: Schema.NullOr(
    Schema.Struct({
      startedAt: Schema.String,
      finishedAt: Schema.NullOr(Schema.String),
      ok: Schema.NullOr(Schema.Boolean),
      stats: Schema.Record(Schema.String, Schema.Number),
      error: Schema.NullOr(Schema.String),
    })
  ),
  lastSuccessAt: Schema.NullOr(Schema.String),
  /** Jobs on the board now. */
  open: Schema.Number,
  /** Posts imported but not yet parsed or embedded. */
  pending: Schema.Number,
});
export type JobsStatus = typeof JobsStatus.Type;

/** The job board, open to everyone. */
export class JobsApi extends HttpApiGroup.make('jobs')
  .add(
    HttpApiEndpoint.get('board', '/', { success: JobBoard }),
    HttpApiEndpoint.get('status', '/status', { success: JobsStatus }),
    HttpApiEndpoint.get('job', '/:id', {
      params: { id: Schema.NumberFromString },
      success: Job,
      error: JobNotFound,
    })
  )
  .prefix('/jobs') {}

/** Jobs matched to the signed-in user's resume, and their marks. */
export class MyJobsApi extends HttpApiGroup.make('myJobs')
  .add(
    HttpApiEndpoint.get('matches', '/', {
      success: Schema.Array(JobMatch),
      error: NoResume,
    }),
    HttpApiEndpoint.get('directions', '/directions', {
      success: Schema.Array(Direction),
      error: NoResume,
    }),
    HttpApiEndpoint.get('tree', '/tree', {
      success: CareerTree,
      error: NoResume,
    }),
    HttpApiEndpoint.put('mark', '/:id', {
      params: { id: Schema.NumberFromString },
      payload: Schema.Struct({ mark: Schema.NullOr(JobMark) }),
      error: JobNotFound,
    })
  )
  .middleware(Authentication)
  .prefix('/me/jobs') {}
