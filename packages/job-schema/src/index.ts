import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { JsonSchema7Type } from 'zod-to-json-schema';

export const JOB_DESCRIPTION_SCHEMA_ID =
  'https://jsonresume.org/schema/job-description';
export const JOB_DESCRIPTION_SCHEMA_VERSION = '1.0.0';

const optionalText = z.string().trim().min(1).optional();

const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .optional();

const locationSchema = z
  .object({
    address: optionalText,
    postalCode: optionalText,
    city: optionalText,
    countryCode: optionalText,
    region: optionalText,
  })
  .strip();

const skillSchema = z
  .object({
    name: optionalText,
    level: optionalText,
    keywords: z.array(z.string().trim().min(1)).min(1).optional(),
  })
  .strip();

const arrayOfStrings = z.array(z.string().trim().min(1)).min(1);

export const jobDescriptionSchema = z
  .object({
    title: optionalText,
    company: optionalText,
    companyDescription: optionalText,
    department: optionalText,
    companyContext: optionalText,
    location: locationSchema.optional(),
    position: optionalText,
    type: optionalText,
    salary: optionalText,
    compensation: z
      .object({
        currency: optionalText,
        interval: optionalText,
        minimum: z.number().positive().optional(),
        maximum: z.number().positive().optional(),
      })
      .strip()
      .optional(),
    date: optionalText,
    remote: optionalText,
    url: optionalUrl,
    applicationUrl: optionalUrl,
    applicationEmail: optionalText,
    contact: optionalText,
    description: optionalText,
    responsibilities: arrayOfStrings.optional(),
    qualifications: arrayOfStrings.optional(),
    skills: z.array(skillSchema).min(1).optional(),
    experience: optionalText,
    education: optionalText,
    benefits: arrayOfStrings.optional(),
    metadata: z.record(z.unknown()).optional(),
    schemaVersion: z.string().trim().optional(),
  })
  .strip()
  .describe('JSON Resume job description schema');

export type JobDescription = z.infer<typeof jobDescriptionSchema>;

const baseJsonSchema = zodToJsonSchema(jobDescriptionSchema, {
  name: 'JobDescription',
  target: 'jsonSchema7',
}) as JsonSchema7Type & Record<string, unknown>;

baseJsonSchema.$schema =
  (baseJsonSchema as Record<string, unknown>).$schema ??
  'https://json-schema.org/draft/2020-12/schema';
baseJsonSchema.$id = JOB_DESCRIPTION_SCHEMA_ID;
baseJsonSchema.title = baseJsonSchema.title ?? 'Job Description';
baseJsonSchema.description =
  baseJsonSchema.description ??
  'Structured representation of a job description used by JSON Resume.';
(baseJsonSchema as Record<string, unknown>).$comment = JOB_DESCRIPTION_SCHEMA_VERSION;

export const jobDescriptionJsonSchema = baseJsonSchema;

export const sampleJobDescription: JobDescription = {
  title: 'Senior Web Developer',
  company: 'JSON Resume',
  companyDescription:
    'An open-source initiative building interoperable resume tooling.',
  department: 'Engineering',
  location: {
    address: '123 Open Source Lane',
    city: 'Internet City',
    region: 'Remote',
    countryCode: 'US',
  },
  type: 'Full-time',
  salary: '$120,000 - $150,000',
  remote: 'Remote-friendly',
  date: '2025-10-01',
  url: 'https://jsonresume.org',
  applicationUrl: 'https://jsonresume.org/careers',
  description:
    'Lead the development of resume tooling and schema standards within the JSON Resume ecosystem.',
  responsibilities: [
    'Design and implement new features for the JSON Resume registry',
    'Collaborate with the community on schema improvements',
    'Maintain high-quality documentation and developer experience',
  ],
  qualifications: [
    '5+ years building JavaScript or TypeScript applications',
    'Experience with schema design or API governance',
    'Strong communication and mentoring skills',
  ],
  skills: [
    {
      name: 'Web Development',
      level: 'Expert',
      keywords: ['TypeScript', 'Next.js', 'Vercel', 'GraphQL'],
    },
    {
      name: 'Community',
      level: 'Advanced',
      keywords: ['Open source', 'Documentation', 'Schema Design'],
    },
  ],
  experience: 'Senior level',
  education: 'Computer Science degree or equivalent experience',
  benefits: ['Remote-first', 'Open source impact', 'Flexible schedule'],
  metadata: {
    schemaVersion: JOB_DESCRIPTION_SCHEMA_VERSION,
  },
  schemaVersion: JOB_DESCRIPTION_SCHEMA_VERSION,
};

export function parseJobDescription(data: unknown): JobDescription {
  return jobDescriptionSchema.parse(data);
}

export function validateJobDescription(data: unknown):
  | { success: true; data: JobDescription }
  | { success: false; errors: string[] } {
  const result = jobDescriptionSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join('.') || 'root';
    return `${path}: ${issue.message}`;
  });

  return { success: false, errors };
}

export const jobDescriptionTool = {
  description:
    'Parses unstructured job descriptions into the JSON Resume Job Description schema.',
  parameters: jobDescriptionSchema,
};
