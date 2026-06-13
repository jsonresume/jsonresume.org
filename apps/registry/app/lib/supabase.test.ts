import { describe, it, expect, vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url, key) => ({
    url,
    key,
    mockSupabaseClient: true,
  })),
}));

describe('supabase client', () => {
  it('exports supabase client', async () => {
    const { supabase } = await import('./supabase');

    expect(supabase).toBeDefined();
  });

  it('creates client with correct URL', async () => {
    const { supabase } = await import('./supabase');
    // @ts-expect-error - JS config module (triple-export CommonJS)
    const { SUPABASE_URL } = await import('../../lib/supabaseConfig');

    expect(supabase.url).toBe(SUPABASE_URL);
  });

  it('creates client with anon key', async () => {
    const { supabase } = await import('./supabase');

    expect(supabase.key).toBeDefined();
    expect(typeof supabase.key).toBe('string');
  });

  it('has mock client marker', async () => {
    const { supabase } = await import('./supabase');

    expect(supabase.mockSupabaseClient).toBe(true);
  });
});
