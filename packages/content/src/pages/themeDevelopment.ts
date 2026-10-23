import type { Card, Step } from './types';

export const contract = `// index.js of jsonresume-theme-yourname
export const render = (resume) => \`<!doctype html>
<html>
  <head><style>body { font-family: system-ui; }</style></head>
  <body>
    <h1>\${resume.basics?.name ?? ''}</h1>
    <p>\${resume.basics?.label ?? ''}</p>
  </body>
</html>\`;`;

export const themeSteps: Step[] = [
  {
    title: 'Name the package',
    body: 'Create an npm package called `jsonresume-theme-{name}`. The name is how tools find it.',
    code: 'mkdir jsonresume-theme-yourname && cd jsonresume-theme-yourname\nnpm init -y',
  },
  {
    title: 'Export render',
    body: 'Export a function `render(resume)` that returns a string, usually a complete HTML document.',
  },
  {
    title: 'Preview it',
    body: 'Run the CLI against your folder; it reloads as you edit.',
    code: 'resume serve --theme .',
  },
  {
    title: 'Publish',
    body: 'Publish to npm. People install it next to the CLI and export with `--theme yourname`.',
    code: 'npm publish',
  },
];

/** What a theme must do to work with the CLI and the registry. */
export const rules: { label: string; detail: string }[] = [
  {
    label: 'Return a string',
    detail: 'render takes the resume object and returns HTML.',
  },
  {
    label: 'Stay pure',
    detail:
      'No disk or network access, so no fs or http, and nothing that imports them.',
  },
  {
    label: 'Inline everything',
    detail: 'CSS and assets go in the output; images as base64 data URLs.',
  },
  {
    label: 'Handle missing fields',
    detail:
      'Every schema field is optional; render sparse resumes without errors.',
  },
  {
    label: 'Build however you like',
    detail: 'Templates, React, plain strings: the theme owns its build.',
  },
];

export const exampleThemes: Card[] = [
  {
    eyebrow: 'Start here',
    title: 'Reference theme',
    description: 'A maintained, minimal theme in this repository to copy from.',
    href: 'https://github.com/jsonresume/jsonresume.org/tree/master/packages/themes/jsonresume-theme-reference',
  },
  {
    eyebrow: 'In this repo',
    title: 'Stack Overflow',
    description:
      'A complete theme with every section, maintained alongside the schema.',
    href: 'https://github.com/jsonresume/jsonresume.org/tree/master/packages/themes/stackoverflow',
  },
  {
    eyebrow: 'Community',
    title: 'Caffeine',
    description: 'A popular community theme with its own build.',
    href: 'https://github.com/kelyvin/jsonresume-theme-caffeine',
  },
  {
    eyebrow: 'Community',
    title: 'Actual',
    description: 'A clean, well-structured community theme.',
    href: 'https://github.com/davcd/jsonresume-theme-actual',
  },
];
