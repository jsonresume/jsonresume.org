import { describe, it, expect } from 'vitest';
import { getGitHubIdentity, isGitHubConnected } from './getGitHubIdentity';

describe('getGitHubIdentity', () => {
  it('finds GitHub identity from identities array', () => {
    const session = {
      user: {
        identities: [
          { provider: 'google', id: '123' },
          { provider: 'github', id: '456', username: 'johndoe' },
        ],
      },
    };

    const result = getGitHubIdentity(session);

    expect(result.provider).toBe('github');
    expect(result.id).toBe('456');
  });

  it('returns undefined when no GitHub identity exists', () => {
    const session = {
      user: {
        identities: [{ provider: 'google', id: '123' }],
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

  it('returns undefined when identities is missing', () => {
    const session = {
      user: {},
    };

    const result = getGitHubIdentity(session);

    expect(result).toBeUndefined();
  });

  it('returns undefined when user is missing', () => {
    const session = {};

    const result = getGitHubIdentity(session);

    expect(result).toBeUndefined();
  });

  it('returns undefined when session is null', () => {
    const result = getGitHubIdentity(null);

    expect(result).toBeUndefined();
  });

  it('preserves GitHub identity data', () => {
    const githubIdentity = {
      provider: 'github',
      id: '789',
      username: 'alice',
      email: 'alice@example.com',
    };
    const session = {
      user: {
        identities: [githubIdentity],
      },
    };

    const result = getGitHubIdentity(session);

    expect(result).toEqual(githubIdentity);
  });
});

describe('isGitHubConnected', () => {
  it('returns true when GitHub identity exists', () => {
    const session = {
      user: {
        identities: [{ provider: 'github', id: '123' }],
      },
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(true);
  });

  it('returns false when no GitHub identity exists', () => {
    const session = {
      user: {
        identities: [{ provider: 'google', id: '123' }],
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

  it('returns false when identities is missing', () => {
    const session = {
      user: {},
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(false);
  });

  it('returns false when user is missing', () => {
    const session = {};

    const result = isGitHubConnected(session);

    expect(result).toBe(false);
  });

  it('returns false when session is null', () => {
    const result = isGitHubConnected(null);

    expect(result).toBe(false);
  });

  it('returns true when GitHub is among multiple providers', () => {
    const session = {
      user: {
        identities: [
          { provider: 'google', id: '1' },
          { provider: 'github', id: '2' },
          { provider: 'facebook', id: '3' },
        ],
      },
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(true);
  });

  it('is case sensitive to provider name', () => {
    const session = {
      user: {
        identities: [{ provider: 'GitHub', id: '123' }],
      },
    };

    const result = isGitHubConnected(session);

    expect(result).toBe(false);
  });
});
