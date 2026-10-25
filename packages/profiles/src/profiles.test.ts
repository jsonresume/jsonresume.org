import { describe, expect, it } from 'vitest';
import { Duration, Effect, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { Profiles } from './profiles';
import { memoryStore, ProfileStore, type Profile } from './store';
import { fakeGithub } from './test/fakeGithub';
import type { Username } from './username';

const foo = 'foo' as Username;
const resume = { basics: { name: 'Foo' } };

const setup = (token?: string, seed: Array<Profile> = []) => {
  const github = fakeGithub();
  github.state.users.set('foo', {
    id: 7,
    gists: [
      { id: 'g1', files: { 'notes.md': '# hi' } },
      {
        id: 'g2',
        files: {
          'resume.json': JSON.stringify(resume),
          'other.json': '{"x":1}',
        },
      },
    ],
  });
  const layer = Profiles.layer.pipe(
    Layer.provideMerge(
      Layer.mergeAll(
        github.layer(token),
        Layer.succeed(
          ProfileStore,
          memoryStore(new Map(seed.map((p) => [p.username, p])))
        )
      )
    )
  );
  return { github, layer };
};

/** Run with the layer and a test clock, so tests move time by hand. */
const run =
  <ROut>(layer: Layer.Layer<ROut>) =>
  <A, E>(effect: Effect.Effect<A, E, ROut>) =>
    Effect.runPromise(
      effect.pipe(Effect.provide(Layer.merge(layer, TestClock.layer())))
    );

describe('Profiles.resume', () => {
  it('creates a ghost from the resume.json gist', () => {
    const { github, layer } = setup();
    return Effect.gen(function* () {
      const result = yield* (yield* Profiles).resume(foo);
      expect(result).toEqual({
        username: 'foo',
        resume,
        _tag: 'Resume',
        source: 'ghost',
        stale: false,
      });
      const ghost = yield* (yield* ProfileStore).find('foo');
      expect(ghost).toMatchObject({ githubId: 7, gistId: 'g2', resume });
      expect(github.state.requests.map((r) => r.path)).toEqual([
        '/users/foo/gists',
        '/gists/g2',
      ]);
    }).pipe(run(layer));
  });

  it('serves the ghost for a minute, then reads the known gist again', () => {
    const { github, layer } = setup();
    return Effect.gen(function* () {
      const profiles = yield* Profiles;
      yield* profiles.resume(foo);
      yield* profiles.resume(foo);
      expect(github.state.requests).toHaveLength(2);
      yield* TestClock.adjust(Duration.seconds(61));
      yield* profiles.resume(foo);
      expect(github.state.requests.at(-1)?.path).toBe('/gists/g2');
      expect(github.state.requests).toHaveLength(3);
    }).pipe(run(layer));
  });

  it('serves the last copy, marked stale, when GitHub is down', () => {
    const { github, layer } = setup();
    return Effect.gen(function* () {
      const profiles = yield* Profiles;
      yield* profiles.resume(foo);
      yield* TestClock.adjust(Duration.minutes(5));
      github.state.status = 503;
      expect(yield* profiles.resume(foo)).toMatchObject({
        resume,
        stale: true,
      });
    }).pipe(run(layer));
  });

  it('fails with GithubUnavailable when there is no copy', () => {
    const { github, layer } = setup();
    github.state.status = 403;
    return Effect.gen(function* () {
      const error = yield* Effect.flip((yield* Profiles).resume(foo));
      expect(error).toMatchObject({ _tag: 'GithubUnavailable', status: 403 });
    }).pipe(run(layer));
  });

  it('removes the ghost when the gist is gone', () => {
    const { github, layer } = setup();
    return Effect.gen(function* () {
      const profiles = yield* Profiles;
      yield* profiles.resume(foo);
      github.state.users.set('foo', { id: 7, gists: [] });
      yield* TestClock.adjust(Duration.minutes(5));
      const error = yield* Effect.flip(profiles.resume(foo));
      expect(error).toMatchObject({
        _tag: 'ProfileNotFound',
        reason: 'no-gist',
      });
      expect(yield* (yield* ProfileStore).find('foo')).toBeUndefined();
    }).pipe(run(layer));
  });

  it('tells a missing user from a missing gist', () => {
    const { layer } = setup();
    return Effect.gen(function* () {
      const error = yield* Effect.flip(
        (yield* Profiles).resume('nobody' as Username)
      );
      expect(error).toMatchObject({
        _tag: 'ProfileNotFound',
        reason: 'no-user',
      });
    }).pipe(run(layer));
  });

  it('reads other gist files live, without keeping them', () => {
    const { layer } = setup();
    return Effect.gen(function* () {
      const result = yield* (yield* Profiles).resume(foo, {
        file: 'other.json',
      });
      expect(result).toMatchObject({ resume: { x: 1 }, source: 'gist' });
      expect(yield* (yield* ProfileStore).find('foo')).toBeUndefined();
    }).pipe(run(layer));
  });

  it('reports a gist that is not JSON', () => {
    const { github, layer } = setup();
    github.state.users.set('foo', {
      id: 7,
      gists: [{ id: 'g3', files: { 'resume.json': '{nope' } }],
    });
    return Effect.gen(function* () {
      const error = yield* Effect.flip((yield* Profiles).resume(foo));
      expect(error._tag).toBe('ResumeNotJson');
    }).pipe(run(layer));
  });

  it('falls back to the OAuth app when the token is revoked', () => {
    const { github, layer } = setup('old-token');
    github.state.revoked.add('old-token');
    return Effect.gen(function* () {
      yield* (yield* Profiles).resume(foo);
      expect(
        github.state.requests.slice(0, 2).map((r) => r.auth?.split(' ')[0])
      ).toEqual(['Bearer', 'Basic']);
    }).pipe(run(layer));
  });

  const account = (
    over: Partial<Extract<Profile, { kind: 'account' }>> = {}
  ): Profile => ({
    kind: 'account',
    username: 'mine',
    userId: 'u1',
    verified: true,
    githubLogin: 'foo',
    source: 'gist',
    mirror: undefined,
    stored: undefined,
    ...over,
  });

  it('serves an account from its linked GitHub login, keeping the copy on it', () => {
    const { layer } = setup(undefined, [account()]);
    return Effect.gen(function* () {
      const result = yield* (yield* Profiles).resume('mine' as Username);
      expect(result).toMatchObject({
        _tag: 'Resume',
        source: 'account',
        resume,
      });
      const stored = yield* (yield* ProfileStore).find('mine');
      expect(stored?.kind === 'account' && stored.mirror?.gistId).toBe('g2');
    }).pipe(run(layer));
  });

  it('serves an account’s stored copy when it chose one', () => {
    const { github, layer } = setup(undefined, [
      account({ source: 'stored', stored: { basics: { name: 'Saved' } } }),
    ]);
    return Effect.gen(function* () {
      const result = yield* (yield* Profiles).resume('mine' as Username);
      expect(result).toMatchObject({ resume: { basics: { name: 'Saved' } } });
      expect(github.state.requests).toHaveLength(0);
    }).pipe(run(layer));
  });

  it('keeps unverified or empty accounts unpublished', () => {
    const { layer } = setup(undefined, [
      account({ verified: false }),
      account({ username: 'empty', source: 'stored' }),
    ]);
    return Effect.gen(function* () {
      const profiles = yield* Profiles;
      for (const name of ['mine', 'empty']) {
        const error = yield* Effect.flip(profiles.resume(name as Username));
        expect(error).toMatchObject({
          _tag: 'ProfileNotFound',
          reason: 'unpublished',
        });
      }
    }).pipe(run(layer));
  });

  it('redirects an alias to its account', () => {
    const { layer } = setup(undefined, [
      { kind: 'alias', username: 'foo', target: 'mine' },
    ]);
    return Effect.gen(function* () {
      expect(yield* (yield* Profiles).resume(foo)).toEqual({
        _tag: 'Moved',
        username: 'mine',
      });
    }).pipe(run(layer));
  });
});
