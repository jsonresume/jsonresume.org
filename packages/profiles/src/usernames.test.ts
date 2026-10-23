import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { memoryStore, ProfileStore, type Profile } from './store';
import { fakeGithub } from './test/fakeGithub';
import { Usernames } from './usernames';

const setup = (seed: Array<Profile> = []) => {
  const github = fakeGithub();
  github.state.users.set('ghosty', {
    id: 5,
    gists: [{ id: 'g', files: { 'resume.json': '{}' } }],
  });
  github.state.users.set('plain', { id: 6, gists: [] });
  const layer = Usernames.layer.pipe(
    Layer.provide(
      Layer.mergeAll(
        github.layer(),
        Layer.succeed(
          ProfileStore,
          memoryStore(new Map(seed.map((p) => [p.username, p])))
        )
      )
    )
  );
  const check = (
    name: string,
    claimant?: { githubId: number; githubLogin: string }
  ) =>
    Effect.runPromise(
      Effect.gen(function* () {
        return yield* (yield* Usernames).check(name, claimant);
      }).pipe(Effect.provide(layer))
    );
  return { github, check };
};

describe('Usernames.check', () => {
  it('gives out free names: no GitHub user, or one without a resume', async () => {
    const { check } = setup();
    expect(await check('nobody-here')).toEqual({ available: true });
    expect(await check('plain')).toEqual({ available: true });
  });

  it('keeps names that are invalid, ours, or held by an account or alias', async () => {
    const { check } = setup([
      { kind: 'alias', username: 'old', target: 'new' },
      {
        kind: 'account',
        username: 'held',
        userId: 'u',
        verified: false,
        githubLogin: undefined,
        source: 'stored',
        mirror: undefined,
        stored: undefined,
      },
    ]);
    expect(await check('Bad_Name')).toMatchObject({ reason: 'invalid' });
    expect(await check('admin')).toMatchObject({ reason: 'reserved' });
    expect(await check('old')).toMatchObject({ reason: 'taken' });
    expect(await check('held')).toMatchObject({ reason: 'taken' });
  });

  it('reserves a GitHub login with a resume gist for its owner', async () => {
    const { check } = setup();
    expect(await check('ghosty')).toMatchObject({ reason: 'github' });
    expect(
      await check('ghosty', { githubId: 5, githubLogin: 'Ghosty' })
    ).toEqual({ available: true });
  });

  it('lets only the owner claim an existing ghost', async () => {
    const ghost: Profile = {
      kind: 'ghost',
      username: 'ghosty',
      githubId: 5,
      gistId: 'g',
      resume: {},
      fetchedAt: new Date(0),
    };
    const { check } = setup([ghost]);
    expect(
      await check('ghosty', { githubId: 9, githubLogin: 'other' })
    ).toMatchObject({ reason: 'github' });
    expect(
      await check('ghosty', { githubId: 5, githubLogin: 'ghosty' })
    ).toEqual({ available: true });
  });

  it('refuses names while GitHub is down', async () => {
    const { github, check } = setup();
    github.state.status = 503;
    await expect(check('anything')).rejects.toThrow();
  });
});
