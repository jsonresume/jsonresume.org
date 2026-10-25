/**
 * The resume CLI (packages/cli), from its source (lib/main.js) and README.
 * Keep in step with `resume --help`.
 */

export interface CliOption {
  flag: string;
  description: string;
}

export interface CliCommand {
  name: string;
  usage: string;
  summary: string;
  /** Markdown. */
  details?: string;
  examples: string;
  options?: CliOption[];
}

export const install = [
  { label: 'npm', code: 'npm install -g resume-cli' },
  { label: 'pnpm', code: 'pnpm add -g resume-cli' },
  { label: 'npx', code: 'npx resume-cli --help' },
];

export const requirements = 'Node.js 18 or newer, on macOS, Linux or Windows.';

export const commands: CliCommand[] = [
  {
    name: 'init',
    usage: 'resume init',
    summary: 'Create a starter resume.json in the current folder.',
    examples: 'resume init',
  },
  {
    name: 'validate',
    usage: 'resume validate',
    summary: 'Check your resume against the schema.',
    details:
      'Exits non-zero on errors, so it works in CI. Point `--schema` at another schema to validate against it instead.',
    examples: 'resume validate\nresume validate --resume cv.json',
    options: [
      {
        flag: '--schema <path>',
        description: 'Validate against a custom schema.',
      },
    ],
  },
  {
    name: 'export',
    usage: 'resume export [fileName]',
    summary: 'Export to HTML, PDF, Markdown or plain text.',
    details:
      'The format comes from the file extension or `--format`. HTML and PDF are rendered by a theme; Markdown and text need none. PDF uses headless Chrome: on Linux CI or in containers set `RESUME_PUPPETEER_NO_SANDBOX=1`.',
    examples:
      'resume export resume.md\nresume export resume.html --theme even\nresume export resume.pdf --theme even\nresume export resume.txt --format text',
    options: [
      {
        flag: '--format <type>',
        description: 'html, pdf, markdown (md) or text (txt).',
      },
      {
        flag: '--theme <name>',
        description: 'Theme for HTML and PDF. Defaults to even.',
      },
      { flag: '--force', description: 'Skip schema validation.' },
    ],
  },
  {
    name: 'serve',
    usage: 'resume serve',
    summary: 'Preview your resume locally, reloading as you edit.',
    details:
      'Serves at http://localhost:4000. Theme authors run `resume serve --theme .` inside their theme folder.',
    examples: 'resume serve --theme elegant\nresume serve --port 8080 --silent',
    options: [
      {
        flag: '--theme <name>',
        description: 'Theme to render with, or a path such as `.`.',
      },
      { flag: '--port <port>', description: 'Defaults to 4000.' },
      { flag: '--silent', description: 'Do not open a browser.' },
      {
        flag: '--dir <path>',
        description: 'Public folder to serve alongside. Defaults to public.',
      },
    ],
  },
  {
    name: 'themes',
    usage: 'resume themes',
    summary: 'List installed themes and the name to pass to --theme.',
    details:
      'Looks in your project and global node_modules, without the network. Browse every theme in the [gallery](/themes).',
    examples: 'resume themes',
  },
  {
    name: 'audit',
    usage: 'resume audit [resumeFile]',
    summary: 'Score how well your resume reads in applicant tracking systems.',
    details:
      'Renders your resume with a theme, runs the ATS checks and prints a score, a grade, each check and recommendations. Advisory: it exits 0 whatever the score.',
    examples: 'resume audit\nresume audit resume.json --theme elegant',
    options: [
      {
        flag: '--theme <name>',
        description: 'Audit the markup a theme produces. Defaults to even.',
      },
    ],
  },
];

/** Options every command reads. */
export const globalOptions: CliOption[] = [
  {
    flag: '-r, --resume <file>',
    description: 'The resume to read, or - for stdin. Defaults to resume.json.',
  },
  {
    flag: '-t, --theme <name>',
    description:
      'A theme name (prefixed jsonresume-theme- for you), a scoped package or a path.',
  },
];

export const themeTips = [
  'Install a theme from npm before exporting with it: `npm install jsonresume-theme-elegant`.',
  'Short names get the `jsonresume-theme-` prefix: `--theme elegant`. Scoped packages are passed in full: `--theme @jsonresume/jsonresume-theme-professional`.',
  'Use a theme you are building with a path: `--theme .` or `--theme ../my-theme`.',
];

export const alternative = {
  name: 'resumed',
  href: 'https://github.com/rbardini/resumed',
  description: 'A lightweight community CLI that renders with the same themes.',
  code: 'npx resumed render resume.json --theme jsonresume-theme-even',
};

export const source =
  'https://github.com/jsonresume/jsonresume.org/tree/master/packages/cli';
