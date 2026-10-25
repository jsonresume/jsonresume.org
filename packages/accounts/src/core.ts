import { GithubUnreachable, UsernameUnavailable } from '@repo/api';
import { Usernames } from '@repo/profiles';
import { Clock, Config, Duration, Effect } from 'effect';
import { hashToken, newToken } from './crypto';
import { verificationEmail } from './emails';
import { Mailer } from './mailer';
import { AccountStore, type UserRecord } from './store';

export const SESSION_TTL = Duration.days(30);
const EMAIL_TOKEN_TTL = Duration.hours(24);
/** Email accounts that never verify let go of their name after this. */
export const UNVERIFIED_TTL = Duration.days(7);

export interface SignedIn {
  user: UserRecord;
  /** The session cookie's value; only its hash is stored. */
  token: string;
}

export const normalEmail = (email: string) => email.trim().toLowerCase();
export const normalName = (name: string) => name.trim().toLowerCase();

export const unreachable = () => new GithubUnreachable();

/** What every account flow shares: sessions, verification, name checks. */
export const accountsCore = Effect.gen(function* () {
  const store = yield* AccountStore;
  const usernames = yield* Usernames;
  const mailer = yield* Mailer;
  const siteUrl = yield* Config.String('SITE_URL').pipe(
    Config.withDefault('http://localhost:5173')
  );

  const later = (ttl: Duration.Duration) =>
    Effect.map(
      Clock.currentTimeMillis,
      (now) => new Date(now + Duration.toMillis(ttl))
    );

  const startSession = Effect.fn('Accounts.startSession')(function* (
    user: UserRecord
  ) {
    const token = newToken();
    yield* store.createSession(
      user.id,
      hashToken(token),
      yield* later(SESSION_TTL)
    );
    return { user, token } satisfies SignedIn;
  });

  const sendVerification = Effect.fn('Accounts.sendVerification')(function* (
    user: UserRecord
  ) {
    if (!user.email || user.emailVerified) return;
    const token = newToken();
    yield* store.createEmailToken(
      user.id,
      user.email,
      hashToken(token),
      yield* later(EMAIL_TOKEN_TTL),
      'verify'
    );
    yield* mailer.send(
      verificationEmail(user.email, user.username, siteUrl, token)
    );
  });

  const claimable = Effect.fn('Accounts.claimable')(function* (
    username: string,
    claimant?: { githubId: number; githubLogin: string }
  ) {
    const check = yield* usernames
      .check(username, claimant)
      .pipe(Effect.mapError(unreachable));
    if (!check.available)
      return yield* new UsernameUnavailable({ reason: check.reason });
  });

  return {
    store,
    usernames,
    mailer,
    siteUrl,
    later,
    startSession,
    sendVerification,
    claimable,
  };
});
