import type { Mail } from '@repo/accounts';
import { Overview } from '@repo/api';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { duration, reportEmail, versus } from './email';
import { DAILY_CAP, reportMonth, runReports, type ReportDeps } from './run';

const totals = (visitors: number) => ({
  views: visitors * 2,
  visitors,
  medianSeconds: 80,
  readDepth: 60,
  dataReads: 3,
});
const overview = (visitors: number, before = 4) =>
  new Overview({
    range: '30d',
    totals: totals(visitors),
    previous: totals(before),
    daily: [],
    referrers: [
      { label: 'google.com', value: 9 },
      { label: 'Direct', value: 5 },
      { label: 'github.com', value: 2 },
      { label: 'bing.com', value: 1 },
    ],
    countries: [
      { label: 'DE', value: 6 },
      { label: 'US', value: 4 },
    ],
    devices: [],
    browsers: [],
    themes: [],
    downloaders: [],
    recent: [],
    recentDownloads: [],
  });
const links = {
  settings: 'https://jsonresume.org/emails?user=u&token=t',
  headers: { 'List-Unsubscribe': '<https://x>' },
};

describe('reportMonth', () => {
  it('is due from 09:00 UTC on the 1st through the 7th', () => {
    expect(reportMonth(new Date('2026-12-01T08:59:00Z'))).toBeUndefined();
    expect(reportMonth(new Date('2026-12-01T09:00:00Z'))).toBe('2026-12');
    expect(reportMonth(new Date('2026-12-07T23:00:00Z'))).toBe('2026-12');
    expect(reportMonth(new Date('2026-12-08T00:00:00Z'))).toBeUndefined();
  });
});

describe('the email', () => {
  const mail = reportEmail(
    { to: 'ada@example.com', username: 'ada', site: 'https://jsonresume.org' },
    overview(12),
    links
  );

  it('says how many read it, against the month before, and from where', () => {
    expect(mail.subject).toBe('12 people read your resume this month');
    expect(mail.text).toContain('12 readers (up from 4)');
    expect(mail.text).toContain('24 page views');
    expect(mail.text).toContain('1m 20s typical read');
    expect(mail.text).toContain(
      'Where they came from: google.com (9), Direct (5) and github.com (2).'
    );
    expect(mail.text).toContain(
      'Where they were: Germany (6) and United States (4).'
    );
    expect(mail.text).toContain(links.settings);
    expect(mail.headers).toEqual(links.headers);
  });

  it('reads well for one reader', () => {
    const one = reportEmail(
      { to: 'a@b.c', username: 'ada', site: 'https://jsonresume.org' },
      overview(1, 0),
      links
    );
    expect(one.subject).toBe('1 person read your resume this month');
    expect(one.text).toContain('1 reader\n');
  });

  it('formats times and changes', () => {
    expect(duration(45)).toBe('45s');
    expect(duration(125)).toBe('2m 5s');
    expect(versus(5, 0)).toBeUndefined();
    expect(versus(5, 5)).toBeUndefined();
    expect(versus(3, 5)).toBe('down from 5');
  });
});

describe('runReports', () => {
  const setup = (readers: number, sentToday = 0) => {
    const sent: Array<Mail> = [];
    const claimed = new Set<string>();
    const deps: ReportDeps = {
      due: (kind, _since, limit) =>
        Effect.succeed(
          Array.from({ length: readers }, (_, i) => ({
            userId: `u${i}`,
            email: `u${i}@example.com`,
            username: i === 0 ? 'quiet' : `user${i}`,
          }))
            .filter((r) => !claimed.has(`${r.userId}:${kind}`))
            .slice(0, limit)
        ),
      sentSince: () => Effect.succeed(sentToday + sent.length),
      overview: (username) =>
        Effect.succeed(overview(username === 'quiet' ? 0 : 7)),
      claim: (userId, kind) =>
        Effect.sync(() => {
          const key = `${userId}:${kind}`;
          if (claimed.has(key)) return false;
          claimed.add(key);
          return true;
        }),
      links: () => links,
      send: (mail) => Effect.sync(() => void sent.push(mail)),
    };
    return { deps, sent };
  };
  const site = 'https://jsonresume.org';
  const due = new Date('2026-12-01T10:00:00Z');

  it('sends once a month, skipping pages nobody read', async () => {
    const { deps, sent } = setup(4);
    expect(await Effect.runPromise(runReports(deps, due, site))).toBe(3);
    expect(sent.map((m) => m.to)).toEqual([
      'u1@example.com',
      'u2@example.com',
      'u3@example.com',
    ]);
    expect(await Effect.runPromise(runReports(deps, due, site))).toBe(0);
  });

  it('keeps to the daily cap, and sends nothing when not due', async () => {
    const { deps, sent } = setup(DAILY_CAP + 20, 10);
    await Effect.runPromise(runReports(deps, due, site));
    // 10 already went today; the one page nobody read takes a slot unsent.
    expect(sent).toHaveLength(DAILY_CAP - 10 - 1);
    const idle = setup(3);
    const later = new Date('2026-12-15T10:00:00Z');
    expect(await Effect.runPromise(runReports(idle.deps, later, site))).toBe(0);
  });
});
