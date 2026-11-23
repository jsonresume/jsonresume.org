import { Duration, Effect, Layer } from 'effect';
import { TestClock } from 'effect/testing';
import { describe, expect, it } from 'vitest';
import { MISS_TTL } from './misses';
import { Profiles } from './profiles';
import { SCAN_TRUST } from './scans';
import { memoryStore, ProfileStore } from './store';
import { fakeGithub } from './test/fakeGithub';
import type { Username } from './username';

const resume = { basics: { name: 'Prolific' } };
const gists = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `g${i}`,
    files: { [`snippet-${i}.js`]: '1' },
    // The test clock starts at 0: these were last touched the day before.
    updated: -Duration.toMillis(Duration.days(1)),
  }));

const setup = (count: number) => {
  const github = fakeGithub();
  github.state.users.set('prolific', { id: 9, gists: gists(count) });
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
  const listings = () =>
    github.state.requests.filter((r) => r.path === '/users/prolific/gists');
  return { github, run, listings };
};

const visit = Effect.gen(function* () {
  const profiles = yield* Profiles;
  return yield* Effect.result(profiles.resume('prolific' as Username));
});
const after = (d: Duration.Duration) =>
  TestClock.adjust(Duration.sum(d, Duration.seconds(1)));

describe('re-checking a user with many gists', () => {
  it('asks only for gists updated since the last full scan', () => {
    const { run, listings } = setup(250);
    return run(
      Effect.gen(function* () {
        yield* visit;
        expect(listings()).toHaveLength(3);
        yield* after(MISS_TTL['no-gist']);
        yield* visit;
        expect(listings()).toHaveLength(4);
        expect(listings()[3]?.search).toContain('since=');
      })
    );
  });

  it('finds a resume gist made after the scan', () => {
    const { github, run } = setup(250);
    return run(
      Effect.gen(function* () {
        yield* visit;
        yield* after(MISS_TTL['no-gist']);
        github.state.users.get('prolific')?.gists.unshift({
          id: 'resume',
          files: { 'resume.json': JSON.stringify(resume) },
          updated: Duration.toMillis(Duration.minutes(3)),
        });
        const found = yield* visit;
        expect(found._tag).toBe('Success');
      })
    );
  });

  it('scans in full again once the last scan is old', () => {
    const { run, listings } = setup(250);
    return run(
      Effect.gen(function* () {
        yield* visit;
        yield* after(SCAN_TRUST);
        yield* visit;
        expect(listings()).toHaveLength(6);
        expect(listings()[5]?.search).not.toContain('since=');
      })
    );
  });

  it('does not trust a scan cut short by the page limit', () => {
    const { run, listings } = setup(1100);
    return run(
      Effect.gen(function* () {
        yield* visit;
        expect(listings()).toHaveLength(10);
        yield* after(MISS_TTL['no-gist']);
        yield* visit;
        expect(listings()).toHaveLength(20);
        expect(listings()[10]?.search).not.toContain('since=');
      })
    );
  });
});
