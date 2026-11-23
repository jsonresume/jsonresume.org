import type { Doc } from '@repo/domain';

/**
 * The format's specifications, read from @jsonresume/schema (the files the
 * npm package ships) so the site and the package never disagree.
 */
const sources = {
  resume: () => import('@jsonresume/schema/SPEC.md?raw'),
  job: () => import('@jsonresume/schema/JOB-SPEC.md?raw'),
  company: () => import('@jsonresume/schema/COMPANY-SPEC.md?raw'),
} as const;

export type SpecName = keyof typeof sources;
export const SPEC_NAMES = Object.keys(sources) as ReadonlyArray<SpecName>;

const REPO = 'https://github.com/jsonresume/jsonresume.org/blob/master';

/** Where the specs' relative links go on the site, or on GitHub. */
const LINKS: Record<string, string> = {
  'SPEC.md': '/spec',
  'JOB-SPEC.md': '/spec/job',
  'COMPANY-SPEC.md': '/spec/company',
  'schema.json': '/schema.json',
  'job-schema.json': '/job-schema.json',
  'company-schema.json': '/company-schema.json',
  'DECISIONS.md': `${REPO}/packages/schema/DECISIONS.md`,
  'conformance/README.md': `${REPO.replace(
    '/blob/',
    '/tree/'
  )}/packages/schema/conformance`,
  '../types': `${REPO}/packages/types`,
  '../core-rust': `${REPO}/packages/core-rust`,
  '../../CONTRIBUTING.md': `${REPO}/CONTRIBUTING.md`,
};

const META: Record<SpecName, { title: string; description: string }> = {
  resume: {
    title: 'JSON Resume specification',
    description:
      'The normative description of JSON Resume 1.x: conforming documents, every field, extension, and what producers and consumers must do.',
  },
  job: {
    title: 'Job description specification',
    description:
      'The normative description of job.json, the JSON Resume format for job postings: every field and how to use it.',
  },
  company: {
    title: 'Company specification',
    description:
      'The draft description of company.json, the JSON Resume format for companies that hire, matched to jobs by website.',
  },
};

/** The spec as the site shows it: no repeated title, links that resolve. */
export const toSiteMarkdown = (markdown: string) =>
  markdown
    .replace(/^# .*\n+/, '')
    .replace(/\]\(([^)#\s]+)(#[^)\s]*)?\)/g, (whole, target: string, hash) => {
      const to = LINKS[target];
      return to === undefined ? whole : `](${to}${hash ?? ''})`;
    });

/** One specification as a document page. */
export async function loadSpec(name: SpecName): Promise<Doc> {
  const { default: markdown } = await sources[name]();
  return {
    ...META[name],
    slug: name === 'resume' ? 'spec' : `spec-${name}`,
    body: toSiteMarkdown(markdown),
  };
}

/** The machine-readable definitions, as the package ships them. */
const schemaSources = {
  '/schema.json': () => import('@jsonresume/schema/schema.json?raw'),
  '/job-schema.json': () => import('@jsonresume/schema/job-schema.json?raw'),
  '/company-schema.json': () =>
    import('@jsonresume/schema/company-schema.json?raw'),
} as const;

export const SCHEMA_PATHS = Object.keys(schemaSources) as ReadonlyArray<
  keyof typeof schemaSources
>;

/** A schema file's text, served at its path on the site. */
export const loadSchemaFile = async (path: keyof typeof schemaSources) =>
  (await schemaSources[path]()).default;
