import { describe, it, expect, vi } from 'vitest';
import { fetchThomasResume, fetchOtherResumes } from './fetchResumeData';

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('fetchThomasResume', () => {
  it('fetches thomasdavis resume successfully', async () => {
    const mockSupabase = createMockSupabase({
      data: {
        username: 'thomasdavis',
        embedding: [0.1, 0.2, 0.3],
        resume: '{"basics": {"name": "Thomas Davis"}}',
      },
      error: null,
    });

    const result = await fetchThomasResume(mockSupabase);

    expect(result).toEqual({
      username: 'thomasdavis',
      embedding: [0.1, 0.2, 0.3],
      resume: '{"basics": {"name": "Thomas Davis"}}',
    });
    expect(mockSupabase.from).toHaveBeenCalledWith('resumes');
    expect(mockSupabase.methods.eq).toHaveBeenCalledWith(
      'username',
      'thomasdavis'
    );
    expect(mockSupabase.methods.single).toHaveBeenCalled();
  });

  it('handles error when thomasdavis resume not found', async () => {
    const mockSupabase = createMockSupabase({
      data: null,
      error: { message: 'Not found' },
    });

    const result = await fetchThomasResume(mockSupabase);

    expect(result).toBeNull();
  });

  it('selects correct fields', async () => {
    const mockSupabase = createMockSupabase({
      data: { username: 'thomasdavis' },
      error: null,
    });

    await fetchThomasResume(mockSupabase);

    expect(mockSupabase.methods.select).toHaveBeenCalledWith(
      'username, embedding, resume'
    );
  });
});

describe('fetchOtherResumes', () => {
  it('fetches other resumes successfully', async () => {
    const mockSupabase = createMockSupabase({
      data: [
        {
          username: 'user1',
          embedding: [0.1, 0.2],
          resume: '{"basics": {"name": "User 1"}}',
        },
        {
          username: 'user2',
          embedding: [0.3, 0.4],
          resume: '{"basics": {"name": "User 2"}}',
        },
      ],
      error: null,
    });

    const result = await fetchOtherResumes(mockSupabase, 10);

    expect(result).toHaveLength(2);
    expect(result[0].username).toBe('user1');
    expect(result[1].username).toBe('user2');
  });

  it('applies limit parameter', async () => {
    const mockSupabase = createMockSupabase({
      data: [],
      error: null,
    });

    await fetchOtherResumes(mockSupabase, 50);

    expect(mockSupabase.methods.limit).toHaveBeenCalledWith(50);
  });

  it('filters out thomasdavis', async () => {
    const mockSupabase = createMockSupabase({
      data: [],
      error: null,
    });

    await fetchOtherResumes(mockSupabase, 10);

    expect(mockSupabase.methods.neq).toHaveBeenCalledWith(
      'username',
      'thomasdavis'
    );
  });

  it('filters out null embeddings', async () => {
    const mockSupabase = createMockSupabase({
      data: [],
      error: null,
    });

    await fetchOtherResumes(mockSupabase, 10);

    expect(mockSupabase.methods.not).toHaveBeenCalledWith(
      'embedding',
      'is',
      null
    );
  });

  it('orders by created_at descending', async () => {
    const mockSupabase = createMockSupabase({
      data: [],
      error: null,
    });

    await fetchOtherResumes(mockSupabase, 10);

    expect(mockSupabase.methods.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    });
  });

  it('throws error when fetch fails', async () => {
    const mockSupabase = createMockSupabase({
      data: null,
      error: { message: 'Database connection failed' },
    });

    await expect(fetchOtherResumes(mockSupabase, 10)).rejects.toThrow();
  });

  it('selects correct fields', async () => {
    const mockSupabase = createMockSupabase({
      data: [],
      error: null,
    });

    await fetchOtherResumes(mockSupabase, 10);

    expect(mockSupabase.methods.select).toHaveBeenCalledWith(
      'username, embedding, resume'
    );
  });
});

// Helper to create mock Supabase client
function createMockSupabase(response) {
  const createChainMethods = () => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue(response),
    single: vi.fn().mockResolvedValue(response),
  });

  const methods = createChainMethods();

  const mockSupabase = {
    from: vi.fn(() => methods),
    methods,
  };

  return mockSupabase;
}
