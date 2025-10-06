import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSupabase } from './createSupabase';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url, key) => ({
    url,
    key,
    mockClient: true,
  })),
}));

describe('createSupabase', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.SUPABASE_KEY;
  });

  afterEach(() => {
    process.env.SUPABASE_KEY = originalEnv;
  });

  it('creates client with environment key', () => {
    process.env.SUPABASE_KEY = 'test-key';

    const client = createSupabase();

    expect(client.key).toBe('test-key');
  });

  it('uses correct supabase URL', () => {
    process.env.SUPABASE_KEY = 'test-key';

    const client = createSupabase();

    expect(client.url).toBe('https://itxuhvvwryeuzuyihpkp.supabase.co');
  });

  it('returns client object', () => {
    process.env.SUPABASE_KEY = 'key';

    const client = createSupabase();

    expect(client).toBeDefined();
    expect(client.mockClient).toBe(true);
  });

  it('handles undefined environment key', () => {
    delete process.env.SUPABASE_KEY;

    const client = createSupabase();

    expect(client.key).toBeUndefined();
  });

  it('passes key directly to createClient', () => {
    process.env.SUPABASE_KEY = 'secret-key';

    const client = createSupabase();

    expect(client.key).toBe('secret-key');
  });
});
