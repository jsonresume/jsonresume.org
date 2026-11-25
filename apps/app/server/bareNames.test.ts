import { memoryStore, ProfileStore, type Profile } from '@repo/profiles';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { bareName } from './bareNames';

const ghost: Profile = {
  kind: 'ghost',
  username: 'kbsali',
  githubId: 1,
  gistId: 'g',
  resume: {},
  fetchedAt: new Date(0),
};
const store = Layer.succeed(
  ProfileStore,
  memoryStore(
    new Map<string, Profile>([
      ['kbsali', ghost],
      ['admin', { ...ghost, username: 'admin' }],
    ])
  )
);
const visit = (path: string, method = 'GET') =>
  Effect.runPromise(
    bareName(new Request(`https://jsonresume.org${path}`, { method })).pipe(
      Effect.provide(store)
    )
  );

describe('bareName', () => {
  it('sends /name to /@name for a profile we know, keeping the query', async () => {
    const moved = await visit('/KBSali?theme=flat');
    expect(moved?.status).toBe(301);
    expect(moved?.headers.get('location')).toBe('/@kbsali?theme=flat');
  });

  it('leaves the 404 alone for anything else', async () => {
    expect(await visit('/nobody')).toBeUndefined();
    expect(await visit('/admin')).toBeUndefined();
    expect(await visit('/kbsali/x')).toBeUndefined();
    expect(await visit('/kbsali.json')).toBeUndefined();
    expect(await visit('/kbsali', 'POST')).toBeUndefined();
  });
});
