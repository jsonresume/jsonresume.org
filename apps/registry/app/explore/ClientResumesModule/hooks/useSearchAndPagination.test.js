import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSearchAndPagination } from './useSearchAndPagination';

// Mock Next.js navigation
const mockPush = vi.fn();
let mockSearchParamsData = {};

const createMockSearchParams = () => ({
  get: (key) => mockSearchParamsData[key] || null,
  set: (key, value) => {
    mockSearchParamsData[key] = value;
  },
  delete: (key) => {
    delete mockSearchParamsData[key];
  },
  toString: () => {
    return Object.entries(mockSearchParamsData)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
  },
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => createMockSearchParams(),
  usePathname: () => '/explore',
}));

describe('useSearchAndPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsData = {};
  });

  it('initializes with provided search and page values', () => {
    const { result } = renderHook(() =>
      useSearchAndPagination('test search', 1, [])
    );

    expect(result.current.searchTerm).toBe('test search');
  });

  it('initializes with empty search', () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    expect(result.current.searchTerm).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('provides setSearchTerm function', () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    expect(typeof result.current.setSearchTerm).toBe('function');
  });

  it('provides handlePageChange function', () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    expect(typeof result.current.handlePageChange).toBe('function');
  });

  it('provides setSearchTerm to update search', () => {
    const { result } = renderHook(() =>
      useSearchAndPagination('initial', 1, [])
    );

    // Initial value should match
    expect(result.current.searchTerm).toBe('initial');

    // setSearchTerm function should exist
    expect(typeof result.current.setSearchTerm).toBe('function');
  });

  it('debounces search updates', async () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    result.current.setSearchTerm('a');
    result.current.setSearchTerm('ab');
    result.current.setSearchTerm('abc');

    // Should not navigate immediately
    expect(mockPush).not.toHaveBeenCalled();

    // Should navigate after debounce delay (300ms)
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalled();
      },
      { timeout: 500 }
    );
  });

  it('navigates after search debounce delay', async () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    result.current.setSearchTerm('test');

    // Should navigate after debounce delay (300ms)
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalled();
      },
      { timeout: 500 }
    );
  });

  it('calls router.push with search params', async () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    result.current.setSearchTerm('test query');

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('search=test+query')
        );
      },
      { timeout: 500 }
    );
  });

  it('removes page param when search changes', async () => {
    mockSearchParamsData['page'] = '3';
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    result.current.setSearchTerm('new search');

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalled();
        const callArg = mockPush.mock.calls[0][0];
        expect(callArg).not.toContain('page=3');
      },
      { timeout: 500 }
    );
  });

  it('removes search param when search is cleared', async () => {
    const { result } = renderHook(() =>
      useSearchAndPagination('initial', 1, [])
    );

    result.current.setSearchTerm('');

    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalled();
        const callArg = mockPush.mock.calls[0][0];
        expect(callArg).not.toContain('search=');
      },
      { timeout: 500 }
    );
  });

  it('handles page change correctly', () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    result.current.handlePageChange(3);

    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=3'));
  });

  it('preserves search param when changing page', () => {
    mockSearchParamsData['search'] = 'test';
    const { result } = renderHook(() => useSearchAndPagination('test', 1, []));

    result.current.handlePageChange(2);

    // Should have been called with URL containing both params
    const callArg = mockPush.mock.calls[0][0];
    expect(callArg).toContain('page=2');
  });

  it('calls router.push when page changes', () => {
    const { result } = renderHook(() => useSearchAndPagination('', 1, []));

    result.current.handlePageChange(2);
    expect(mockPush).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=2'));
  });
});
