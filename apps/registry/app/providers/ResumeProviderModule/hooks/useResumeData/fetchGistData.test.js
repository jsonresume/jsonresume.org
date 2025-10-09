import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGistData } from './fetchGistData';

// Mock constants
vi.mock('../../constants', () => ({
  RESUME_GIST_NAME: 'resume.json',
}));

// Mock global fetch
global.fetch = vi.fn();

describe('fetchGistData', () => {
  let mockOctokit;

  beforeEach(() => {
    vi.clearAllMocks();

    mockOctokit = {
      rest: {
        gists: {
          get: vi.fn(),
        },
      },
    };
  });

  it('fetches and parses resume from gist', async () => {
    const mockResumeData = {
      basics: { name: 'John Doe' },
    };

    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {
          'resume.json': {
            filename: 'resume.json',
            raw_url: 'https://gist.github.com/raw/resume.json',
          },
        },
      },
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResumeData),
    });

    const result = await fetchGistData(mockOctokit, 'gist123');

    expect(mockOctokit.rest.gists.get).toHaveBeenCalledWith({
      gist_id: 'gist123',
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://gist.github.com/raw/resume.json'
    );
    expect(result).toEqual(mockResumeData);
  });

  it('handles case-insensitive filename matching', async () => {
    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {
          'RESUME.JSON': {
            filename: 'RESUME.JSON',
            raw_url: 'https://gist.github.com/raw/RESUME.JSON',
          },
        },
      },
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ basics: {} }),
    });

    const result = await fetchGistData(mockOctokit, 'gist123');

    expect(result).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://gist.github.com/raw/RESUME.JSON'
    );
  });

  it('returns null when resume file not found', async () => {
    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {
          'other.txt': {
            filename: 'other.txt',
            raw_url: 'https://gist.github.com/raw/other.txt',
          },
        },
      },
    });

    const result = await fetchGistData(mockOctokit, 'gist123');

    expect(result).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns null when file has no raw_url', async () => {
    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {
          'resume.json': {
            filename: 'resume.json',
            raw_url: null,
          },
        },
      },
    });

    const result = await fetchGistData(mockOctokit, 'gist123');

    expect(result).toBeNull();
  });

  it('throws error when fetch fails', async () => {
    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {
          'resume.json': {
            filename: 'resume.json',
            raw_url: 'https://gist.github.com/raw/resume.json',
          },
        },
      },
    });

    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(fetchGistData(mockOctokit, 'gist123')).rejects.toThrow(
      'Failed to fetch resume data'
    );
  });

  it('finds resume file among multiple files', async () => {
    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {
          'readme.md': {
            filename: 'readme.md',
            raw_url: 'https://gist.github.com/raw/readme.md',
          },
          'resume.json': {
            filename: 'resume.json',
            raw_url: 'https://gist.github.com/raw/resume.json',
          },
          'config.json': {
            filename: 'config.json',
            raw_url: 'https://gist.github.com/raw/config.json',
          },
        },
      },
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ basics: { name: 'Test' } }),
    });

    const result = await fetchGistData(mockOctokit, 'gist123');

    expect(result).toBeDefined();
    expect(global.fetch).toHaveBeenCalledWith(
      'https://gist.github.com/raw/resume.json'
    );
  });

  it('handles gist with no files', async () => {
    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {},
      },
    });

    const result = await fetchGistData(mockOctokit, 'gist123');

    expect(result).toBeNull();
  });

  it('handles Octokit errors', async () => {
    mockOctokit.rest.gists.get.mockRejectedValue(new Error('Gist not found'));

    await expect(fetchGistData(mockOctokit, 'gist123')).rejects.toThrow(
      'Gist not found'
    );
  });

  it('handles JSON parse errors', async () => {
    mockOctokit.rest.gists.get.mockResolvedValue({
      data: {
        files: {
          'resume.json': {
            filename: 'resume.json',
            raw_url: 'https://gist.github.com/raw/resume.json',
          },
        },
      },
    });

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    });

    await expect(fetchGistData(mockOctokit, 'gist123')).rejects.toThrow(
      'Invalid JSON'
    );
  });

  it('handles resume file with different case variations', async () => {
    const testCases = ['Resume.json', 'RESUME.JSON', 'ReSuMe.JsOn'];

    for (const filename of testCases) {
      mockOctokit.rest.gists.get.mockResolvedValue({
        data: {
          files: {
            [filename]: {
              filename,
              raw_url: `https://gist.github.com/raw/${filename}`,
            },
          },
        },
      });

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ basics: {} }),
      });

      const result = await fetchGistData(mockOctokit, 'gist123');

      expect(result).toBeDefined();
    }
  });
});
