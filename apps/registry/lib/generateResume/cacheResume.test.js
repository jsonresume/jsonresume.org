import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cacheResume } from './cacheResume';

describe('cacheResume', () => {
  let originalEnv;
  let consoleSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    originalEnv = process.env.SUPABASE_KEY;
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.SUPABASE_KEY = originalEnv;
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('skips caching when SUPABASE_KEY is not configured', async () => {
    delete process.env.SUPABASE_KEY;

    await cacheResume('test', { basics: {} });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Skipping resume caching: SUPABASE_KEY not configured'
    );
  });

  it('does not throw when env key missing', async () => {
    delete process.env.SUPABASE_KEY;

    await expect(cacheResume('user', { basics: {} })).resolves.not.toThrow();
  });

  it('logs skip message with no key', async () => {
    delete process.env.SUPABASE_KEY;

    await cacheResume('test', {});

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Skipping resume caching')
    );
  });

  it('returns early when no key', async () => {
    delete process.env.SUPABASE_KEY;

    const result = await cacheResume('user', {});

    expect(result).toBeUndefined();
  });

  it('handles resume parameter', async () => {
    delete process.env.SUPABASE_KEY;

    await cacheResume('test', { basics: { name: 'Test' } });

    // Just verify it doesn't crash
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('handles username parameter', async () => {
    delete process.env.SUPABASE_KEY;

    await cacheResume('johndoe', {});

    expect(consoleSpy).toHaveBeenCalled();
  });
});
