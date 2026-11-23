import type { DecidedJob } from '@repo/api';

export interface DigestEmail {
  subject: string;
  text: string;
  html: string;
}

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        c
      ] ?? c)
  );

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
  stopUrl: string
): DigestEmail {
  const n = jobs.length;
  const subject =
    n === 1
      ? `A new job that fits: ${jobs[0]?.title ?? ''}`
      : `${n} new jobs that fit your resume`;
  const link = (job: DecidedJob) => `${site}/jobs/${job.id}`;
  const text = [
    'New on the JSON Resume job board this week, decided against your resume and preferences:',
    '',
    ...jobs.flatMap((job) => [
      `${verdictLabel(job)}: ${job.title}`,
      `  ${place(job)}`,
      `  ${link(job)}`,
      '',
    ]),
    `All your jobs: ${site}/dashboard/jobs`,
    '',
    `You get this because you turned on the weekly email in your job preferences. Stop it: ${stopUrl}`,
  ].join('\n');
  const items = jobs
    .map(
      (job) =>
        `<li style="margin:0 0 16px"><strong>${escape(
          verdictLabel(job)
        )}</strong>: <a href="${escape(link(job))}">${escape(
          job.title
        )}</a><br><span style="color:#555">${escape(place(job))}</span></li>`
    )
    .join('');
  const html = `<div style="font-family:sans-serif;line-height:1.5;max-width:560px">
<p>New on the JSON Resume job board this week, decided against your resume and preferences:</p>
<ul style="padding-left:20px">${items}</ul>
<p><a href="${escape(`${site}/dashboard/jobs`)}">All your jobs</a></p>
<p style="color:#777;font-size:13px">You get this because you turned on the weekly email in your job preferences. <a href="${escape(
    stopUrl
  )}">Stop these emails</a>.</p>
</div>`;
  return { subject, text, html };
}
