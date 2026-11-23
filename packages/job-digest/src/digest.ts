import { Accounts, Mailer } from '@repo/accounts';
import { JobDecisions } from '@repo/careers';
import { PreferenceStore } from '@repo/jobs';
import { Clock, Config, Duration, Effect, Redacted } from 'effect';
import { SqlClient } from 'effect/sql';
import { runDigests } from './run';
import { digestStore } from './store';
import { validDigestToken } from './token';

/** How long to wait for model work (judging new posts) per person. */
const WAIT = Duration.seconds(90);

const settings = Effect.gen(function* () {
  const secret = yield* Config.Redacted('AUTH_SECRET');
  const site = yield* Config.String('SITE_URL').pipe(
    Config.withDefault('https://jsonresume.org')
  );
  return { secret: Redacted.value(secret), site: site.replace(/\/$/, '') };
});

/**
 * Sends this week's email to everyone who turned it on (runDigests), with
 * the dashboard's decisions and the site's mailer.
 */
export const sendDigests = Effect.gen(function* () {
  const store = digestStore(yield* SqlClient.SqlClient);
  const accounts = yield* Accounts;
  const decisions = yield* JobDecisions;
  const mailer = yield* Mailer;
  const { secret, site } = yield* settings;
  const now = new Date(yield* Clock.currentTimeMillis);
  return yield* runDigests(
    {
      subscribers: store.subscribers(),
      resumeOf: (userId) =>
        Effect.map(accounts.currentResume(userId), (r) => r.resume),
      decide: (userId, resume) =>
        Effect.map(decisions.decisions(userId, resume, WAIT), (d) => d.jobs),
      sent: store.sent,
      send: mailer.send,
      record: store.record,
    },
    { now, secret, site }
  );
});

/** The unsubscribe link: turns the email off, if the token is theirs. */
export const stopDigest = Effect.fn('JobDigest.stop')(function* (
  userId: string,
  token: string
) {
  const { secret } = yield* settings;
  if (!validDigestToken(secret, userId, token)) return false;
  const preferences = yield* PreferenceStore;
  const current = yield* preferences.get(userId);
  if (current.weeklyEmail)
    yield* preferences.save(userId, { ...current, weeklyEmail: false }, 'you');
  return true;
});
