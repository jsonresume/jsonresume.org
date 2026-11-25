import { Accounts, validEmailToken } from '@repo/accounts';
import {
  InvalidLink,
  type EmailSettings,
  type EmailSettingsChange,
} from '@repo/api';
import { PreferenceStore, type PreferenceSource } from '@repo/jobs';
import { Config, Effect, Redacted } from 'effect';

/** Which emails the account gets: its own setting, and the weekly jobs one. */
export const emailSettings = Effect.fn('EmailSettings.get')(function* (
  userId: string
) {
  const accounts = yield* Accounts;
  const preferences = yield* PreferenceStore;
  return {
    accountEmails: yield* accounts.accountEmails(userId),
    weeklyJobs: (yield* preferences.get(userId)).weeklyEmail,
    monthlyReport: yield* accounts.monthlyReport(userId),
  } satisfies EmailSettings;
});

/** Changes only what is given; `source` is who changed the job preference. */
export const setEmailSettings = Effect.fn('EmailSettings.set')(function* (
  userId: string,
  change: EmailSettingsChange,
  source: PreferenceSource = 'you'
) {
  const accounts = yield* Accounts;
  const preferences = yield* PreferenceStore;
  if (change.accountEmails !== undefined)
    yield* accounts.setAccountEmails(userId, change.accountEmails);
  if (change.monthlyReport !== undefined)
    yield* accounts.setMonthlyReport(userId, change.monthlyReport);
  if (change.weeklyJobs !== undefined) {
    const current = yield* preferences.get(userId);
    if (current.weeklyEmail !== change.weeklyJobs)
      yield* preferences.save(
        userId,
        { ...current, weeklyEmail: change.weeklyJobs },
        source
      );
  }
  return yield* emailSettings(userId);
});

/** What a one-click unsubscribe turns off. */
export const stopChange = (
  kind: 'account' | 'weekly' | 'report' | 'all'
): EmailSettingsChange =>
  kind === 'account'
    ? { accountEmails: false }
    : kind === 'weekly'
    ? { weeklyJobs: false }
    : kind === 'report'
    ? { monthlyReport: false }
    : { accountEmails: false, weeklyJobs: false, monthlyReport: false };

/** The user an email's link is for, if its token is theirs. */
export const linkUser = Effect.fn('EmailSettings.linkUser')(function* (
  user: string,
  token: string
) {
  const secret = yield* Config.Redacted('AUTH_SECRET').pipe(Effect.orDie);
  if (!validEmailToken(Redacted.value(secret), user, token))
    return yield* new InvalidLink();
  return user;
});
