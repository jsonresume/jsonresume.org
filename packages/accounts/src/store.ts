import type { EmailTaken, UsernameUnavailable } from '@repo/api';
import { Context, type Effect, Schema } from 'effect';

/** A user and the username their account holds. */
export interface UserRecord {
  id: string;
  username: string;
  email: string | null;
  emailVerified: boolean;
  githubId: number | null;
  githubLogin: string | null;
  avatarUrl: string | null;
}

/** Who GitHub says signed in. `email` is their primary address if verified. */
export interface GithubIdentity {
  id: number;
  login: string;
  avatarUrl: string | null;
  email: string | null;
}

export interface AccountRecord {
  user: UserRecord;
  source: 'gist' | 'stored';
  hasStoredResume: boolean;
  /** A gist copy is on the account (it has read one at least once). */
  hasMirror: boolean;
}

/** What an emailed link is for. */
export type TokenPurpose = 'verify' | 'reset';

/** The GitHub account is already linked to another user. */
export class GithubTaken extends Schema.TaggedError<GithubTaken>()(
  'GithubTaken',
  {}
) {}

/** Users, sessions and email tokens. Postgres (./sql) in production and tests. */
export class AccountStore extends Context.Service<
  AccountStore,
  {
    findByEmail(
      email: string
    ): Effect.Effect<
      { user: UserRecord; passwordHash: string | null } | undefined
    >;
    findByGithubId(id: number): Effect.Effect<UserRecord | undefined>;
    findById(id: string): Effect.Effect<UserRecord | undefined>;
    /** A new email account holding `username` (its resume: the stored copy). */
    createEmailUser(input: {
      email: string;
      passwordHash: string;
      username: string;
    }): Effect.Effect<UserRecord, EmailTaken | UsernameUnavailable>;
    /** A new GitHub account holding `username`; claims its own ghost there. */
    createGithubUser(
      identity: GithubIdentity,
      username: string
    ): Effect.Effect<UserRecord, UsernameUnavailable>;
    /** Link GitHub to a user; their ghost, if any, becomes an alias. */
    linkGithub(
      userId: string,
      identity: GithubIdentity
    ): Effect.Effect<UserRecord, GithubTaken>;
    createSession(
      userId: string,
      tokenHash: string,
      expiresAt: Date
    ): Effect.Effect<void>;
    findSession(tokenHash: string): Effect.Effect<UserRecord | undefined>;
    deleteSession(tokenHash: string): Effect.Effect<void>;
    createEmailToken(
      userId: string,
      email: string,
      tokenHash: string,
      expiresAt: Date,
      purpose: TokenPurpose
    ): Effect.Effect<void>;
    /**
     * Uses up a link's token: the user's id, or undefined when it is wrong,
     * used or old. Either purpose proves the inbox, so the email is verified.
     */
    consumeEmailToken(
      tokenHash: string,
      purpose: TokenPurpose
    ): Effect.Effect<string | undefined>;
    /** A new password; every session of the user ends. */
    setPassword(userId: string, passwordHash: string): Effect.Effect<void>;
    /** The user, their names (freed at once) and their resume views. */
    deleteUser(userId: string): Effect.Effect<void>;
    /**
     * Move the account to `username`. The old name becomes an alias that
     * redirects until `retiredUntil`; views move with the account.
     */
    renameUser(
      userId: string,
      username: string,
      retiredUntil: Date
    ): Effect.Effect<UserRecord, UsernameUnavailable>;
    /** Free names whose rename redirect has run out; how many. */
    purgeRetired(): Effect.Effect<number>;
    account(userId: string): Effect.Effect<AccountRecord | undefined>;
    saveStoredResume(userId: string, resume: unknown): Effect.Effect<void>;
    setSource(userId: string, source: 'gist' | 'stored'): Effect.Effect<void>;
    /** Delete email accounts left unverified since `before`; how many went. */
    purgeUnverified(before: Date): Effect.Effect<number>;
  }
>()('@repo/accounts/AccountStore') {}
