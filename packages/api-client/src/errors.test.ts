import { InvalidCredentials, UsernameUnavailable } from '@repo/api';
import { Exit } from 'effect';
import { describe, expect, it } from 'vitest';
import { errorTag, usernameReason } from './errors';

describe('errorTag', () => {
  it('names the error a request failed with, or nothing on success', () => {
    expect(errorTag(Exit.succeed(1))).toBeUndefined();
    expect(errorTag(Exit.fail(new InvalidCredentials()))).toBe(
      'InvalidCredentials'
    );
    expect(errorTag(Exit.die(new Error('network')))).toBe('default');
  });

  it('reads why a username was refused', () => {
    expect(
      usernameReason(Exit.fail(new UsernameUnavailable({ reason: 'github' })))
    ).toBe('github');
    expect(usernameReason(Exit.fail(new InvalidCredentials()))).toBeUndefined();
  });
});
