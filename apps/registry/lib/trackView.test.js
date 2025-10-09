import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import trackView from './trackView';

describe('trackView', () => {
  let originalEnv;
  let consoleSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = process.env.SUPABASE_KEY;
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.SUPABASE_KEY = originalEnv;
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('skips tracking when SUPABASE_KEY is not configured', async () => {
    delete process.env.SUPABASE_KEY;

    await trackView('johndoe');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Skipping view tracking: SUPABASE_KEY not configured'
    );
  });

  it('does not throw when env key missing', async () => {
    delete process.env.SUPABASE_KEY;

    await expect(trackView('user')).resolves.not.toThrow();
  });

  it('logs skipping message with no key', async () => {
    delete process.env.SUPABASE_KEY;

    await trackView('test');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Skipping view tracking')
    );
  });
});
