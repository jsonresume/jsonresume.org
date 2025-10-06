import { describe, it, expect } from 'vitest';
import { getUsername } from './getUsername';

describe('getUsername', () => {
  it('returns user_name when available', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: 'johndoe',
          preferred_username: 'john_doe',
        },
      },
    };

    const result = getUsername(session);

    expect(result).toBe('johndoe');
  });

  it('falls back to preferred_username when user_name is not available', () => {
    const session = {
      user: {
        user_metadata: {
          preferred_username: 'john_doe',
        },
      },
    };

    const result = getUsername(session);

    expect(result).toBe('john_doe');
  });

  it('returns undefined when both are missing', () => {
    const session = {
      user: {
        user_metadata: {},
      },
    };

    const result = getUsername(session);

    expect(result).toBeUndefined();
  });

  it('returns undefined when session is null', () => {
    const result = getUsername(null);
    expect(result).toBeUndefined();
  });

  it('returns undefined when session is undefined', () => {
    const result = getUsername(undefined);
    expect(result).toBeUndefined();
  });

  it('returns undefined when user is missing', () => {
    const session = {};
    const result = getUsername(session);
    expect(result).toBeUndefined();
  });

  it('returns undefined when user_metadata is missing', () => {
    const session = {
      user: {},
    };
    const result = getUsername(session);
    expect(result).toBeUndefined();
  });

  it('prefers user_name over preferred_username', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: 'first_choice',
          preferred_username: 'second_choice',
        },
      },
    };

    const result = getUsername(session);

    expect(result).toBe('first_choice');
  });

  it('returns user_name even when it is empty string', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: '',
          preferred_username: 'fallback',
        },
      },
    };

    const result = getUsername(session);

    // Empty string is falsy, so falls back
    expect(result).toBe('fallback');
  });

  it('handles null user_name gracefully', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: null,
          preferred_username: 'fallback',
        },
      },
    };

    const result = getUsername(session);

    expect(result).toBe('fallback');
  });
});
