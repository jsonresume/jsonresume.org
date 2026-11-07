import { Accounts, type AccountRecord } from '@repo/accounts';
import { THEME_METADATA } from '@jsonresume/theme-metadata';
import { Account, CurrentUser, JsonResumeApi, UnknownTheme } from '@repo/api';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { clearSession } from './http';
import { track } from '@repo/posthog';
import { savedProperties, userActor } from '@repo/resume-versions';

const toAccount = (
  record: AccountRecord,
  emailDelivery: boolean,
  gistWrite: boolean
) => {
  const { user } = record;
  const verified = user.emailVerified || user.githubId !== null;
  const hasResume =
    record.source === 'stored'
      ? record.hasStoredResume
      : user.githubLogin !== null;
  return new Account({
    username: user.username,
    path: `/@${user.username}`,
    public: verified && hasResume,
    email: user.email,
    emailVerified: user.emailVerified,
    github: user.githubLogin
      ? { login: user.githubLogin, avatarUrl: user.avatarUrl }
      : null,
    source: record.source,
    hasStoredResume: record.hasStoredResume,
    emailDelivery,
    gistWrite,
  });
};

/** The signed-in user's account: where the resume comes from. */
export const AccountHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'account',
  (handlers) =>
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const current = Effect.gen(function* () {
        const user = yield* CurrentUser;
        const record = yield* accounts.account(user.id);
        if (!record) return yield* Effect.die(`no account for ${user.id}`);
        return toAccount(
          record,
          accounts.emailDelivery,
          yield* accounts.canWriteGist(user.id)
        );
      });
      return handlers.handleAll({
        get: () => current,
        saveResume: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            const saved = yield* accounts.saveResume(
              user.id,
              payload.resume,
              userActor
            );
            yield* track(user.id, 'resume_saved', {
              via: 'dashboard',
              ...savedProperties(saved, 'editor'),
            });
            return yield* current;
          }),
        setTheme: ({ payload }) =>
          Effect.gen(function* () {
            if (!Object.hasOwn(THEME_METADATA, payload.theme))
              return yield* new UnknownTheme();
            const user = yield* CurrentUser;
            const saved = yield* accounts.setTheme(
              user.id,
              payload.theme,
              userActor
            );
            yield* track(user.id, 'resume_saved', {
              via: 'dashboard',
              ...savedProperties(saved, 'editor'),
            });
            yield* track(user.id, 'theme_chosen', {
              theme: payload.theme,
              from: 'gallery',
            });
            return yield* current;
          }),
        rename: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* accounts.rename(user.id, payload.username);
            yield* track(user.id, 'username_changed');
            return yield* current;
          }),
        delete: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* accounts.deleteAccount(user.id, payload.confirm);
            yield* clearSession;
            yield* track(user.id, 'account_deleted');
          }),
        setSource: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* accounts.setSource(user.id, payload.source);
            yield* track(user.id, 'resume_source_changed', {
              source: payload.source,
            });
            return yield* current;
          }),
      });
    })
);
