import { Accounts, validEmailToken } from '@repo/accounts';
import {
  InvalidLink,
  type EmailSettings,
  type EmailSettingsChange,
} from '@repo/api';
import { PreferenceStore } from '@repo/jobs';
import { track } from '@repo/posthog';
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

/** Where a change came from, for counting (email_settings_changed). */
export type SettingsVia = 'settings' | 'link' | 'one-click' | 'mcp';

/** Changes only what is given. */
export const setEmailSettings = Effect.fn('EmailSettings.set')(function* (
  userId: string,
  change: EmailSettingsChange,
  via: SettingsVia = 'settings'
) {
  const source = via === 'mcp' ? ('agent' as const) : ('you' as const);
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
  yield* track(userId, 'email_settings_changed', { ...change, via });
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
