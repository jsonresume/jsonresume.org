import type { JobMark, Verdict } from '@repo/api';
import { track } from '@repo/posthog/browser';

/** Each verdict as the page names and explains it. */
export const verdicts: Record<Verdict, { label: string; hint: string }> = {
  apply: { label: 'Apply', hint: 'A good chance at a job you’d want' },
  stretch: { label: 'Stretch', hint: 'One you’d want, with gaps to close' },
  skip: { label: 'Skip', hint: 'Unlikely, or not what you want' },
  ruled_out: { label: 'Ruled out', hint: 'Breaks one of your dealbreakers' },
};

export const VERDICTS: ReadonlyArray<Verdict> = [
  'apply',
  'stretch',
  'skip',
  'ruled_out',
];

/** The marked views, after the verdicts. */
export const markViews: ReadonlyArray<{ value: JobMark; label: string }> = [
  { value: 'interested', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'not_interested', label: 'Passed' },
];

/** What the page tracks, beyond the server's own events (job_marked, jobs_decided). */
export const jobsEvent = (
  event:
    | 'jobs_view_changed'
    | 'job_opened'
    | 'job_apply_clicked'
    | 'job_preferences_opened'
    | 'job_suggestion_answered',
  properties: Readonly<Record<string, string | number | boolean | null>>
) => track(event, properties);

/** "$150k". */
export const usd = (n: number) => `$${Math.round(n / 1000)}k`;
