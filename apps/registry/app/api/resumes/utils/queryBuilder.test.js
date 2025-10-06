import { describe, it, expect, vi } from 'vitest';
import { buildResumesQuery } from './queryBuilder';

describe('buildResumesQuery', () => {
  it('builds basic query with default parameters', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams();

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.from).toHaveBeenCalledWith('resumes');
    expect(mockSupabase.methods.select).toHaveBeenCalledWith('*');
    expect(mockSupabase.methods.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    });
    expect(mockSupabase.methods.limit).toHaveBeenCalledWith(2000);
    expect(mockSupabase.methods.range).toHaveBeenCalledWith(0, 1999);
  });

  it('applies custom limit parameter', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ limit: '100' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.limit).toHaveBeenCalledWith(100);
    expect(mockSupabase.methods.range).toHaveBeenCalledWith(0, 99);
  });

  it('calculates correct range for page 2', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ page: '2', limit: '50' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.range).toHaveBeenCalledWith(50, 99);
  });

  it('calculates correct range for page 3', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ page: '3', limit: '100' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.range).toHaveBeenCalledWith(200, 299);
  });

  it('applies text search when search param provided', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ search: 'developer' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.textSearch).toHaveBeenCalledWith(
      'resume',
      'developer',
      {
        config: 'english',
        type: 'websearch',
      }
    );
  });

  it('trims whitespace from search query', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ search: '  developer  ' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.textSearch).toHaveBeenCalledWith(
      'resume',
      'developer',
      {
        config: 'english',
        type: 'websearch',
      }
    );
  });

  it('skips text search when search is empty string', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ search: '' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.textSearch).not.toHaveBeenCalled();
  });

  it('skips text search when search is only whitespace', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ search: '   ' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.textSearch).not.toHaveBeenCalled();
  });

  it('handles all parameters together', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({
      limit: '25',
      page: '4',
      search: 'javascript engineer',
    });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.limit).toHaveBeenCalledWith(25);
    expect(mockSupabase.methods.range).toHaveBeenCalledWith(75, 99);
    expect(mockSupabase.methods.textSearch).toHaveBeenCalledWith(
      'resume',
      'javascript engineer',
      {
        config: 'english',
        type: 'websearch',
      }
    );
  });

  it('parses numeric strings correctly', () => {
    const mockSupabase = createMockSupabase();
    const searchParams = new URLSearchParams({ limit: '50', page: '2' });

    buildResumesQuery(mockSupabase, searchParams);

    expect(mockSupabase.methods.limit).toHaveBeenCalledWith(50);
    expect(mockSupabase.methods.range).toHaveBeenCalledWith(50, 99);
  });
});

// Helper to create mock Supabase client
function createMockSupabase() {
  const methods = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    textSearch: vi.fn().mockReturnThis(),
  };

  const mockSupabase = {
    from: vi.fn(() => methods),
    methods,
  };

  return mockSupabase;
}
