import { EmploymentType, RemoteScope, Seniority } from '@repo/api';
import { Schema } from 'effect';

const Text = Schema.NullOr(Schema.String);

export const Visa = Schema.Literals(['yes', 'no', 'unspecified']);

export const Skill = Schema.Struct({
  name: Schema.String,
  keywords: Schema.Array(Schema.String),
});

/**
 * One job post, structured: what the parser asks the model for and what
 * app.jobs.parsed holds. Every field is required (nullable when the post
 * doesn't say), as OpenAI's strict structured output wants.
 */
export const Posting = Schema.Struct({
  title: Schema.String,
  company: Schema.String,
  /** Two or three sentences on the role and the company. */
  summary: Schema.String,
  city: Text,
  region: Text,
  /** ISO 3166-1 alpha-2. */
  countryCode: Text,
  remote: RemoteScope,
  /** Where remote work is allowed, when geo-fenced: ["US"], ["EU"]. */
  remoteRegions: Schema.Array(Schema.String),
  timezones: Text,
  seniority: Seniority,
  employmentType: EmploymentType,
  /** The pay as the post words it. */
  salary: Text,
  /** Annual USD, only from numbers the post states. */
  salaryMin: Schema.NullOr(Schema.Number),
  salaryMax: Schema.NullOr(Schema.Number),
  visa: Visa,
  equity: Text,
  skills: Schema.Array(Skill),
  responsibilities: Schema.Array(Schema.String),
  qualifications: Schema.Array(Schema.String),
  /** A URL or email to apply at, when the post gives one. */
  apply: Text,
});
export type Posting = typeof Posting.Type;

export const decodePosting = Schema.decodeUnknownOption(Posting);

const remoteLabel: Record<typeof RemoteScope.Type, string> = {
  onsite: 'On-site',
  hybrid: 'Hybrid',
  remote_region: 'Remote',
  remote_global: 'Remote, anywhere',
  unspecified: '',
};

/**
 * The text a posting is embedded from, and what a resume is compared
 * against. Built from the parsed fields, never model prose: the old
 * pipeline embedded a generated description that, for a year, was the
 * model asking for the job text.
 */
export const embeddingText = (p: Posting): string =>
  [
    `${p.title} at ${p.company}`,
    [p.seniority, p.employmentType]
      .filter((v) => v !== 'unspecified')
      .join(', '),
    [remoteLabel[p.remote], p.remoteRegions.join(', ')]
      .filter(Boolean)
      .join(': '),
    [p.city, p.region, p.countryCode].filter(Boolean).join(', '),
    p.summary,
    p.skills.map((s) => `${s.name}: ${s.keywords.join(', ')}`).join('\n'),
    p.responsibilities.join('\n'),
    p.qualifications.join('\n'),
  ]
    .filter(Boolean)
    .join('\n');
