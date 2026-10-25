import type { Card, Step, UserPath } from './types';

/** Resumes are hosted at jsonresume.org/@username (the registry moved here). */
const site = 'https://jsonresume.org';

/** The three ways in, shown first so people pick one. */
export const paths: Card[] = [
  {
    eyebrow: 'No install',
    title: 'Host it from a Gist',
    description:
      'Save resume.json as a GitHub Gist and it is live at jsonresume.org/@you, in any theme.',
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
    body: 'Start from the [example](/schema) or the [online editor](/dashboard/editor). Every field is optional.',
  },
  {
    title: 'Save it as a Gist',
    body: 'Create a public [GitHub Gist](https://gist.github.com) with one file named `resume.json`.',
  },
  {
    title: 'Open your page',
    body: 'Your resume is live at jsonresume.org/@you. It updates whenever you edit the Gist.',
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

/** Your resume in other formats. */
export const rawFormats: {
  label: string;
  description: string;
  path: UserPath;
}[] = [
  {
    label: 'PDF',
    description:
      'Your page printed, in any theme: add ?theme= and ?paper=letter.',
    path: (u) => `${site}/@${u}.pdf`,
  },
  {
    label: 'JSON',
    description: 'The data, as stored in your Gist.',
    path: (u) => `${site}/@${u}.json`,
  },
  {
    label: 'YAML',
    description: 'The same data as YAML.',
    path: (u) => `${site}/@${u}.yaml`,
  },
  {
    label: 'Text',
    description: 'Plain text, for forms and email.',
    path: (u) => `${site}/@${u}.txt`,
  },
  {
    label: 'RenderCV',
    description:
      'A RenderCV input file: run rendercv render on it for a typeset PDF.',
    path: (u) => `${site}/@${u}.rendercv`,
  },
  {
    label: 'QR code',
    description: 'A code that opens your page, for printed resumes and slides.',
    path: (u) => `${site}/@${u}.qr`,
  },
  {
    label: 'Timeline',
    description: 'Every role, school and project in order.',
    path: (u) => `${site}/@${u}/timeline`,
  },
];

export const resumeUrl: UserPath = (u) => `${site}/@${u}`;
export const themedUrl = (u: string, theme: string) =>
  `${site}/@${u}?theme=${theme}`;
/** Another file in the same Gist, e.g. resume-fr.json. */
export const gistFileUrl = (u: string, file: string) =>
  `${site}/@${u}?gistname=${file}`;

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
