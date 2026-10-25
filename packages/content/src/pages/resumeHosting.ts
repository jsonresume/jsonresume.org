/**
 * Copy for /@username when there is no resume to show. Checked 23 October
 * 2026 against @repo/resume-host (which decides the problem) and the
 * registry's behaviour it replaces.
 */

export interface ProblemCopy {
  title: string;
  /** Markdown, one paragraph. */
  body: string;
}

type Copy = (details: {
  username: string;
  file?: string;
  theme?: string;
  extension?: string;
}) => ProblemCopy;

export const problems: Record<
  | 'no-user'
  | 'no-gist'
  | 'unpublished'
  | 'not-json'
  | 'not-object'
  | 'github-down'
  | 'theme-missing'
  | 'theme-failed'
  | 'pdf-failed'
  | 'unknown-format',
  Copy
> = {
  'no-user': ({ username }) => ({
    title: `No resume at @${username}`,
    body: `There is no GitHub user called ${username}. Resumes here are found by GitHub username, so check the spelling.`,
  }),
  'no-gist': ({ username, file = 'resume.json' }) => ({
    title: `@${username} hasn’t published a resume`,
    body: `We looked for a public gist with a file named \`${file}\` on ${username}’s GitHub account and didn’t find one.`,
  }),
  unpublished: ({ username }) => ({
    title: `@${username} hasn’t published yet`,
    body: `This name belongs to a JSON Resume account. The page goes live once its owner confirms their email and adds a resume.`,
  }),
  'not-json': ({ username, file = 'resume.json' }) => ({
    title: 'This resume has a typo',
    body: `\`${file}\` in ${username}’s gist isn’t valid JSON, so it can’t be shown. Look near the place the error points to: a missing comma or quote is the usual cause.`,
  }),
  'not-object': ({ username, file = 'resume.json' }) => ({
    title: 'This resume isn’t in the right shape',
    body: `\`${file}\` in ${username}’s gist must hold one JSON object, starting with \`{\`, with sections such as \`basics\` and \`work\`.`,
  }),
  'github-down': ({ username }) => ({
    title: 'GitHub isn’t answering',
    body: `Resumes are read from GitHub, which didn’t respond, and we have no saved copy of ${username}’s yet. Try again in a minute.`,
  }),
  'theme-missing': ({ theme = '' }) => ({
    title: `There is no “${theme}” theme`,
    body: 'The theme in the address or in the resume’s `meta.theme` isn’t one we have. Pick one from the gallery, or open the resume in the default theme.',
  }),
  'theme-failed': ({ theme = '' }) => ({
    title: `The ${theme} theme couldn’t show this resume`,
    body: 'The theme stopped on something in this resume. Try another theme; if this one should work, please report it.',
  }),
  'pdf-failed': ({ username, theme = '' }) => ({
    title: 'The PDF couldn’t be made just now',
    body: `Printing ${username}’s resume in the ${theme} theme didn’t finish. Try again in a moment, or open the page and use your browser’s **Print → Save as PDF**.`,
  }),
  'unknown-format': ({ extension = '' }) => ({
    title: `We don’t serve .${extension} files`,
    body: 'A resume is available as a web page or a PDF, as JSON, YAML, plain text or RenderCV, and as a QR code that links to the page.',
  }),
};

/** The other formats, linked from the page. */
export const formats = [
  { label: 'PDF', extension: 'pdf' },
  { label: 'JSON', extension: 'json' },
  { label: 'YAML', extension: 'yaml' },
  { label: 'Plain text', extension: 'txt' },
  { label: 'RenderCV', extension: 'rendercv' },
  { label: 'QR code', extension: 'qr' },
] as const;

export const reportIssue =
  'https://github.com/jsonresume/jsonresume.org/issues/new';
