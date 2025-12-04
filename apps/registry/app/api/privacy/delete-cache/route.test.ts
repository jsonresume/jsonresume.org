import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DELETE } from './route';
import { NextResponse } from 'next/server';

// Mock dependencies
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
  })),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({})),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
    })),
  })),
}));

vi.mock('@/lib/logger', () => ({
  default: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('DELETE /api/privacy/delete-cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    const { createRouteHandlerClient } = await import(
      '@supabase/auth-helpers-nextjs'
    );
    (createRouteHandlerClient as any).mockReturnValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      },
    });

    const request = new Request('http://localhost/api/privacy/delete-cache', {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toContain('Unauthorized');
  });

  it('returns 400 when username is missing from session', async () => {
    const { createRouteHandlerClient } = await import(
      '@supabase/auth-helpers-nextjs'
    );
    (createRouteHandlerClient as any).mockReturnValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              user: {
                id: 'test-user-id',
                user_metadata: {},
              },
            },
          },
        }),
      },
    });

    const request = new Request('http://localhost/api/privacy/delete-cache', {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Unable to determine GitHub username');
  });

  it('successfully deletes cached resume data', async () => {
    const mockDeleteFn = vi.fn().mockResolvedValue({ error: null, count: 1 });

    const { createRouteHandlerClient } = await import(
      '@supabase/auth-helpers-nextjs'
    );
    (createRouteHandlerClient as any).mockReturnValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              user: {
                id: 'test-user-id',
                user_metadata: { user_name: 'testuser' },
              },
            },
          },
        }),
      },
    });

    const { createClient } = await import('@supabase/supabase-js');
    (createClient as any).mockReturnValueOnce({
      from: vi.fn(() => ({
        delete: vi.fn(() => ({
          eq: mockDeleteFn,
        })),
      })),
    });

    process.env.SUPABASE_KEY = 'test-key';

    const request = new Request('http://localhost/api/privacy/delete-cache', {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.deletedCount).toBe(1);
    expect(data.username).toBe('testuser');
  });

  it('returns 500 when SUPABASE_KEY is not set', async () => {
    const { createRouteHandlerClient } = await import(
      '@supabase/auth-helpers-nextjs'
    );
    (createRouteHandlerClient as any).mockReturnValueOnce({
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              user: {
                id: 'test-user-id',
                user_metadata: { user_name: 'testuser' },
              },
            },
          },
        }),
      },
    });

    delete process.env.SUPABASE_KEY;

    const request = new Request('http://localhost/api/privacy/delete-cache', {
      method: 'DELETE',
    });

    const response = await DELETE(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toContain('Server configuration error');
  });
});
