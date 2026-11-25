import type { McpToolInfo } from './catalog';

/** The catalog's email tools: which emails the account gets. */
export const emailTools: ReadonlyArray<McpToolInfo> = [
  {
    name: 'get_email_settings',
    group: 'account',
    description:
      'Which emails you get from jsonresume.org: accountEmails (a welcome, reminders to confirm your email, one nudge if your page stays empty) and weeklyJobs (a Monday email of new jobs that fit your resume). Password resets and sign-in links always come.',
    writes: false,
  },
  {
    name: 'set_email_settings',
    group: 'account',
    description:
      'Turn your emails on or off: accountEmails and weeklyJobs, each optional, so only what you pass changes. Ask the person first, and never turn an email on unless they asked.',
    writes: true,
  },
];
