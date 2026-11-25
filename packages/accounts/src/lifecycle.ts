import { Clock, Config, Duration, Effect, Redacted, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { accountsCore, UNVERIFIED_TTL } from './core';
import { verifyLastCallEmail, verifyReminderEmail } from './emails';
import { track } from '@repo/posthog';
import { emailPrefs } from './emailPrefs';
import { emailLinks } from './emailToken';
import { emptyPageEmail, welcomeEmail } from './lifecycleMail';

/** The emails an account gets on its own, each at most once. */
export type AccountEmail =
  | 'welcome'
  | 'verify_reminder'
  | 'verify_last_call'
  | 'empty_page';

export interface Candidate {
  userId: string;
  email: string;
  username: string;
  createdAt: Date;
  verifiedAt: Date | null;
  github: boolean;
  hasResume: boolean;
  sent: ReadonlyArray<string>;
}

const DAY = Duration.toMillis(Duration.days(1));
/** A welcome later than this after confirming would be odd; skip it. */
const WELCOME_WITHIN = Duration.toMillis(Duration.hours(2));
const LOOKBACK = Duration.days(8);

/**
 * Which email, if any, is due for an account now:
 * - unconfirmed: a fresh link after a day (the first runs out at 24 hours),
 *   and a last call the day before the account and its name are let go;
 * - confirmed (or GitHub): a welcome, then one nudge if the page is still
 *   empty two days in. GitHub's private relay addresses get nothing.
 */
export function dueEmail(c: Candidate, now: Date): AccountEmail | undefined {
  if (c.email.endsWith('@users.noreply.github.com')) return undefined;
  const sent = new Set(c.sent);
  const age = now.getTime() - c.createdAt.getTime();
  const confirmed = c.github || c.verifiedAt !== null;
  if (!confirmed) {
    const ttl = Duration.toMillis(UNVERIFIED_TTL);
    if (age >= ttl) return undefined;
    if (age >= ttl - DAY)
      return sent.has('verify_last_call') ? undefined : 'verify_last_call';
    if (age >= DAY && !sent.has('verify_reminder')) return 'verify_reminder';
    return undefined;
  }
  const since = now.getTime() - (c.verifiedAt ?? c.createdAt).getTime();
  if (!sent.has('welcome') && since < WELCOME_WITHIN) return 'welcome';
  if (
    !c.hasResume &&
    !sent.has('empty_page') &&
    age >= 2 * DAY &&
    age < 4 * DAY
  )
    return 'empty_page';
  return undefined;
}

const Row = Schema.Struct({
  id: Schema.String,
  email: Schema.String,
  username: Schema.String,
  created_at: Schema.Date,
  email_verified_at: Schema.NullOr(Schema.Date),
  github: Schema.Boolean,
  has_resume: Schema.Boolean,
  sent: Schema.Array(Schema.String),
});
const decodeRows = Schema.decodeUnknownEffect(Schema.Array(Row));

/** Sends what is due (dueEmail) to accounts made in the last eight days. */
export const lifecycleEmails = Effect.gen(function* () {
  const { store, mailer, siteUrl, sendVerification } = yield* accountsCore;
  const sql = yield* SqlClient.SqlClient;
  const secret = Redacted.value(yield* Config.Redacted('AUTH_SECRET'));

  const candidates = (since: Date) =>
    sql`
      SELECT u.id, u.email, p.username, u.created_at, u.email_verified_at,
             u.github_id IS NOT NULL AS github,
             (p.stored_resume IS NOT NULL OR p.resume IS NOT NULL) AS has_resume,
             COALESCE((SELECT array_agg(e.kind) FROM app.account_emails e
                       WHERE e.user_id = u.id), '{}') AS sent
      FROM app.users u
      JOIN app.profiles p ON p.user_id = u.id AND p.kind = 'account'
      WHERE u.email IS NOT NULL AND u.account_emails
        AND u.created_at > ${since}`.pipe(
      Effect.flatMap(decodeRows),
      Effect.map((rows) =>
        rows.map(
          (r): Candidate => ({
            userId: r.id,
            email: r.email,
            username: r.username,
            createdAt: r.created_at,
            verifiedAt: r.email_verified_at,
            github: r.github,
            hasResume: r.has_resume,
            sent: r.sent,
          })
        )
      )
    );

  /** Takes the row first, so two servers never send the same email. */
  const claim = (userId: string, kind: AccountEmail) =>
    sql<{ kind: string }>`
      INSERT INTO app.account_emails (user_id, kind) VALUES (${userId}, ${kind})
      ON CONFLICT DO NOTHING RETURNING kind`.pipe(
      Effect.map((rows) => rows.length > 0)
    );

  const send = (c: Candidate, kind: AccountEmail) =>
    Effect.gen(function* () {
      const who = { to: c.email, username: c.username, site: siteUrl };
      const links = emailLinks(siteUrl, secret, c.userId, 'account');
      const heldUntil = new Date(
        c.createdAt.getTime() + Duration.toMillis(UNVERIFIED_TTL)
      );
      if (kind === 'welcome')
        return yield* mailer.send(welcomeEmail(who, c.hasResume, links));
      if (kind === 'empty_page')
        return yield* mailer.send(emptyPageEmail(who, links));
      const user = yield* store.findById(c.userId);
      if (!user) return;
      yield* sendVerification(
        user,
        kind === 'verify_reminder'
          ? verifyReminderEmail(heldUntil, links)
          : verifyLastCallEmail(heldUntil, links)
      );
    });

  /** What is due at `now`; how many went. */
  const sendAccountEmailsAt = Effect.fn('Accounts.sendAccountEmails')(
    function* (now: Date) {
      if (!mailer.enabled) return 0;
      const since = new Date(now.getTime() - Duration.toMillis(LOOKBACK));
      let sent = 0;
      for (const c of yield* candidates(since)) {
        const kind = dueEmail(c, now);
        if (kind && (yield* claim(c.userId, kind))) {
          yield* send(c, kind);
          yield* track(c.userId, 'email_sent', { kind });
          sent += 1;
        }
      }
      return sent;
    },
    Effect.orDie
  );

  return {
    ...emailPrefs(sql),
    sendAccountEmailsAt,
    sendAccountEmails: Effect.flatMap(Clock.currentTimeMillis, (ms) =>
      sendAccountEmailsAt(new Date(ms))
    ),
  };
});
