import { describe, it, expect } from 'vitest';
import { getGitHubIdentity, isGitHubConnected } from './getGitHubIdentity';

describe('getGitHubIdentity', () => {
  it('finds GitHub identity from session', () => {
    const session = {
      user: {
        identities: [
          { provider: 'google', id: 'google-123' },
          { provider: 'github', id: 'github-456', username: 'testuser' },
        ],
      },
    };

    const result = getGitHubIdentity(session);

    expect(result).toEqual({
      provider: 'github',
      id: 'github-456',
      username: 'testuser',
    });
  });

  it('returns undefined when no GitHub identity exists', () => {
    const session = {
      user: {
        identities: [{ provider: 'google', id: 'google-123' }],
      },
    };

    const result = getGitHubIdentity(session);

    expect(result).toBeUndefined();
  });

  it('returns undefined when identities array is empty', () => {
    const session = {
      user: {
        identities: [],
      },
    };

    const result = getGitHubIdentity(session);

    expect(result).toBeUndefined();
  });

  it('returns undefined when session is null', () => {
    const result = getGitHubIdentity(null);
    expect(result).toBeUndefined();
  });

  it('returns undefined when session is undefined', () => {
    const result = getGitHubIdentity(undefined);
    expect(result).toBeUndefined();
  });

  it('returns undefined when user is missing', () => {
    const session = {};
    const result = getGitHubIdentity(session);
    expect(result).toBeUndefined();
  });

  it('returns undefined when identities is missing', () => {
    const session = {
      user: {},
    };
    const result = getGitHubIdentity(session);
    expect(result).toBeUndefined();
  });
});

describe('isGitHubConnected', () => {
  it('returns true when GitHub identity exists', () => {
    const session = {
      user: {
        identities: [
          { provider: 'google', id: 'google-123' },
          { provider: 'github', id: 'github-456' },
        ],
      },
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(true);
  });

  it('returns false when no GitHub identity exists', () => {
    const session = {
      user: {
        identities: [{ provider: 'google', id: 'google-123' }],
      },
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(false);
  });

  it('returns false when identities array is empty', () => {
    const session = {
      user: {
        identities: [],
      },
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(false);
  });

  it('returns false when session is null', () => {
    const result = isGitHubConnected(null);
    expect(result).toBe(false);
  });

  it('returns false when session is undefined', () => {
    const result = isGitHubConnected(undefined);
    expect(result).toBe(false);
  });

  it('returns false when user is missing', () => {
    const session = {};
    const result = isGitHubConnected(session);
    expect(result).toBe(false);
  });

  it('returns false when identities is missing', () => {
    const session = {
      user: {},
    };
    const result = isGitHubConnected(session);
    expect(result).toBe(false);
  });

  it('returns true even when GitHub is not first identity', () => {
    const session = {
      user: {
        identities: [
          { provider: 'google', id: '1' },
          { provider: 'facebook', id: '2' },
          { provider: 'github', id: '3' },
        ],
      },
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(true);
  });
});
