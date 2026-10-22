import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockUserId, mockUpsert, mockMaybeSingle } = vi.hoisted(() => ({
  mockUserId: vi.fn(),
  mockUpsert: vi.fn(),
  mockMaybeSingle: vi.fn(),
}));

vi.mock('@/lib/sessionUser', () => ({ getSessionUserId: mockUserId }));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn() } }));
vi.mock('../supabase', () => ({
  getSupabase: () => ({
    from: () => ({
      upsert: mockUpsert,
      select: () => ({ eq: () => ({ maybeSingle: mockMaybeSingle }) }),
    }),
  }),
}));

import { GET, POST } from './route';

const post = (body) =>
  new Request('http://localhost/api/pathways/preferences', {
    method: 'POST',
    body: JSON.stringify(body),
  });

describe('/api/pathways/preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpsert.mockResolvedValue({ error: null });
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
  });

  it('requires a signed-in session', async () => {
    mockUserId.mockResolvedValue(null);

    expect((await GET(new Request('http://localhost/x'))).status).toBe(401);
    expect((await POST(post({}))).status).toBe(401);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it('returns defaults when nothing is saved', async () => {
    mockUserId.mockResolvedValue('user-1');

    const res = await GET(new Request('http://localhost/x'));

    expect(res.status).toBe(200);
    expect((await res.json()).timeRange).toBe('1m');
  });

  it('saves for the session user, ignoring ids in the body', async () => {
    mockUserId.mockResolvedValue('user-1');

    const res = await POST(post({ userId: 'someone-else', remoteOnly: true }));

    expect(res.status).toBe(200);
    expect(mockUpsert.mock.calls[0][0]).toMatchObject({
      user_id: 'user-1',
      remote_only: true,
    });
  });
});
