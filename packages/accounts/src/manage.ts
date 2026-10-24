import {
  ConfirmationMismatch,
  InvalidLink,
  UsernameUnavailable,
} from '@repo/api';
import { Duration, Effect } from 'effect';
import { accountsCore, normalEmail, normalName, unreachable } from './core';
import { hashPassword, hashToken, newToken } from './crypto';
import { passwordResetEmail } from './emails';

const RESET_TTL = Duration.hours(1);
/** How long an old name keeps redirecting after a rename. */
export const RENAME_REDIRECT = Duration.days(90);

/** Changing an account: forgotten passwords, renames, deletion. */
export const accountManagement = Effect.gen(function* () {
  const { store, usernames, mailer, siteUrl, later, startSession } =
    yield* accountsCore;

  /** Always succeeds, so it doesn't tell who has an account. */
  const requestPasswordReset = Effect.fn('Accounts.requestPasswordReset')(
    function* (email: string) {
      const found = yield* store.findByEmail(normalEmail(email));
      if (!found?.user.email) return;
      const token = newToken();
      yield* store.createEmailToken(
        found.user.id,
        found.user.email,
        hashToken(token),
        yield* later(RESET_TTL),
        'reset'
      );
      yield* mailer.send(
        passwordResetEmail(
          found.user.email,
          found.user.username,
          siteUrl,
          token
        )
      );
    }
  );

  /** A new password from an emailed link; signs in, and every other session ends. */
  const resetPassword = Effect.fn('Accounts.resetPassword')(function* (
    token: string,
    password: string
  ) {
    const userId = yield* store.consumeEmailToken(hashToken(token), 'reset');
    if (!userId) return yield* new InvalidLink();
    yield* store.setPassword(userId, yield* hashPassword(password));
    const user = yield* store.findById(userId);
    if (!user) return yield* new InvalidLink();
    return yield* startSession(user);
  });

  /** Their own linked GitHub login counts as theirs; their old aliases too (in the store). */
  const rename = Effect.fn('Accounts.rename')(function* (
    userId: string,
    name: string
  ) {
    const username = normalName(name);
    const user = yield* store.findById(userId);
    if (!user) return yield* Effect.die(`no user ${userId}`);
    const claimant =
      user.githubId !== null && user.githubLogin !== null
        ? { githubId: user.githubId, githubLogin: user.githubLogin }
        : undefined;
    const check = yield* usernames
      .check(username, claimant)
      .pipe(Effect.mapError(unreachable));
    if (!check.available && check.reason !== 'taken') {
      return yield* new UsernameUnavailable({ reason: check.reason });
    }
    return yield* store.renameUser(
      userId,
      username,
      yield* later(RENAME_REDIRECT)
    );
  });

  const deleteAccount = Effect.fn('Accounts.deleteAccount')(function* (
    userId: string,
    confirm: string
  ) {
    const user = yield* store.findById(userId);
    if (!user || normalName(confirm) !== user.username)
      return yield* new ConfirmationMismatch();
    yield* store.deleteUser(userId);
  });

  /** What the editor opens: the copy the page shows (the gist's when that is the source). */
  const currentResume = Effect.fn('Accounts.currentResume')(function* (
    userId: string
  ) {
    const found = yield* store.resumeOf(userId);
    if (!found) return yield* Effect.die(`no account for ${userId}`);
    const primary = found.source === 'gist' ? found.mirror : found.stored;
    return {
      resume: primary ?? found.stored ?? found.mirror ?? null,
      source: found.source,
    };
  });

  return {
    requestPasswordReset,
    resetPassword,
    rename,
    deleteAccount,
    currentResume,
    purgeRetired: store.purgeRetired(),
  };
});
