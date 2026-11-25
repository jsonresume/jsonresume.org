import { userActor } from '@repo/resume-versions';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { Accounts } from './accounts';
import { compose } from './emailLayout';
import { dueEmail, type Candidate } from './lifecycle';
import { accountsStack } from './test/stack';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const created = new Date('2026-11-01T12:00:00Z');
const at = (ms: number) => new Date(created.getTime() + ms);
const candidate = (over: Partial<Candidate> = {}): Candidate => ({
  userId: 'u',
  email: 'ada@example.com',
  username: 'ada',
  createdAt: created,
  verifiedAt: null,
  github: false,
  hasResume: false,
  sent: [],
  ...over,
});

describe('dueEmail', () => {
  it('reminds an unconfirmed account after a day, then on its last day', () => {
    expect(dueEmail(candidate(), at(23 * HOUR))).toBeUndefined();
    expect(dueEmail(candidate(), at(25 * HOUR))).toBe('verify_reminder');
    const reminded = candidate({ sent: ['verify_reminder'] });
    expect(dueEmail(reminded, at(3 * DAY))).toBeUndefined();
    expect(dueEmail(reminded, at(6 * DAY + HOUR))).toBe('verify_last_call');
    const both = candidate({ sent: ['verify_reminder', 'verify_last_call'] });
    expect(dueEmail(both, at(6 * DAY + 2 * HOUR))).toBeUndefined();
    expect(dueEmail(candidate(), at(7 * DAY))).toBeUndefined();
  });

  it('skips straight to the last call when the first reminder was missed', () => {
    expect(dueEmail(candidate(), at(6 * DAY + HOUR))).toBe('verify_last_call');
  });

  it('welcomes soon after confirming, then nudges an empty page once', () => {
    const confirmed = candidate({ verifiedAt: at(10 * 60_000) });
    expect(dueEmail(confirmed, at(HOUR))).toBe('welcome');
    expect(dueEmail(confirmed, at(5 * HOUR))).toBeUndefined();
    const welcomed = { ...confirmed, sent: ['welcome'] };
    expect(dueEmail(welcomed, at(DAY))).toBeUndefined();
    expect(dueEmail(welcomed, at(2 * DAY + HOUR))).toBe('empty_page');
    expect(
      dueEmail({ ...welcomed, hasResume: true }, at(2 * DAY + HOUR))
    ).toBeUndefined();
    expect(
      dueEmail({ ...welcomed, sent: ['welcome', 'empty_page'] }, at(3 * DAY))
    ).toBeUndefined();
    expect(dueEmail(welcomed, at(5 * DAY))).toBeUndefined();
  });

  it('treats GitHub sign-ups as confirmed, but never mails a relay address', () => {
    expect(dueEmail(candidate({ github: true }), at(HOUR))).toBe('welcome');
    const relay = candidate({
      github: true,
      email: '5+ghosty@users.noreply.github.com',
    });
    expect(dueEmail(relay, at(HOUR))).toBeUndefined();
  });
});

describe('sendAccountEmails', () => {
  const signUp = {
    email: 'ada@example.com',
    password: 'correct horse battery',
    username: 'ada',
  };

  it('sends a fresh link that works, each email once', async () => {
    const { run, mail, lastToken } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const { user } = yield* accounts.signUp(signUp);
        const later = new Date(Date.now() + 25 * HOUR);
        expect(yield* accounts.sendAccountEmailsAt(later)).toBe(1);
        expect(yield* accounts.sendAccountEmailsAt(later)).toBe(0);
        expect(mail.at(-1)?.subject).toBe('Your page at /@ada is waiting');
        expect(mail.at(-1)?.html).toContain('/api/auth/verify?token=');
        const reminder = mail.at(-1);
        expect(reminder?.html).toContain(`/emails?user=${user.id}&amp;token=`);
        expect(reminder?.headers?.['List-Unsubscribe']).toContain(
          '/api/email-settings/stop?user='
        );
        expect(reminder?.headers?.['List-Unsubscribe-Post']).toBe(
          'List-Unsubscribe=One-Click'
        );
        expect(yield* accounts.verifyEmail(lastToken())).toBe(user.id);
      })
    );
  });

  it('sends nothing to an account that turned them off', async () => {
    const { run, mail } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const { user } = yield* accounts.signUp(signUp);
        yield* accounts.setAccountEmails(user.id, false);
        expect(yield* accounts.accountEmails(user.id)).toBe(false);
        const before = mail.length;
        const later = new Date(Date.now() + 25 * HOUR);
        expect(yield* accounts.sendAccountEmailsAt(later)).toBe(0);
        expect(mail).toHaveLength(before);
      })
    );
  });

  it('welcomes a confirmed account to its live page', async () => {
    const { run, mail, lastToken } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const { user } = yield* accounts.signUp(signUp);
        yield* accounts.saveResume(
          user.id,
          { basics: { name: 'Ada' } },
          userActor
        );
        yield* accounts.verifyEmail(lastToken());
        expect(yield* accounts.sendAccountEmails).toBe(1);
        expect(mail.at(-1)).toMatchObject({
          to: 'ada@example.com',
          subject: 'Your resume is live at /@ada',
        });
        expect(mail.at(-1)?.text).toContain('http://localhost:5173/@ada');
        // Two days on there is a resume, so no nudge.
        const later = new Date(Date.now() + 2 * DAY + HOUR);
        expect(yield* accounts.sendAccountEmailsAt(later)).toBe(0);
      })
    );
  });

  it('nudges a GitHub account whose page is still empty', async () => {
    const { run, mail } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        yield* accounts.githubSignIn({
          id: 6,
          login: 'plain',
          avatarUrl: null,
          email: 'plain@example.com',
        });
        expect(yield* accounts.sendAccountEmails).toBe(1);
        expect(mail.at(-1)?.subject).toBe('Welcome to JSON Resume, @plain');
        const later = new Date(Date.now() + 2 * DAY + HOUR);
        expect(yield* accounts.sendAccountEmailsAt(later)).toBe(1);
        expect(mail.at(-1)?.subject).toBe(
          'Your page at /@plain is still empty'
        );
        expect(yield* accounts.sendAccountEmailsAt(later)).toBe(0);
      })
    );
  });
});

describe('compose', () => {
  const mail = compose({
    to: 'a@b.c',
    site: 'https://jsonresume.org',
    subject: 'Hi <you>',
    preview: 'Preview & more',
    heading: 'Heading',
    intro: ['<b>not bold</b>'],
    action: { label: 'Go', url: 'https://jsonresume.org/?a=1&b=2' },
    items: [{ tag: 'Apply', title: 'Job', text: 'Acme', url: 'https://x.y' }],
    numbered: true,
    reason: {
      text: 'Why.',
      links: [{ label: 'Stop', url: 'https://s.t' }],
    },
  });

  it('escapes every value in the HTML', () => {
    expect(mail.html).toContain('&lt;b&gt;not bold&lt;/b&gt;');
    expect(mail.html).toContain('?a=1&amp;b=2');
    expect(mail.html).toContain('Preview &amp; more');
    expect(mail.html).not.toContain('<b>');
  });

  it('writes the same message as text, with links spelled out', () => {
    expect(mail.text).toContain('Go: https://jsonresume.org/?a=1&b=2');
    expect(mail.text).toContain('1. Apply: Job\n   Acme\n   https://x.y');
    expect(mail.text).toContain('Why.\nStop: https://s.t');
    expect(mail.text).toContain('discord.gg');
  });
});
