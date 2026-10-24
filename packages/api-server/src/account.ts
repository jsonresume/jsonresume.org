import { Accounts, type AccountRecord } from '@repo/accounts';
import { Account, CurrentUser, JsonResumeApi } from '@repo/api';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { clearSession } from './http';

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
            yield* accounts.saveResume(user.id, payload.resume);
            return yield* current;
          }),
        rename: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* accounts.rename(user.id, payload.username);
            return yield* current;
          }),
        delete: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* accounts.deleteAccount(user.id, payload.confirm);
            yield* clearSession;
          }),
        setSource: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* CurrentUser;
            yield* accounts.setSource(user.id, payload.source);
            return yield* current;
          }),
      });
    })
);
