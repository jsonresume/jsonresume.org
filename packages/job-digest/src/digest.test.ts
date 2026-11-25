import type { DecidedJob } from '@repo/api';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { digestEmail } from './email';
import { DIGEST_SIZE, pickJobs } from './pick';
import { runDigests, type DigestMail } from './run';
import { digestToken, validDigestToken } from './token';

const now = new Date('2026-11-23T15:00:00Z');
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

const job = (
  id: number,
  verdict: DecidedJob['decision']['verdict'],
  value: number,
  overrides: Partial<DecidedJob> = {}
): DecidedJob => ({
  id,
  title: `Engineer ${id}`,
  company: 'Acme',
  location: 'Berlin, DE',
  remote: 'onsite',
  remoteRegions: [],
  seniority: 'senior',
  employmentType: 'full_time',
  salary: null,
  salaryMin: null,
  salaryMax: null,
  skills: [],
  postedAt: daysAgo(2),
  months: 1,
  score: 0.8,
  mark: null,
  role: null,
  why: null,
  decision: {
    verdict,
    chance: 50,
    appeal: 50,
    value,
    reasons: [],
    shown: [],
    missing: [],
    sectors: [],
    stage: 'unspecified',
  },
  ...overrides,
});

describe('which jobs the email carries', () => {
  it('apply before stretch, best first, never skip or ruled out', () => {
    const picked = pickJobs(
      [
        job(1, 'stretch', 90),
        job(2, 'apply', 40),
        job(3, 'skip', 99),
        job(4, 'apply', 70),
        job(5, 'ruled_out', 99),
      ],
      new Set(),
      now
    );
    expect(picked.map((j) => j.id)).toEqual([4, 2, 1]);
  });

  it('leaves out marked, old and already sent jobs', () => {
    const picked = pickJobs(
      [
        job(1, 'apply', 90, { mark: 'interested' }),
        job(2, 'apply', 80, { postedAt: daysAgo(20) }),
        job(3, 'apply', 70),
        job(4, 'apply', 60),
      ],
      new Set([3]),
      now
    );
    expect(picked.map((j) => j.id)).toEqual([4]);
  });

  it(`sends at most ${DIGEST_SIZE}`, () => {
    const many = Array.from({ length: 9 }, (_, i) => job(i + 1, 'apply', i));
    expect(pickJobs(many, new Set(), now)).toHaveLength(DIGEST_SIZE);
  });
});

describe('the email', () => {
  const email = digestEmail(
    [
      job(7, 'apply', 80, { remote: 'remote_global', salary: '$150k' }),
      job(8, 'stretch', 60, { title: 'Lead <script>', remote: 'hybrid' }),
    ],
    'https://jsonresume.org',
    'https://jsonresume.org/jobs/email/stop?user=u&token=t',
    'https://jsonresume.org/emails?user=u&token=e'
  );

  it('links each job and the way out', () => {
    expect(email.subject).toBe('2 new jobs that fit your resume');
    expect(email.text).toContain('Apply: Engineer 7');
    expect(email.text).toContain('Acme · Remote · $150k');
    expect(email.text).toContain('https://jsonresume.org/jobs/7');
    expect(email.text).toContain('Stretch: Lead <script>');
    expect(email.text).toContain('Acme · Berlin, DE, hybrid');
    expect(email.html).toContain('jobs/email/stop?user=u&amp;token=t');
    expect(email.html).toContain('/emails?user=u&amp;token=e');
  });

  it('escapes post text in the HTML', () => {
    expect(email.html).toContain('Lead &lt;script&gt;');
    expect(email.html).not.toContain('<script>');
  });
});

describe('the unsubscribe token', () => {
  it('is valid for its user only', () => {
    const token = digestToken('secret', 'user-1');
    expect(validDigestToken('secret', 'user-1', token)).toBe(true);
    expect(validDigestToken('secret', 'user-2', token)).toBe(false);
    expect(validDigestToken('other', 'user-1', token)).toBe(false);
    expect(validDigestToken('secret', 'user-1', 'nope')).toBe(false);
  });
});

describe("a week's run", () => {
  const setup = () => {
    const mail: DigestMail[] = [];
    const sent = new Map<string, Set<number>>();
    const deps = {
      subscribers: Effect.succeed([
        { id: 'has-jobs', email: 'a@example.com' },
        { id: 'no-resume', email: 'b@example.com' },
        { id: 'broken', email: 'c@example.com' },
      ]),
      resumeOf: (id: string) =>
        id === 'no-resume'
          ? Effect.succeed(null)
          : id === 'broken'
          ? Effect.fail('database down')
          : Effect.succeed({ basics: { name: 'A' } }),
      decide: () =>
        Effect.succeed([job(1, 'apply', 80), job(2, 'stretch', 60)]),
      sent: (id: string) => Effect.succeed(sent.get(id) ?? new Set<number>()),
      send: (m: DigestMail) => Effect.sync(() => void mail.push(m)),
      record: (id: string, ids: ReadonlyArray<number>) =>
        Effect.sync(() => {
          sent.set(id, new Set([...(sent.get(id) ?? []), ...ids]));
        }),
    };
    const run = () =>
      Effect.runPromise(
        runDigests(deps, { now, secret: 's', site: 'https://jsonresume.test' })
      );
    return { mail, run };
  };

  it('emails who has new jobs, skips the rest, and survives a failure', async () => {
    const { mail, run } = setup();
    expect(await run()).toEqual({
      subscribers: 3,
      sent: 1,
      empty: 1,
      failed: 1,
    });
    expect(mail).toHaveLength(1);
    expect(mail[0]?.to).toBe('a@example.com');
    expect(mail[0]?.headers['List-Unsubscribe']).toBe(
      `<https://jsonresume.test/api/job-digest/stop?user=has-jobs&token=${digestToken(
        's',
        'has-jobs'
      )}>`
    );
    expect(mail[0]?.headers['List-Unsubscribe-Post']).toBe(
      'List-Unsubscribe=One-Click'
    );
  });

  it('never sends the same jobs twice', async () => {
    const { mail, run } = setup();
    await run();
    expect((await run()).sent).toBe(0);
    expect(mail).toHaveLength(1);
  });
});
