import type { Username } from '@repo/profiles';
import { Profiles } from '@repo/profiles';
import { Effect } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { Accounts } from './accounts';
import { DISCORD } from './emails';
import { accountsStack } from './test/stack';

const ada = {
  email: 'ada@example.com',
  password: 'correct horse battery',
  username: 'ada',
};

describe('password reset', () => {
  it('emails a link, sets the new password, and ends other sessions', async () => {
    const { run, mail } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const { token: old } = yield* accounts.signUp(ada);
        yield* accounts.requestPasswordReset('nobody@example.com'); // no account: silently nothing
        expect(mail).toHaveLength(1);
        yield* accounts.requestPasswordReset('ADA@example.com');
        const email = mail.at(-1);
        expect(email?.subject).toBe('Reset your JSON Resume password');
        expect(email?.text).toContain(DISCORD);
        expect(email?.html).toContain('no-reply');
        const link =
          /reset-password\?token=([\w-]+)/.exec(email?.text ?? '')?.[1] ?? '';

        const signedIn = yield* accounts.resetPassword(
          link,
          'a brand new password'
        );
        expect(signedIn.user.emailVerified).toBe(true);
        expect((yield* Effect.flip(accounts.session(old)))._tag).toBe(
          'Unauthorized'
        );
        expect(
          (yield* Effect.flip(accounts.resetPassword(link, 'again and again')))
            ._tag
        ).toBe('InvalidLink');
        yield* accounts.signIn({
          email: ada.email,
          password: 'a brand new password',
        });
      })
    );
  });
});

describe('renaming', () => {
  it('moves the page and its views, and the old name redirects', async () => {
    const { run } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const profiles = yield* Profiles;
        const sql = yield* SqlClient.SqlClient;
        const { user } = yield* accounts.signUp(ada);
        yield* sql`INSERT INTO app.resume_views (id, username, kind, visitor)
          VALUES ('00000000-0000-4000-8000-000000000001', 'ada', 'page', 'v')`;
        const renamed = yield* accounts.rename(user.id, 'Ada-L');
        expect(renamed.username).toBe('ada-l');
        expect(yield* profiles.resume('ada' as Username)).toEqual({
          _tag: 'Moved',
          username: 'ada-l',
        });
        const views = yield* sql<{
          username: string;
        }>`SELECT username FROM app.resume_views`;
        expect(views.map((v) => v.username)).toEqual(['ada-l']);

        // The old name is held for them, and they can go back to it.
        const other = yield* accounts.signUp({
          ...ada,
          email: 'b@x.io',
          username: 'bea',
        });
        expect(
          yield* Effect.flip(accounts.rename(other.user.id, 'ada'))
        ).toMatchObject({ reason: 'taken' });
        expect((yield* accounts.rename(user.id, 'ada')).username).toBe('ada');
        expect(
          yield* Effect.flip(accounts.rename(user.id, 'ghosty'))
        ).toMatchObject({ reason: 'github' });

        // Once the redirect retires, the name is anyone's.
        yield* accounts.rename(user.id, 'ada-lovelace');
        yield* sql`UPDATE app.profiles SET retired_until = now() - interval '1 day' WHERE username = 'ada'`;
        expect((yield* accounts.rename(other.user.id, 'ada')).username).toBe(
          'ada'
        );
      })
    );
  });
});

describe('deleting', () => {
  it('needs the username typed back, then removes the account, its names and views', async () => {
    const { run } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const sql = yield* SqlClient.SqlClient;
        const { user } = yield* accounts.signUp(ada);
        yield* accounts.rename(user.id, 'ada-l');
        yield* sql`INSERT INTO app.resume_views (id, username, kind, visitor)
          VALUES ('00000000-0000-4000-8000-000000000002', 'ada-l', 'page', 'v')`;
        expect(
          (yield* Effect.flip(accounts.deleteAccount(user.id, 'ada')))._tag
        ).toBe('ConfirmationMismatch');
        yield* accounts.deleteAccount(user.id, 'ADA-L');
        const left = yield* sql<{ n: number }>`SELECT
          (SELECT count(*) FROM app.users)::int + (SELECT count(*) FROM app.profiles)::int
          + (SELECT count(*) FROM app.resume_views)::int AS n`;
        expect(left[0]?.n).toBe(0);
        // The name is free straight away.
        const again = yield* accounts.signUp({ ...ada, email: 'new@x.io' });
        expect(again.user.username).toBe('ada');
      })
    );
  });
});
