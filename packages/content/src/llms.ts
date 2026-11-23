import { facts } from './facts';
import { loadSpec, SPEC_NAMES, type SpecName } from './spec';

/** An MCP tool as llms.txt lists it (from @repo/mcp's catalog). */
export interface LlmsTool {
  name: string;
  group: string;
  description: string;
}

export interface LlmsGroup {
  key: string;
  title: string;
}

/** Up to the first full stop that ends a sentence (not "e.g." or "(...)."). */
const firstSentence = (text: string) => {
  const end = text.search(/(?<!\b(?:e\.g|i\.e|etc))[.!?](?=\s+[A-Z]|$)/);
  return end === -1 ? text : text.slice(0, end + 1);
};

const SPEC_PATHS: Record<SpecName, string> = {
  resume: '/spec',
  job: '/spec/job',
  company: '/spec/company',
};

/**
 * /llms.txt (llmstxt.org): the site in Markdown for language models and the
 * agents they drive, with what an agent needs to read and write resumes.
 * Facts come from the packages that own them.
 */
export function llmsTxt(
  site: string,
  tools: ReadonlyArray<LlmsTool>,
  groups: ReadonlyArray<LlmsGroup>
): string {
  const url = (path: string) => `${site}${path}`;
  const toolLines = groups.flatMap((group) => {
    const own = tools.filter((t) => t.group === group.key);
    return own.length === 0
      ? []
      : [
          `- ${group.title}:`,
          ...own.map(
            (t) => `  - \`${t.name}\`: ${firstSentence(t.description)}`
          ),
        ];
  });
  return [
    '# JSON Resume',
    '',
    `> JSON Resume is the open standard for resumes as JSON: one resume.json, schema version ${facts.schemaVersion}, rendered by ${facts.themeCount} open-source themes. jsonresume.org hosts resumes at /@username, matches them to Hacker News jobs, and lets agents read and write them over MCP.`,
    '',
    'Every field of a resume is optional; unknown properties are allowed, and tool data goes in `custom`. Dates are YYYY, YYYY-MM or YYYY-MM-DD. Validate against the schema before saving.',
    '',
    '## Specification',
    '',
    `- [JSON Resume specification](${url(
      '/spec'
    )}): the normative description of 1.x`,
    `- [Resume schema](${url('/schema.json')}): JSON Schema draft-07`,
    `- [Job description specification](${url(
      '/spec/job'
    )}) and [job schema](${url('/job-schema.json')})`,
    `- [Company specification](${url(
      '/spec/company'
    )}) and [company schema](${url('/company-schema.json')}) (draft)`,
    '- [Conformance suite](https://github.com/jsonresume/jsonresume.org/tree/master/packages/schema/conformance): documents with the result every implementation must give',
    `- [All three specifications in one file](${url('/llms-full.txt')})`,
    '',
    '## Resumes',
    '',
    `- Public resumes: \`${url(
      '/@{username}'
    )}\` (HTML), and the same resume as \`.json\`, \`.yaml\`, \`.txt\`, \`.pdf\`, \`.docx\` and \`.rendercv\``,
    `- [Themes](${url(
      '/themes'
    )}): add \`?theme={slug}\` to a resume URL to see it in another theme`,
    `- [Explore](${url('/explore')}): every public resume, searchable`,
    `- [Getting started](${url(
      '/getting-started'
    )}): write a resume, host it from a GitHub gist or here`,
    '',
    '## For agents',
    '',
    `- [MCP server](${url('/mcp')}): \`${url(
      '/mcp'
    )}\`, streamable HTTP. Auth: OAuth 2.1 with dynamic client registration (scope \`mcp\`), or an API key from the account's settings. Tools:`,
    ...toolLines.map((line) => `  ${line}`),
    `- [HTTP API](${url('/api/openapi.json')}): OpenAPI description`,
    `- [Sign in with JSON Resume](${url(
      '/developers'
    )}): OAuth 2.1 and OpenID Connect for apps that read or write a person's resume`,
    '',
    '## Optional',
    '',
    `- [CLI](${url('/cli')}): validate and export resumes locally`,
    `- [Theme development](${url('/theme-development')}): build a theme`,
    `- [Jobs](${url('/jobs')}): open roles from Hacker News "Who is hiring?"`,
    '',
  ].join('\n');
}

/** /llms-full.txt: the three specifications, whole, links made absolute. */
export async function llmsFullTxt(site: string): Promise<string> {
  const docs = await Promise.all(
    SPEC_NAMES.map(async (name) => ({ name, doc: await loadSpec(name) }))
  );
  return docs
    .map(({ name, doc }) =>
      [
        `# ${doc.title}`,
        '',
        `Source: ${site}${SPEC_PATHS[name]}`,
        '',
        doc.body.replace(/\]\(\//g, `](${site}/`),
      ].join('\n')
    )
    .join('\n\n---\n\n');
}
