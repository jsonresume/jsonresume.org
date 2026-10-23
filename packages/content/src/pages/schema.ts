/** Copy for the two schema reference pages. Facts checked against packages/schema. */

const raw =
  'https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema';
const tree =
  'https://github.com/jsonresume/jsonresume.org/tree/master/packages/schema';

export const resumeSchema = {
  file: 'resume.json',
  schemaUrl: `${raw}/schema.json`,
  source: `${tree}`,
  npm: 'https://www.npmjs.com/package/@jsonresume/schema',
  principles: [
    {
      title: 'Every field is optional',
      body: 'Include what you have. Tools skip what is missing, so a resume can be a name or a career.',
    },
    {
      title: 'Plain JSON Schema',
      body: 'Draft-07 JSON Schema, so any language or editor can validate it. Dates are ISO 8601, URLs are URLs.',
    },
    {
      title: 'Extend without forking',
      body: 'Put anything the schema lacks in a `custom` object, at the root, in basics or on any entry.',
    },
  ],
  validate: [
    { label: 'CLI', code: 'resume validate' },
    {
      label: 'Node.js',
      code: "import { validate } from '@jsonresume/schema';\n\nvalidate(resume, (errors, valid) => {\n  if (!valid) console.error(errors);\n});",
    },
    { label: 'Editors', code: `{\n  "$schema": "${raw}/schema.json"\n}` },
  ],
};

export const jobSchema = {
  file: 'job.json',
  schemaUrl: `${raw}/job-schema.json`,
  source: `${tree}`,
  intro:
    'A standard shape for job descriptions: title, company, location, salary, responsibilities and the skills it asks for. Postings stay consistent wherever they are published, and can be matched against resumes.',
  llm: 'Models already know both schemas, so asking one to turn a job posting or a resume into JSON that validates works well.',
};
