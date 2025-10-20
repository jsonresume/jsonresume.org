import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import trackView from './trackView';

// Mock logger
vi.mock('./logger', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('trackView', () => {
  let originalEnv;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = process.env.SUPABASE_KEY;
  });

  afterEach(() => {
    process.env.SUPABASE_KEY = originalEnv;
  });

  it('skips tracking when SUPABASE_KEY is not configured', async () => {
    delete process.env.SUPABASE_KEY;
    const logger = (await import('./logger')).default;

    await trackView('johndoe');

    expect(logger.debug).toHaveBeenCalledWith(
      'Skipping view tracking: SUPABASE_KEY not configured'
    );
  });

  it('does not throw when env key missing', async () => {
    delete process.env.SUPABASE_KEY;

    await expect(trackView('user')).resolves.not.toThrow();
  });

  it('logs skipping message with no key', async () => {
    delete process.env.SUPABASE_KEY;
    const logger = (await import('./logger')).default;

    await trackView('test');

    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Skipping view tracking')
    );
  });
});
