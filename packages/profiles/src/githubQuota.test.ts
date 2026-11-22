import { Duration, Effect, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { GHOST_TTL } from './mirror';
import { Profiles } from './profiles';
import { memoryStore, ProfileStore } from './store';
import { fakeGithub } from './test/fakeGithub';
import type { Username } from './username';

const foo = 'foo' as Username;
const resume = { basics: { name: 'Foo' } };

const setup = (token?: string) => {
  const github = fakeGithub();
  github.state.users.set('foo', {
    id: 7,
    gists: [{ id: 'g1', files: { 'resume.json': JSON.stringify(resume) } }],
  });
  const layer = Profiles.layer.pipe(
    Layer.provideMerge(
      Layer.mergeAll(
        github.layer(token),
        Layer.succeed(ProfileStore, memoryStore(new Map()))
      )
    )
  );
  const run = <A, E>(effect: Effect.Effect<A, E, Profiles | ProfileStore>) =>
    Effect.runPromise(
      effect.pipe(Effect.provide(Layer.merge(layer, TestClock.layer())))
    );
  const schemes = () =>
    github.state.requests.map((r) => r.auth?.split(' ')[0] ?? 'none');
  return { github, run, schemes };
};

const settle = Effect.repeat(Effect.yieldNow, { times: 20 });

describe('GitHub quota', () => {
  it('skips a rejected token after the first 401', () => {
    const { github, run, schemes } = setup('old-token');
    github.state.revoked.add('old-token');
    return run(
      Effect.gen(function* () {
        const profiles = yield* Profiles;
        yield* profiles.resume(foo);
        yield* profiles.resume('bar' as Username).pipe(Effect.ignore);
        expect(schemes()).toEqual(['Bearer', 'Basic', 'Basic', 'Basic']);
      })
    );
  });

  it('moves to the next credential when one is rate limited', () => {
    const { github, run, schemes } = setup('token');
    github.state.limited.add('Bearer');
    return run(
      Effect.gen(function* () {
        const profiles = yield* Profiles;
        expect(yield* profiles.resume(foo)).toMatchObject({ resume });
        yield* profiles.resume('bar' as Username).pipe(Effect.ignore);
        // The limited token is not asked again until its limit resets.
        expect(schemes()).toEqual(['Bearer', 'Basic', 'Basic', 'Basic']);
      })
    );
  });

  it('serves copies without refreshing them when requests run low', () => {
    // The token is rejected, so the OAuth app's requests are all there are.
    const { github, run } = setup('old-token');
    github.state.revoked.add('old-token');
    github.state.remaining = 100;
    return run(
      Effect.gen(function* () {
        const profiles = yield* Profiles;
        yield* profiles.resume(foo);
        const asked = github.state.requests.length;
        yield* TestClock.adjust(Duration.sum(GHOST_TTL, Duration.seconds(1)));
        expect(yield* profiles.resume(foo)).toMatchObject({ resume });
        yield* settle;
        expect(github.state.requests).toHaveLength(asked);
      })
    );
  });

  it('refreshes in the background while requests are plentiful', () => {
    const { github, run } = setup('token');
    github.state.remaining = 4000;
    return run(
      Effect.gen(function* () {
        const profiles = yield* Profiles;
        yield* profiles.resume(foo);
        const asked = github.state.requests.length;
        yield* TestClock.adjust(Duration.sum(GHOST_TTL, Duration.seconds(1)));
        yield* profiles.resume(foo);
        yield* settle;
        expect(github.state.requests.length).toBeGreaterThan(asked);
      })
    );
  });
});
