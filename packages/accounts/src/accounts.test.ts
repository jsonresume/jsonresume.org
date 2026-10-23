import type { Username } from '@repo/profiles';
import { Profiles } from '@repo/profiles';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { Accounts } from './accounts';
import { accountsStack } from './test/stack';

const signUp = {
  email: 'Ada@Example.com',
  password: 'correct horse battery',
  username: 'Ada',
};
const identity = (id: number, login: string, email: string | null = null) => ({
  id,
  login,
  avatarUrl: null,
  email,
});

describe('email accounts', () => {
  it('signs up, holds the name unpublished, and publishes once verified', async () => {
    const { run, mail, lastToken } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const profiles = yield* Profiles;
        const { user, token } = yield* accounts.signUp(signUp);
        expect(user).toMatchObject({
          username: 'ada',
          email: 'ada@example.com',
          emailVerified: false,
        });
        expect((yield* accounts.session(token)).id).toBe(user.id);
        expect(mail[0]?.text).toContain('/api/auth/verify?token=');

        yield* accounts.saveResume(user.id, { basics: { name: 'Ada' } });
        const before = yield* Effect.flip(profiles.resume('ada' as Username));
        expect(before).toMatchObject({ reason: 'unpublished' });

        expect(yield* accounts.verifyEmail(lastToken())).toBe(user.id);
        expect(yield* accounts.verifyEmail(lastToken())).toBeUndefined();
        expect(yield* profiles.resume('ada' as Username)).toMatchObject({
          source: 'account',
          resume: { basics: { name: 'Ada' } },
        });
      })
    );
  });

  it('refuses taken, reserved and GitHub names, and a second account per email', async () => {
    const { run } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        yield* accounts.signUp(signUp);
        const reasons = [];
        for (const username of ['ada', 'admin', 'ghosty', 'not valid']) {
          const error = yield* Effect.flip(
            accounts.signUp({
              ...signUp,
              email: `${username.length}@x.io`,
              username,
            })
          );
          reasons.push(
            error._tag === 'UsernameUnavailable' ? error.reason : error._tag
          );
        }
        expect(reasons).toEqual(['taken', 'reserved', 'github', 'invalid']);
        const again = yield* Effect.flip(
          accounts.signUp({ ...signUp, username: 'other' })
        );
        expect(again._tag).toBe('EmailTaken');
      })
    );
  });

  it('signs in with the right password only, and signs out', async () => {
    const { run } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        yield* accounts.signUp(signUp);
        const wrong = yield* Effect.flip(
          accounts.signIn({
            email: 'ada@example.com',
            password: 'nope nope nope',
          })
        );
        const nobody = yield* Effect.flip(
          accounts.signIn({ email: 'who@x.io', password: 'whatever!!' })
        );
        expect([wrong._tag, nobody._tag]).toEqual([
          'InvalidCredentials',
          'InvalidCredentials',
        ]);
        const { token } = yield* accounts.signIn({
          email: ' ADA@example.com ',
          password: signUp.password,
        });
        yield* accounts.signOut(token);
        expect((yield* Effect.flip(accounts.session(token)))._tag).toBe(
          'Unauthorized'
        );
      })
    );
  });
});

describe('GitHub accounts', () => {
  it('claims the ghost at their login and keeps serving the gist', async () => {
    const { run } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const profiles = yield* Profiles;
        yield* profiles.resume('ghosty' as Username); // creates the ghost
        const result = yield* accounts.githubSignIn(
          identity(5, 'Ghosty', 'g@x.io')
        );
        expect(result._tag).toBe('SignedIn');
        if (result._tag !== 'SignedIn') return;
        expect(result.user).toMatchObject({
          username: 'ghosty',
          email: 'g@x.io',
          emailVerified: true,
        });
        expect(yield* profiles.resume('ghosty' as Username)).toMatchObject({
          source: 'account',
          resume: { basics: { name: 'Ghosty' } },
        });
        const again = yield* accounts.githubSignIn(identity(5, 'ghosty'));
        expect(again._tag === 'SignedIn' && again.user.id).toBe(result.user.id);
      })
    );
  });

  it('asks for another name when an email account holds the login', async () => {
    const { run } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        yield* accounts.signUp({ ...signUp, username: 'plain' });
        expect((yield* accounts.githubSignIn(identity(6, 'plain')))._tag).toBe(
          'ChooseUsername'
        );
        const taken = yield* Effect.flip(
          accounts.completeGithub(identity(6, 'plain'), 'plain')
        );
        expect(taken).toMatchObject({ reason: 'taken' });
        const { user } = yield* accounts.completeGithub(
          identity(6, 'plain'),
          'plain-dev'
        );
        expect(user).toMatchObject({
          username: 'plain-dev',
          githubLogin: 'plain',
        });
      })
    );
  });

  it('merges a linked ghost into the account as a redirect', async () => {
    const { run } = accountsStack();
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const profiles = yield* Profiles;
        yield* profiles.resume('ghosty' as Username);
        const { user } = yield* accounts.signUp(signUp);
        // GitHub's verified email matches, so linking verifies the account too.
        const linked = yield* accounts.linkGithub(
          user.id,
          identity(5, 'ghosty', 'ada@example.com')
        );
        expect(linked).toMatchObject({
          githubLogin: 'ghosty',
          emailVerified: true,
        });
        expect(yield* profiles.resume('ghosty' as Username)).toEqual({
          _tag: 'Moved',
          username: 'ada',
        });
        expect(yield* profiles.resume('ada' as Username)).toMatchObject({
          resume: { basics: { name: 'Ghosty' } },
        });

        const other = yield* accounts.signUp({
          ...signUp,
          email: 'b@x.io',
          username: 'bea',
        });
        const error = yield* Effect.flip(
          accounts.linkGithub(other.user.id, identity(5, 'ghosty'))
        );
        expect(error._tag).toBe('GithubTaken');
      })
    );
  });
});
