import {
  compose,
  optional,
  type EmailLinks,
  type EmailStat,
} from '@repo/accounts';
import type { Overview } from '@repo/api';

const regions = new Intl.DisplayNames(['en'], { type: 'region' });
const country = (code: string) => {
  try {
    return /^[A-Z]{2}$/.test(code) ? regions.of(code) ?? code : code;
  } catch {
    return code;
  }
};

/** "1m 20s", "45s". */
export const duration = (seconds: number) => {
  const s = Math.round(seconds);
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;
};

/** 1,834: big numbers grouped, as people read them. */
const count = (n: number) => n.toLocaleString('en');

const people = (n: number) => (n === 1 ? '1 person' : `${count(n)} people`);

/** How this month compares: "up from 12", "down from 30", or nothing. */
export const versus = (now: number, before: number) =>
  before === 0 || now === before
    ? undefined
    : `${now > before ? 'up' : 'down'} from ${count(before)}`;

/** "google.com (12), Direct (9) and github.com (3)". */
const listed = (rows: Overview['referrers'], name = (s: string) => s) => {
  const parts = rows.slice(0, 3).map((r) => `${name(r.label)} (${r.value})`);
  return parts.length <= 1
    ? parts.join('')
    : `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
};

/** The report: who read the resume in the last 30 days, and from where. */
export function reportEmail(
  who: { to: string; username: string; site: string },
  overview: Overview,
  links: EmailLinks
) {
  const { totals, previous } = overview;
  const { site, username } = who;
  const change = versus(totals.visitors, previous.visitors);
  const figures: Array<EmailStat> = [
    {
      value: count(totals.visitors),
      label: totals.visitors === 1 ? 'reader' : 'readers',
      ...(change ? { note: change } : {}),
    },
    { value: count(totals.views), label: 'page views' },
    ...(totals.medianSeconds > 0
      ? [{ value: duration(totals.medianSeconds), label: 'typical read' }]
      : []),
    ...(totals.dataReads > 0
      ? [{ value: count(totals.dataReads), label: 'downloads' }]
      : []),
  ];
  const from = listed(overview.referrers);
  const where = listed(overview.countries, country);
  return compose({
    to: who.to,
    site,
    campaign: 'report',
    // Sent in the first week of a month, about the 30 days before it.
    subject: `${people(totals.visitors)} read your resume in the past month`,
    preview: [
      change ? `That’s ${change}.` : '',
      from && `Most came from ${from}.`,
    ]
      .filter(Boolean)
      .join(' '),
    heading: `${people(totals.visitors)} read your resume`,
    intro: [
      `In the last 30 days, ${site.replace(
        /^https?:\/\//,
        ''
      )}/@${username} had ${count(totals.views)} ${
        totals.views === 1 ? 'view' : 'views'
      } from ${people(totals.visitors)}. Your own visits aren’t counted.`,
    ],
    stats: figures,
    action: { label: 'See all your numbers', url: `${site}/dashboard` },
    outro: [
      ...(from ? [`Where they came from: ${from}.`] : []),
      ...(where ? [`Where they were: ${where}.`] : []),
    ],
    ...optional(
      'You get this early each month, only when someone read your resume.',
      links
    ),
  });
}
