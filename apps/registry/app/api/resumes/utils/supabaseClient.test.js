import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createSupabaseClient } from './supabaseClient';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url, key) => ({
    url,
    key,
    mockClient: true,
  })),
}));

describe('createSupabaseClient', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.SUPABASE_KEY;
  });

  afterEach(() => {
    process.env.SUPABASE_KEY = originalEnv;
  });

  it('creates client with environment key', () => {
    process.env.SUPABASE_KEY = 'test-key';

    const client = createSupabaseClient();

    expect(client.key).toBe('test-key');
  });

  it('uses correct supabase URL', () => {
    process.env.SUPABASE_KEY = 'test-key';

    const client = createSupabaseClient();

    expect(client.url).toBe('https://itxuhvvwryeuzuyihpkp.supabase.co');
  });

  it('returns client object', () => {
    process.env.SUPABASE_KEY = 'key';

    const client = createSupabaseClient();

    expect(client).toBeDefined();
    expect(client.mockClient).toBe(true);
  });

  it('handles undefined environment key', () => {
    delete process.env.SUPABASE_KEY;

    const client = createSupabaseClient();

    expect(client.key).toBeUndefined();
  });

  it('passes key directly to createClient', () => {
    process.env.SUPABASE_KEY = 'secret-key';

    const client = createSupabaseClient();

    expect(client.key).toBe('secret-key');
  });
});
