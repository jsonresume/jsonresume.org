import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUserWithToken, mockGetUserFromCookie } = vi.hoisted(() => ({
  mockGetUserWithToken: vi.fn(),
  mockGetUserFromCookie: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ auth: { getUser: mockGetUserWithToken } }),
}));
vi.mock('@/lib/supabaseServer', () => ({
  createRouteHandlerClient: async () => ({
    auth: { getUser: mockGetUserFromCookie },
  }),
}));
vi.mock('@/lib/supabaseConfig', () => ({
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'anon',
}));

import { getSessionUserId } from './sessionUser';

const request = (headers = {}) =>
  new Request('http://localhost/api/job-states', { headers });
const noUser = { data: { user: null }, error: { message: 'no session' } };
const user = (id) => ({ data: { user: { id } }, error: null });

describe('getSessionUserId', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserWithToken.mockResolvedValue(noUser);
    mockGetUserFromCookie.mockResolvedValue(noUser);
  });

  it('returns null when not signed in', async () => {
    expect(await getSessionUserId(request())).toBeNull();
  });

  it('returns the user from a verified bearer token', async () => {
    mockGetUserWithToken.mockResolvedValue(user('token-user'));

    const id = await getSessionUserId(request({ Authorization: 'Bearer abc' }));

    expect(id).toBe('token-user');
    expect(mockGetUserWithToken).toHaveBeenCalledWith('abc');
  });

  it('falls back to the cookie session when the token is invalid', async () => {
    mockGetUserFromCookie.mockResolvedValue(user('cookie-user'));

    const id = await getSessionUserId(
      request({ Authorization: 'Bearer expired' })
    );

    expect(id).toBe('cookie-user');
  });
});
