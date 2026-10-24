import {
  EmailTaken,
  GithubUnreachable,
  InvalidCredentials,
  InvalidResume,
  Unauthorized,
  UsernameUnavailable,
} from '@repo/api';
import { Usernames } from '@repo/profiles';
import {
  Clock,
  Config,
  Context,
  Duration,
  Effect,
  Layer,
  Predicate,
} from 'effect';
import {
  decoyHash,
  hashPassword,
  hashToken,
  newToken,
  verifyPassword,
} from './crypto';
import {
  accountsCore,
  normalEmail,
  normalName,
  unreachable,
  UNVERIFIED_TTL,
  type SignedIn,
} from './core';
import { accountManagement } from './manage';
import type { GithubIdentity, UserRecord } from './store';

export { SESSION_TTL, UNVERIFIED_TTL, type SignedIn } from './core';

/** Signing up and in, sessions, verification and GitHub (docs/ACCOUNTS_AND_USERNAMES.md). */
export class Accounts extends Context.Service<
  Accounts,
  Effect.Success<typeof make>
>()('@repo/accounts/Accounts') {
  static readonly layer = Layer.effect(
    Accounts,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const {
    store,
    usernames,
    mailer,
    startSession,
    sendVerification,
    claimable,
  } = yield* accountsCore;
  const management = yield* accountManagement;
  const signUp = Effect.fn('Accounts.signUp')(function* (input: {
    email: string;
    password: string;
    username: string;
  }) {
    const email = normalEmail(input.email);
    const username = normalName(input.username);
    yield* claimable(username);
    if (yield* store.findByEmail(email)) return yield* new EmailTaken();
    const user = yield* store.createEmailUser({
      email,
      username,
      passwordHash: yield* hashPassword(input.password),
    });
    yield* sendVerification(user);
    return yield* startSession(user);
  });

  const signIn = Effect.fn('Accounts.signIn')(function* (input: {
    email: string;
    password: string;
  }) {
    const found = yield* store.findByEmail(normalEmail(input.email));
    const hash = found?.passwordHash ?? (yield* decoyHash);
    const ok = yield* verifyPassword(input.password, hash);
    if (!found || found.passwordHash === null || !ok)
      return yield* new InvalidCredentials();
    return yield* startSession(found.user);
  });

  const session = Effect.fn('Accounts.session')(function* (token: string) {
    const user = yield* store.findSession(hashToken(token));
    if (!user) return yield* new Unauthorized();
    return user;
  });

  /** Existing GitHub users sign in; new ones get their login, or must pick a name. */
  const githubSignIn = Effect.fn('Accounts.githubSignIn')(function* (
    identity: GithubIdentity
  ) {
    const existing = yield* store.findByGithubId(identity.id);
    if (existing)
      return { _tag: 'SignedIn', ...(yield* startSession(existing)) } as const;
    const claimant = { githubId: identity.id, githubLogin: identity.login };
    const login = normalName(identity.login);
    const check = yield* usernames
      .check(login, claimant)
      .pipe(Effect.mapError(unreachable));
    if (!check.available) return { _tag: 'ChooseUsername' } as const;
    const user = yield* store.createGithubUser(identity, login);
    return { _tag: 'SignedIn', ...(yield* startSession(user)) } as const;
  });

  const completeGithub = Effect.fn('Accounts.completeGithub')(function* (
    identity: GithubIdentity,
    name: string
  ) {
    const username = normalName(name);
    yield* claimable(username, {
      githubId: identity.id,
      githubLogin: identity.login,
    });
    const existing = yield* store.findByGithubId(identity.id);
    const user =
      existing ?? (yield* store.createGithubUser(identity, username));
    return yield* startSession(user);
  });

  const saveResume = Effect.fn('Accounts.saveResume')(function* (
    userId: string,
    resume: unknown
  ) {
    if (!Predicate.isObject(resume) || Array.isArray(resume)) {
      return yield* new InvalidResume({
        message: 'A resume is one JSON object, starting with {.',
      });
    }
    yield* store.saveStoredResume(userId, resume);
  });

  const setSource = Effect.fn('Accounts.setSource')(function* (
    userId: string,
    source: 'gist' | 'stored'
  ) {
    const account = yield* store.account(userId);
    if (source === 'gist' && !account?.user.githubLogin) {
      return yield* new InvalidResume({
        message: 'Link GitHub first to use your gist.',
      });
    }
    if (source === 'stored' && !account?.hasStoredResume) {
      return yield* new InvalidResume({ message: 'Upload a resume first.' });
    }
    yield* store.setSource(userId, source);
  });

  return {
    ...management,
    signUp,
    signIn,
    session,
    signOut: (token: string) => store.deleteSession(hashToken(token)),
    resendVerification: (user: UserRecord) => sendVerification(user),
    verifyEmail: (token: string) =>
      store.consumeEmailToken(hashToken(token), 'verify'),
    checkUsername: (name: string) =>
      usernames.check(normalName(name)).pipe(Effect.mapError(unreachable)),
    githubSignIn,
    completeGithub,
    linkGithub: (userId: string, identity: GithubIdentity) =>
      store.linkGithub(userId, identity),
    account: (userId: string) => store.account(userId),
    saveResume,
    setSource,
    emailDelivery: mailer.enabled,
    /** Free the names of email accounts never verified within UNVERIFIED_TTL. */
    purgeUnverified: Effect.gen(function* () {
      const now = yield* Clock.currentTimeMillis;
      return yield* store.purgeUnverified(
        new Date(now - Duration.toMillis(UNVERIFIED_TTL))
      );
    }),
  };
});
