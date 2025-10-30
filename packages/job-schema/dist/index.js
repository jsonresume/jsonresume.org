"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobDescriptionTool = exports.sampleJobDescription = exports.jobDescriptionJsonSchema = exports.jobDescriptionSchema = exports.JOB_DESCRIPTION_SCHEMA_VERSION = exports.JOB_DESCRIPTION_SCHEMA_ID = void 0;
exports.parseJobDescription = parseJobDescription;
exports.validateJobDescription = validateJobDescription;
const zod_1 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
exports.JOB_DESCRIPTION_SCHEMA_ID = 'https://jsonresume.org/schema/job-description';
exports.JOB_DESCRIPTION_SCHEMA_VERSION = '1.0.0';
const optionalText = zod_1.z.string().trim().min(1).optional();
const optionalUrl = zod_1.z
    .string()
    .trim()
    .url('Must be a valid URL')
    .optional();
const locationSchema = zod_1.z
    .object({
    address: optionalText,
    postalCode: optionalText,
    city: optionalText,
    countryCode: optionalText,
    region: optionalText,
})
    .strip();
const skillSchema = zod_1.z
    .object({
    name: optionalText,
    level: optionalText,
    keywords: zod_1.z.array(zod_1.z.string().trim().min(1)).min(1).optional(),
})
    .strip();
const arrayOfStrings = zod_1.z.array(zod_1.z.string().trim().min(1)).min(1);
exports.jobDescriptionSchema = zod_1.z
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
    compensation: zod_1.z
        .object({
        currency: optionalText,
        interval: optionalText,
        minimum: zod_1.z.number().positive().optional(),
        maximum: zod_1.z.number().positive().optional(),
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
    skills: zod_1.z.array(skillSchema).min(1).optional(),
    experience: optionalText,
    education: optionalText,
    benefits: arrayOfStrings.optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    schemaVersion: zod_1.z.string().trim().optional(),
})
    .strip()
    .describe('JSON Resume job description schema');
const baseJsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(exports.jobDescriptionSchema, {
    name: 'JobDescription',
    target: 'jsonSchema7',
});
baseJsonSchema.$schema =
    (_a = baseJsonSchema.$schema) !== null && _a !== void 0 ? _a : 'https://json-schema.org/draft/2020-12/schema';
baseJsonSchema.$id = exports.JOB_DESCRIPTION_SCHEMA_ID;
baseJsonSchema.title = (_b = baseJsonSchema.title) !== null && _b !== void 0 ? _b : 'Job Description';
baseJsonSchema.description =
    (_c = baseJsonSchema.description) !== null && _c !== void 0 ? _c : 'Structured representation of a job description used by JSON Resume.';
baseJsonSchema.$comment = exports.JOB_DESCRIPTION_SCHEMA_VERSION;
exports.jobDescriptionJsonSchema = baseJsonSchema;
exports.sampleJobDescription = {
    title: 'Senior Web Developer',
    company: 'JSON Resume',
    companyDescription: 'An open-source initiative building interoperable resume tooling.',
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
    description: 'Lead the development of resume tooling and schema standards within the JSON Resume ecosystem.',
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
        schemaVersion: exports.JOB_DESCRIPTION_SCHEMA_VERSION,
    },
    schemaVersion: exports.JOB_DESCRIPTION_SCHEMA_VERSION,
};
function parseJobDescription(data) {
    return exports.jobDescriptionSchema.parse(data);
}
function validateJobDescription(data) {
    const result = exports.jobDescriptionSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    const errors = result.error.issues.map((issue) => {
        const path = issue.path.join('.') || 'root';
        return `${path}: ${issue.message}`;
    });
    return { success: false, errors };
}
exports.jobDescriptionTool = {
    description: 'Parses unstructured job descriptions into the JSON Resume Job Description schema.',
    parameters: exports.jobDescriptionSchema,
};
