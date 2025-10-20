import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cacheResume } from './cacheResume';

// Mock logger
vi.mock('../logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('cacheResume', () => {
  let originalEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = process.env.SUPABASE_KEY;
  });

  afterEach(() => {
    process.env.SUPABASE_KEY = originalEnv;
  });

  it('skips caching when SUPABASE_KEY is not configured', async () => {
    delete process.env.SUPABASE_KEY;
    const logger = (await import('../logger')).default;

    await cacheResume('test', { basics: {} });

    expect(logger.debug).toHaveBeenCalledWith(
      'Skipping resume caching: SUPABASE_KEY not configured'
    );
  });

  it('does not throw when env key missing', async () => {
    delete process.env.SUPABASE_KEY;

    await expect(cacheResume('user', { basics: {} })).resolves.not.toThrow();
  });

  it('logs skip message with no key', async () => {
    delete process.env.SUPABASE_KEY;
    const logger = (await import('../logger')).default;

    await cacheResume('test', {});

    expect(logger.debug).toHaveBeenCalledWith(
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
    const logger = (await import('../logger')).default;

    await cacheResume('test', { basics: { name: 'Test' } });

    // Just verify it doesn't crash
    expect(logger.debug).toHaveBeenCalled();
  });

  it('handles username parameter', async () => {
    delete process.env.SUPABASE_KEY;
    const logger = (await import('../logger')).default;

    await cacheResume('johndoe', {});

    expect(logger.debug).toHaveBeenCalled();
  });
});
