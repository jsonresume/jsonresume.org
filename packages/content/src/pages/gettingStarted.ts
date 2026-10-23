import type { Card, Step, UserPath } from './types';

const registry = 'https://registry.jsonresume.org';

/** The three ways in, shown first so people pick one. */
export const paths: Card[] = [
  {
    eyebrow: 'No install',
    title: 'Host it from a Gist',
    description:
      'Save resume.json as a GitHub Gist and it is live on the registry, in any theme.',
    href: '#gist',
  },
  {
    eyebrow: 'Terminal',
    title: 'Use the CLI',
    description:
      'Create, validate, preview and export to PDF, HTML, Markdown or text.',
    href: '#cli',
  },
  {
    eyebrow: 'Bring your data',
    title: 'Import what you have',
    description:
      'Start from LinkedIn, or take your resume to LaTeX or YAML tools.',
    href: '#import',
  },
];

export const gistSteps: Step[] = [
  {
    title: 'Write resume.json',
    body: 'Start from the [example](/schema) or the [online editor](https://registry.jsonresume.org/editor). Every field is optional.',
  },
  {
    title: 'Save it as a Gist',
    body: 'Create a public [GitHub Gist](https://gist.github.com) with one file named `resume.json`.',
  },
  {
    title: 'Open your page',
    body: 'Your resume is live at your registry address. It updates whenever you edit the Gist.',
  },
  {
    title: 'Pick a theme',
    body: 'Add the theme to your file, or try any theme in the URL with `?theme=`.',
    code: '{ "meta": { "theme": "elegant" } }',
  },
];

export const cliSteps: Step[] = [
  {
    title: 'Create a resume',
    body: 'Writes a starter `resume.json` in the current folder.',
    code: 'resume init',
  },
  {
    title: 'Check it',
    body: 'Validates the file against the schema.',
    code: 'resume validate',
  },
  {
    title: 'Preview and export',
    body: 'Serve it locally while you edit, then export with any theme.',
    code: 'resume serve\nresume export resume.pdf --theme even',
  },
];

/** Your resume in other formats, from the registry. */
export const rawFormats: {
  label: string;
  description: string;
  path: UserPath;
}[] = [
  {
    label: 'JSON',
    description: 'The data, as stored in your Gist.',
    path: (u) => `${registry}/${u}.json`,
  },
  {
    label: 'YAML',
    description: 'The same data as YAML.',
    path: (u) => `${registry}/${u}.yaml`,
  },
  {
    label: 'Text',
    description: 'Plain text, for forms and email.',
    path: (u) => `${registry}/${u}.txt`,
  },
  {
    label: 'RenderCV',
    description: 'For LaTeX output with RenderCV.',
    path: (u) => `${registry}/${u}.rendercv`,
  },
  {
    label: 'QR code',
    description: 'A PNG that links to your resume.',
    path: (u) => `${registry}/${u}.qr`,
  },
];

export const registryUrl: UserPath = (u) => `${registry}/${u}`;
export const themedUrl = (u: string, theme: string) =>
  `${registry}/${u}?theme=${theme}`;
/** Another file in the same Gist, e.g. resume-fr.json. */
export const gistFileUrl = (u: string, file: string) =>
  `${registry}/${u}?gistname=${file}`;

export const importTools: (Card & { code?: string })[] = [
  {
    eyebrow: 'From LinkedIn',
    title: 'JSON Resume Exporter',
    description:
      'A community Chrome extension that turns your LinkedIn profile into resume.json.',
    href: 'https://chromewebstore.google.com/detail/json-resume-exporter/caobgmmcpklomkcckaenhjlokpmfbdec',
  },
  {
    eyebrow: 'To LaTeX',
    title: 'RenderCV',
    description:
      'Typeset a PDF with LaTeX. Convert your resume.json, then render.',
    href: 'https://github.com/rendercv/rendercv',
    code: 'npx @jsonresume/jsonresume-to-rendercv resume.json\nrendercv render resume.yaml',
  },
  {
    eyebrow: 'To YAML',
    title: 'YAMLResume',
    description:
      'Keep your resume in YAML and build LaTeX PDFs. Imports JSON Resume (Node.js 22+).',
    href: 'https://yamlresume.dev',
    code: 'npx json2yamlresume resume.json',
  },
];

export const video = {
  title: 'Watch the walkthrough',
  href: 'https://www.youtube.com/watch?v=BxpHgNM0clE',
};

export const ownRepoExample = 'https://github.com/thomasdavis/resume';
