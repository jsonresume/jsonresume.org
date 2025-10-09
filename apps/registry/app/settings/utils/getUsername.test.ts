import { describe, it, expect } from 'vitest';
import { getUsername } from './getUsername';

describe('getUsername', () => {
  it('returns user_name when available', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: 'johndoe',
        },
      },
    };

    expect(getUsername(session)).toBe('johndoe');
  });

  it('falls back to preferred_username when user_name missing', () => {
    const session = {
      user: {
        user_metadata: {
          preferred_username: 'janedoe',
        },
      },
    };

    expect(getUsername(session)).toBe('janedoe');
  });

  it('prefers user_name over preferred_username', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: 'user1',
          preferred_username: 'user2',
        },
      },
    };

    expect(getUsername(session)).toBe('user1');
  });

  it('returns undefined when session is null', () => {
    expect(getUsername(null)).toBeUndefined();
  });

  it('returns undefined when session is undefined', () => {
    expect(getUsername(undefined)).toBeUndefined();
  });

  it('returns undefined when user is missing', () => {
    const session = {};

    expect(getUsername(session)).toBeUndefined();
  });

  it('returns undefined when user_metadata is missing', () => {
    const session = {
      user: {},
    };

    expect(getUsername(session)).toBeUndefined();
  });

  it('returns undefined when both usernames are missing', () => {
    const session = {
      user: {
        user_metadata: {},
      },
    };

    expect(getUsername(session)).toBeUndefined();
  });

  it('handles empty string user_name by falling back', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: '',
          preferred_username: 'fallback',
        },
      },
    };

    expect(getUsername(session)).toBe('fallback');
  });

  it('handles special characters in username', () => {
    const session = {
      user: {
        user_metadata: {
          user_name: 'user-name_123',
        },
      },
    };

    expect(getUsername(session)).toBe('user-name_123');
  });
});
