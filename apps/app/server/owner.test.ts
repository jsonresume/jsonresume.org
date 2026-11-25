import { Effect } from 'effect';
import { describe, expect, it } from 'vitest';
import { signedInAs } from './owner';

const session = (token: string) =>
  token === 'good'
    ? Effect.succeed({ username: 'mine' })
    : Effect.fail(new Error('Unauthorized'));

const asked = (cookie?: string) =>
  new Request('https://jsonresume.org/@mine.pdf', {
    headers: cookie === undefined ? {} : { cookie },
  });

describe('signedInAs', () => {
  it('is the owner signed in with their session', async () => {
    const owner = signedInAs(asked('a=b; jr_session=good'), 'Mine', session);
    expect(await Effect.runPromise(owner)).toBe(true);
  });

  it('is nobody else, and nobody without a valid session', async () => {
    for (const [cookie, username] of [
      ['jr_session=good', 'other'],
      ['jr_session=bad', 'mine'],
      ['jr_sessionx=good', 'mine'],
      [undefined, 'mine'],
    ] as const) {
      const owner = signedInAs(asked(cookie), username, session);
      expect(await Effect.runPromise(owner)).toBe(false);
    }
  });
});
