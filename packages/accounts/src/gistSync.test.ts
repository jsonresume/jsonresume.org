import { Profiles, type Username } from '@repo/profiles';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { Accounts } from './accounts';
import { accountsStack } from './test/stack';

const grant = (
  token: string,
  scopes = ['read:user', 'user:email', 'gist']
) => ({ token, scopes });
const ghosty = (token: string, scopes?: string[]) => ({
  id: 5,
  login: 'ghosty',
  avatarUrl: null,
  email: null,
  grant: grant(token, scopes),
});

describe('saving to the gist', () => {
  it('writes the editor’s save to the gist, which stays the source', async () => {
    const { run, gists } = accountsStack();
    gists.owners.set('tok', 5);
    gists.gists.set('g5', { ownerId: 5, content: '{}' });
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const profiles = yield* Profiles;
        yield* profiles.resume('ghosty' as Username); // the ghost, mirroring gist g5
        const result = yield* accounts.githubSignIn(ghosty('tok'));
        if (result._tag !== 'SignedIn') throw new Error('expected sign-in');
        const id = result.user.id;
        expect(yield* accounts.canWriteGist(id)).toBe(true);

        yield* accounts.saveResume(id, { basics: { name: 'Saved here' } });
        expect(JSON.parse(gists.gists.get('g5')?.content ?? '')).toEqual({
          basics: { name: 'Saved here' },
        });
        const account = yield* accounts.account(id);
        expect(account?.source).toBe('gist');
        expect(account?.hasStoredResume).toBe(false);
        // The page shows it at once, without waiting for a refresh.
        expect(yield* profiles.resume('ghosty' as Username)).toMatchObject({
          resume: { basics: { name: 'Saved here' } },
        });

        // Edited on GitHub since: the editor opens on GitHub's version.
        gists.gists.set('g5', {
          ownerId: 5,
          content: '{"basics":{"name":"Edited on GitHub"}}',
        });
        expect((yield* accounts.currentResume(id)).resume).toEqual({
          basics: { name: 'Edited on GitHub' },
        });
      })
    );
  });

  it('creates a resume.json gist when they have none', async () => {
    const { run, gists } = accountsStack();
    gists.owners.set('tok', 6);
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const result = yield* accounts.githubSignIn({
          id: 6,
          login: 'plain',
          avatarUrl: null,
          email: null,
          grant: grant('tok'),
        });
        if (result._tag !== 'SignedIn') throw new Error('expected sign-in');
        yield* accounts.saveResume(result.user.id, {
          basics: { name: 'First' },
        });
        expect([...gists.gists.values()].map((g) => g.ownerId)).toEqual([6]);
      })
    );
  });

  it('asks for the gist permission when GitHub didn’t grant it, and says when GitHub is down', async () => {
    const { run, gists } = accountsStack();
    gists.owners.set('tok', 6);
    await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const result = yield* accounts.githubSignIn({
          id: 6,
          login: 'plain',
          avatarUrl: null,
          email: null,
          grant: grant('tok', ['read:user']),
        });
        if (result._tag !== 'SignedIn') throw new Error('expected sign-in');
        const id = result.user.id;
        expect(yield* accounts.canWriteGist(id)).toBe(false);
        expect(
          (yield* Effect.flip(accounts.saveResume(id, { basics: {} })))._tag
        ).toBe('GistPermissionNeeded');

        // Signing in again with the permission fixes it.
        yield* accounts.githubSignIn({
          id: 6,
          login: 'plain',
          avatarUrl: null,
          email: null,
          grant: grant('tok'),
        });
        gists.down = true;
        expect(
          (yield* Effect.flip(accounts.saveResume(id, { basics: {} })))._tag
        ).toBe('GithubUnreachable');
      })
    );
  });
});
