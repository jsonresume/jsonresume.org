import { ProfileNotFound, Profiles, type Username } from '@repo/profiles';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { timelineOutcome } from './timeline';

const profiles = Layer.succeed(
  Profiles,
  Profiles.of({
    resume: (username: Username) =>
      username === 'old'
        ? Effect.succeed({ _tag: 'Moved', username: 'new' })
        : username === 'ada'
        ? Effect.succeed({
            _tag: 'Resume',
            username,
            resume: { basics: { name: 'Ada' } },
            source: 'ghost',
            stale: false,
          })
        : Effect.fail(
            new ProfileNotFound({
              username,
              reason: 'no-gist',
              file: 'resume.json',
            })
          ),
  })
);

const get = (path: string) =>
  Effect.runPromise(
    timelineOutcome(new URL(path, 'https://jsonresume.org')).pipe(
      Effect.provide(profiles)
    )
  );

const location = async (path: string) => {
  const outcome = await get(path);
  return outcome?._tag === 'Respond'
    ? outcome.response.headers.get('location')
    : undefined;
};

describe('timelineOutcome', () => {
  it('finds the resume behind /@name', async () => {
    expect(await get('/@ada/timeline')).toEqual({
      _tag: 'Timeline',
      username: 'ada',
      resume: { basics: { name: 'Ada' } },
    });
  });

  it('redirects capitals, a trailing slash and renamed accounts', async () => {
    expect(await location('/@Ada/timeline')).toBe('/@ada/timeline');
    expect(await location('/@ada/timeline/')).toBe('/@ada/timeline');
    expect(await location('/@old/timeline')).toBe('/@new/timeline');
  });

  it('explains a missing resume on a page, and ignores other paths', async () => {
    expect(await get('/@nobody/timeline')).toMatchObject({
      _tag: 'Problem',
      page: true,
      problem: { kind: 'no-gist' },
    });
    expect(await get('/@ada')).toBeUndefined();
    expect(await get('/@ada.json/timeline')).toBeUndefined();
    expect(await get('/jobs/timeline')).toBeUndefined();
  });
});
