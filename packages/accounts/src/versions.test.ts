import completeResume from '@jsonresume/sample-data/complete-resume.json';
import { ResumeVersions, userActor, type Actor } from '@repo/resume-versions';
import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { Accounts } from './accounts';
import { accountsStack } from './test/stack';

const claude: Actor = { kind: 'assistant', id: 'jrc_1', name: 'Claude' };
const own = {
  basics: { name: 'Ada Lovelace' },
  work: [{ name: 'Analytical Engines', position: 'Programmer' }],
  skills: [{ name: 'Mathematics' }],
};

const signUp = Effect.gen(function* () {
  const accounts = yield* Accounts;
  const { user } = yield* accounts.signUp({
    email: 'ada@example.com',
    password: 'correct horse battery',
    username: 'ada',
  });
  return user.id;
});

describe('versions of saved resumes', () => {
  it('keeps every changed save with who made it, and says what each was', async () => {
    const { run } = accountsStack();
    const result = await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const versions = yield* ResumeVersions;
        const id = yield* signUp;
        const sample = yield* accounts.saveResume(
          id,
          completeResume,
          userActor
        );
        const real = yield* accounts.saveResume(id, own, claude);
        const again = yield* accounts.saveResume(id, own, userActor);
        const page = yield* versions.list(id, {});
        return { sample, real, again, page };
      })
    );
    expect(result.sample).toMatchObject({
      version: 1,
      first: true,
      real: false,
    });
    expect(result.real).toEqual({
      version: 2,
      first: false,
      real: true,
      sections: 3,
    });
    // The same JSON again: saved, but no new version.
    expect(result.again).toMatchObject({ version: null, first: false });
    expect(result.page.versions.map((v) => [v.version, v.actor.kind])).toEqual([
      [2, 'assistant'],
      [1, 'user'],
    ]);
  });

  it('restores an old version as a new one, giving back its exact JSON', async () => {
    const { run } = accountsStack();
    const result = await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const versions = yield* ResumeVersions;
        const id = yield* signUp;
        yield* accounts.saveResume(id, own, userActor);
        yield* accounts.saveResume(id, { basics: { name: 'Oops' } }, claude);
        const restored = yield* accounts.restoreVersion(id, 1, userActor);
        const missing = yield* Effect.flip(
          accounts.restoreVersion(id, 42, userActor)
        );
        return {
          restored,
          missing: missing._tag,
          latest: yield* versions.latest(id),
          current: (yield* accounts.currentResume(id)).resume,
          count: (yield* versions.list(id, {})).versions.length,
        };
      })
    );
    expect(result.restored.version).toBe(3);
    expect(result.missing).toBe('VersionNotFound');
    expect(result.latest).toMatchObject({
      version: 3,
      actor: { kind: 'restore', id: null, name: null },
      note: 'Restored version 1',
    });
    expect(JSON.stringify(result.latest?.resume)).toBe(JSON.stringify(own));
    expect(result.current).toEqual(own);
    expect(result.count).toBe(3);
  });

  it('records what was written to a gist, and nothing when GitHub fails', async () => {
    const { run, gists } = accountsStack();
    gists.owners.set('tok', 6);
    const result = await run(
      Effect.gen(function* () {
        const accounts = yield* Accounts;
        const versions = yield* ResumeVersions;
        const signedIn = yield* accounts.githubSignIn({
          id: 6,
          login: 'plain',
          avatarUrl: null,
          email: null,
          grant: { token: 'tok', scopes: ['read:user', 'gist'] },
        });
        if (signedIn._tag !== 'SignedIn') throw new Error('expected sign-in');
        const id = signedIn.user.id;
        yield* accounts.saveResume(id, own, claude);
        gists.down = true;
        yield* Effect.flip(
          accounts.saveResume(id, { basics: { name: 'Lost' } }, userActor)
        );
        return yield* versions.list(id, {});
      })
    );
    expect(result.versions.map((v) => [v.version, v.actor.name])).toEqual([
      [1, 'Claude'],
    ]);
  });
});
