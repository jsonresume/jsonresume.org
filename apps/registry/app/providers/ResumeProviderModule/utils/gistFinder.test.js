import { describe, it, expect, vi } from 'vitest';
import { findLatestResumeGist } from './gistFinder';

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('findLatestResumeGist', () => {
  it('finds gist with resume.json file', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'gist123',
                files: {
                  'resume.json': { filename: 'resume.json' },
                  'other.txt': { filename: 'other.txt' },
                },
              },
              {
                id: 'gist456',
                files: {
                  'config.json': { filename: 'config.json' },
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    expect(result).toBe('gist123');
    expect(mockOctokit.rest.gists.list).toHaveBeenCalledWith({
      per_page: 100,
      sort: 'updated',
      direction: 'desc',
    });
  });

  it('handles case-insensitive filename matching', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'gist123',
                files: {
                  'RESUME.JSON': { filename: 'RESUME.JSON' },
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    expect(result).toBe('gist123');
  });

  it('finds resume.json with different casing', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'gist789',
                files: {
                  'Resume.json': { filename: 'Resume.json' },
                  'readme.md': { filename: 'readme.md' },
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    expect(result).toBe('gist789');
  });

  it('returns null when no resume.json gist found', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'gist123',
                files: {
                  'config.json': { filename: 'config.json' },
                },
              },
              {
                id: 'gist456',
                files: {
                  'notes.txt': { filename: 'notes.txt' },
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    expect(result).toBeNull();
  });

  it('returns null when gists list is empty', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    expect(result).toBeNull();
  });

  it('returns first matching gist when multiple exist', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'gist-first',
                files: {
                  'resume.json': { filename: 'resume.json' },
                },
              },
              {
                id: 'gist-second',
                files: {
                  'resume.json': { filename: 'resume.json' },
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    // Should return the first one found (most recently updated)
    expect(result).toBe('gist-first');
  });

  it('ignores gists with similar but non-matching filenames', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'gist123',
                files: {
                  'my-resume.json': { filename: 'my-resume.json' },
                },
              },
              {
                id: 'gist456',
                files: {
                  'resume.txt': { filename: 'resume.txt' },
                },
              },
              {
                id: 'gist789',
                files: {
                  'resume.json': { filename: 'resume.json' },
                },
              },
            ],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    expect(result).toBe('gist789');
  });

  it('handles API errors gracefully', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockRejectedValue(new Error('API Error')),
        },
      },
    };

    await expect(findLatestResumeGist(mockOctokit)).rejects.toThrow(
      'API Error'
    );
  });

  it('handles gist with no files', async () => {
    const mockOctokit = {
      rest: {
        gists: {
          list: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'gist123',
                files: {},
              },
            ],
          }),
        },
      },
    };

    const result = await findLatestResumeGist(mockOctokit);

    expect(result).toBeNull();
  });
});
