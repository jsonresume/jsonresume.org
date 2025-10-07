import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchResumes } from './fetchResumes';
import { createClient } from '@supabase/supabase-js';

// Mock dependencies
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('./parseResume', () => ({
  parseResumeRow: vi.fn((row) => ({
    username: row.username,
    meta: row.meta || {},
  })),
}));

vi.mock('../constants', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  ITEMS_PER_PAGE: 10,
}));

describe('fetchResumes', () => {
  let mockSupabase;
  let mockQuery;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock Supabase chain
    mockQuery = {
      select: vi.fn().mockReturnThis(),
      textSearch: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    mockSupabase = {
      from: vi.fn().mockReturnValue(mockQuery),
    };

    createClient.mockReturnValue(mockSupabase);

    // Mock environment
    process.env.SUPABASE_KEY = 'test-key';
  });

  it('returns empty data when SUPABASE_KEY is missing', async () => {
    delete process.env.SUPABASE_KEY;

    const result = await fetchResumes();

    expect(result).toEqual({
      resumes: [],
      totalCount: 0,
      totalPages: 0,
    });
  });

  it('fetches resumes with pagination', async () => {
    mockQuery.range.mockResolvedValue({
      data: [
        { username: 'user1', meta: { public: true } },
        { username: 'user2', meta: { public: true } },
      ],
      error: null,
    });

    // Mock count query
    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return Promise.resolve({ count: 20 });
      }
      return mockQuery;
    });

    const result = await fetchResumes(2);

    expect(mockQuery.range).toHaveBeenCalledWith(10, 19); // Page 2: items 10-19
    expect(result.resumes).toHaveLength(2);
    expect(result.totalCount).toBe(20);
    expect(result.totalPages).toBe(2);
  });

  it('applies search filter', async () => {
    mockQuery.range.mockResolvedValue({
      data: [{ username: 'developer', meta: { public: true } }],
      error: null,
    });

    // textSearch is called twice (count query and data query)
    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return {
          ...mockQuery,
          then: (resolve) => resolve({ count: 5 }),
        };
      }
      return mockQuery;
    });

    await fetchResumes(1, 'developer');

    // textSearch should be called at least twice (once for count, once for data)
    expect(mockQuery.textSearch).toHaveBeenCalled();
    expect(mockQuery.textSearch).toHaveBeenCalledWith(
      'resume',
      'developer',
      expect.objectContaining({
        config: 'english',
        type: 'websearch',
      })
    );
  });

  it('filters out private resumes', async () => {
    mockQuery.range.mockResolvedValue({
      data: [
        { username: 'user1', meta: { public: true } },
        { username: 'user2', meta: { public: false } },
        { username: 'user3', meta: {} },
      ],
      error: null,
    });

    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return Promise.resolve({ count: 3 });
      }
      return mockQuery;
    });

    const result = await fetchResumes();

    // Should filter out user2 (public: false)
    expect(result.resumes).toHaveLength(2);
    expect(result.resumes.find((r) => r.username === 'user2')).toBeUndefined();
  });

  it('orders by created_at descending', async () => {
    mockQuery.range.mockResolvedValue({
      data: [],
      error: null,
    });

    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return Promise.resolve({ count: 0 });
      }
      return mockQuery;
    });

    await fetchResumes();

    expect(mockQuery.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    });
  });

  it('handles database errors gracefully', async () => {
    mockQuery.range.mockResolvedValue({
      data: null,
      error: new Error('Database error'),
    });

    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return Promise.resolve({ count: 0 });
      }
      return mockQuery;
    });

    const result = await fetchResumes();

    expect(result).toEqual({
      resumes: [],
      totalCount: 0,
      totalPages: 0,
    });
  });

  it('handles null data from query', async () => {
    mockQuery.range.mockResolvedValue({
      data: null,
      error: null,
    });

    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return Promise.resolve({ count: 0 });
      }
      return mockQuery;
    });

    const result = await fetchResumes();

    expect(result).toEqual({
      resumes: [],
      totalCount: 0,
      totalPages: 0,
    });
  });

  it('trims search query whitespace', async () => {
    mockQuery.range.mockResolvedValue({
      data: [],
      error: null,
    });

    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return {
          ...mockQuery,
          then: (resolve) => resolve({ count: 0 }),
        };
      }
      return mockQuery;
    });

    await fetchResumes(1, '  developer  ');

    expect(mockQuery.textSearch).toHaveBeenCalledWith(
      'resume',
      'developer',
      expect.any(Object)
    );
  });

  it('calculates correct page ranges', async () => {
    mockQuery.range.mockResolvedValue({
      data: [],
      error: null,
    });

    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return Promise.resolve({ count: 0 });
      }
      return mockQuery;
    });

    await fetchResumes(1);
    expect(mockQuery.range).toHaveBeenCalledWith(0, 9); // Page 1

    await fetchResumes(3);
    expect(mockQuery.range).toHaveBeenCalledWith(20, 29); // Page 3
  });

  it('calculates total pages correctly', async () => {
    mockQuery.range.mockResolvedValue({
      data: [],
      error: null,
    });

    mockQuery.select.mockImplementation((fields, options) => {
      if (options?.head) {
        return Promise.resolve({ count: 25 });
      }
      return mockQuery;
    });

    const result = await fetchResumes();

    // 25 items / 10 per page = 3 pages
    expect(result.totalPages).toBe(3);
  });
});
