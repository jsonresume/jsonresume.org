import { compose } from '@repo/accounts';
import type { DecidedJob } from '@repo/api';

export interface DigestEmail {
  subject: string;
  text: string;
  html: string;
}

const where = (job: DecidedJob) =>
  job.remote === 'remote_global' || job.remote === 'remote_region'
    ? 'Remote'
    : job.remote === 'hybrid'
    ? [job.location, 'hybrid'].filter(Boolean).join(', ')
    : job.location;

const place = (job: DecidedJob) =>
  [job.company, where(job), job.salary]
    .filter((part): part is string => Boolean(part))
    .join(' · ');

const verdictLabel = (job: DecidedJob) =>
  job.decision.verdict === 'apply' ? 'Apply' : 'Stretch';

/** The weekly email: each job with why, a link to it, and a way out. */
export function digestEmail(
  jobs: ReadonlyArray<DecidedJob>,
  site: string,
  stopUrl: string,
  settingsUrl: string
): DigestEmail {
  const n = jobs.length;
  const subject =
    n === 1
      ? `A new job that fits: ${jobs[0]?.title ?? ''}`
      : `${n} new jobs that fit your resume`;
  const applies = jobs.filter((job) => job.decision.verdict === 'apply').length;
  const { text, html } = compose({
    to: '',
    site,
    campaign: 'weekly_jobs',
    subject,
    preview: jobs
      .slice(0, 3)
      .map((job) => job.title)
      .join(' · '),
    heading: n === 1 ? 'A new job for you' : `${n} new jobs for you`,
    intro: [
      `New on the JSON Resume job board this week, decided against your resume and preferences${
        applies > 0 ? `: ${applies} to apply for` : ''
      }.`,
    ],
    action: { label: 'Open your jobs', url: `${site}/dashboard/jobs` },
    items: jobs.map((job) => ({
      tag: verdictLabel(job),
      title: job.title,
      text: place(job),
      url: `${site}/jobs/${job.id}`,
    })),
    reason: {
      text: 'You get this because you turned on the weekly email in your job preferences.',
      links: [
        { label: 'Stop these emails', url: stopUrl },
        { label: 'Change your email settings', url: settingsUrl },
      ],
    },
  });
  return { subject, text, html: html ?? '' };
}
