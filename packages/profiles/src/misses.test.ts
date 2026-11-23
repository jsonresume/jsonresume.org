import { Duration, Effect, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { MISS_TTL } from './misses';
import { Profiles } from './profiles';
import { memoryStore, ProfileStore } from './store';
import { fakeGithub } from './test/fakeGithub';
import type { Username } from './username';

const setup = () => {
  const github = fakeGithub();
  github.state.users.set('nogist', { id: 3, gists: [] });
  const layer = Profiles.layer.pipe(
    Layer.provideMerge(
      Layer.mergeAll(
        github.layer(),
        Layer.succeed(ProfileStore, memoryStore(new Map()))
      )
    )
  );
  const run = <A, E>(effect: Effect.Effect<A, E, Profiles | ProfileStore>) =>
    Effect.runPromise(
      effect.pipe(Effect.provide(Layer.merge(layer, TestClock.layer())))
    );
  return { github, run };
};

const visit = (name: string) =>
  Effect.gen(function* () {
    const profiles = yield* Profiles;
    return yield* Effect.flip(profiles.resume(name as Username));
  });
const past = (ttl: Duration.Duration) =>
  TestClock.adjust(Duration.sum(ttl, Duration.seconds(1)));

describe('missing resumes', () => {
  it('asks GitHub about an unknown login once an hour', () => {
    const { github, run } = setup();
    return run(
      Effect.gen(function* () {
        expect(yield* visit('ghost-login')).toMatchObject({
          reason: 'no-user',
        });
        const asked = github.state.requests.length;
        expect(yield* visit('Ghost-Login')).toMatchObject({
          reason: 'no-user',
        });
        expect(github.state.requests).toHaveLength(asked);
        yield* past(MISS_TTL['no-user']);
        yield* visit('ghost-login');
        expect(github.state.requests.length).toBeGreaterThan(asked);
      })
    );
  });

  it('finds a gist made after a miss within minutes', () => {
    const { github, run } = setup();
    return run(
      Effect.gen(function* () {
        expect(yield* visit('nogist')).toMatchObject({ reason: 'no-gist' });
        github.state.users.set('nogist', {
          id: 3,
          gists: [{ id: 'g9', files: { 'resume.json': '{"basics":{}}' } }],
        });
        expect(yield* visit('nogist')).toMatchObject({ reason: 'no-gist' });
        yield* past(MISS_TTL['no-gist']);
        const profiles = yield* Profiles;
        expect(yield* profiles.resume('nogist' as Username)).toMatchObject({
          resume: { basics: {} },
        });
      })
    );
  });
});
