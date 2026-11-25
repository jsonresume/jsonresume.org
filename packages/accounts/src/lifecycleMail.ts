import { compose, type EmailItem } from './emailLayout';
import { optional, type EmailLinks } from './emailToken';

interface Who {
  to: string;
  username: string;
  site: string;
}

const steps = (site: string, hasResume: boolean): Array<EmailItem> => [
  ...(hasResume
    ? []
    : [
        {
          title: 'Bring the resume you have',
          text: 'Upload a PDF or Word file, a photo, or paste text, and it becomes JSON Resume in about a minute.',
          url: `${site}/start`,
        },
      ]),
  {
    title: 'Pick a theme',
    text: 'Dozens of looks for the same resume, changed in one click.',
    url: `${site}/themes`,
  },
  {
    title: 'Find jobs that fit',
    text: 'Hacker News “Who is hiring?” posts, read against your resume, with what to apply for.',
    url: `${site}/dashboard/jobs`,
  },
  {
    title: 'Let your AI assistant help',
    text: 'Connect Claude, ChatGPT or another assistant to read and edit your resume for you.',
    url: `${site}/ai`,
  },
];

/** Once the email is confirmed (or on a GitHub sign-up): the page, then what next. */
export const welcomeEmail = (
  { to, username, site }: Who,
  hasResume: boolean,
  links: EmailLinks
) =>
  compose({
    to,
    site,
    campaign: 'welcome',
    subject: hasResume
      ? `Your resume is live at /@${username}`
      : `Welcome to JSON Resume, @${username}`,
    preview: hasResume
      ? 'It also downloads as a PDF, Word file or JSON.'
      : 'Add your resume and your page goes live.',
    heading: hasResume ? 'Your resume is live' : `Welcome, @${username}`,
    intro: hasResume
      ? [
          `Your page is at ${site}/@${username}. Anyone with the link can read it, and it downloads as a PDF, Word file or JSON by adding .pdf, .docx or .json.`,
        ]
      : [
          `Your account is ready and ${site}/@${username} is yours.`,
          'It’s empty for now: add your resume and the page goes live.',
        ],
    action: hasResume
      ? { label: 'See your page', url: `${site}/@${username}` }
      : { label: 'Add your resume', url: `${site}/start` },
    numbered: true,
    items: steps(site, hasResume),
    outro: [
      'Your resume is plain JSON in an open standard, so it’s yours to take anywhere.',
    ],
    ...optional('You get this once, because you made an account.', links),
  });

/** Two days in, still nothing on the page: the one nudge. */
export const emptyPageEmail = (
  { to, username, site }: Who,
  links: EmailLinks
) =>
  compose({
    to,
    site,
    campaign: 'empty_page',
    subject: `Your page at /@${username} is still empty`,
    preview: 'Start from the resume you already have. It takes about a minute.',
    heading: 'Start from the resume you have',
    intro: [
      `${site}/@${username} is yours, but there’s no resume on it yet.`,
      'You don’t need to type it out: upload a PDF or Word file, a photo of it, or paste the text, and we turn it into JSON Resume for you to check and save.',
    ],
    action: { label: 'Import your resume', url: `${site}/start` },
    items: [
      {
        title: 'Or write it from scratch',
        text: 'The editor fills in section by section, with a live preview in any theme.',
        url: `${site}/dashboard/editor`,
      },
    ],
    ...optional('This is the only reminder we send about it.', links),
  });
