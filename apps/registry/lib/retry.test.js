import { describe, it, expect, vi, beforeEach } from 'vitest';
import { retryWithBackoff, createRetryFetch, createRetryAxios } from './retry';

// Mock logger
vi.mock('./logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('retryWithBackoff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('succeeds on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const result = await retryWithBackoff(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on network error', async () => {
    const error = new TypeError('fetch failed');
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const result = await retryWithBackoff(fn, { maxAttempts: 3 });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on timeout error', async () => {
    const error = new Error('Request timeout');
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const result = await retryWithBackoff(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on AbortError', async () => {
    const error = new Error('aborted');
    error.name = 'AbortError';
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const result = await retryWithBackoff(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on retryable HTTP status codes', async () => {
    const error = new Error('Server error');
    error.response = { status: 503 };
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const result = await retryWithBackoff(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries on axios errors', async () => {
    const error = new Error('Connection aborted');
    error.code = 'ECONNABORTED';
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const result = await retryWithBackoff(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('uses custom shouldRetry function', async () => {
    const error = new Error('Custom error');
    const shouldRetry = vi.fn().mockReturnValue(true);
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const result = await retryWithBackoff(fn, { shouldRetry });

    expect(result).toBe('success');
    expect(shouldRetry).toHaveBeenCalledWith(error);
  });

  it('stops retrying after max attempts', async () => {
    const error = new Error('fetch failed');
    error.name = 'TypeError';
    const fn = vi.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn, { maxAttempts: 2 })).rejects.toThrow(
      'fetch failed'
    );

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry non-retryable errors', async () => {
    const error = new Error('Not found');
    error.response = { status: 404 };
    const fn = vi.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn)).rejects.toThrow('Not found');

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('respects custom max attempts', async () => {
    const error = new Error('timeout');
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      retryWithBackoff(fn, { maxAttempts: 5, initialDelay: 1 })
    ).rejects.toThrow();

    expect(fn).toHaveBeenCalledTimes(5);
  });

  it('waits between retries', async () => {
    const error = new Error('timeout');
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue('success');

    const start = Date.now();
    await retryWithBackoff(fn, { initialDelay: 100, maxAttempts: 2 });
    const duration = Date.now() - start;

    expect(duration).toBeGreaterThanOrEqual(50); // Should have some delay
  });
});

describe('createRetryFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates fetch wrapper that retries', async () => {
    const fetchWithRetry = createRetryFetch({ maxAttempts: 3 });

    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => ({ data: 'test' }) });

    const response = await fetchWithRetry('/api/test');

    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('/api/test', undefined);
  });

  it('throws error on non-ok response', async () => {
    const fetchWithRetry = createRetryFetch({ maxAttempts: 1 });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchWithRetry('/api/test')).rejects.toThrow(
      'HTTP 404: Not Found'
    );
  });

  it('passes fetch options', async () => {
    const fetchWithRetry = createRetryFetch();

    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    const options = { method: 'POST', body: '{}' };
    await fetchWithRetry('/api/test', options);

    expect(global.fetch).toHaveBeenCalledWith('/api/test', options);
  });
});

describe('createRetryAxios', () => {
  it('creates axios wrapper with retry methods', () => {
    const mockAxios = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };

    const axiosWithRetry = createRetryAxios(mockAxios);

    expect(axiosWithRetry).toHaveProperty('get');
    expect(axiosWithRetry).toHaveProperty('post');
    expect(axiosWithRetry).toHaveProperty('put');
    expect(axiosWithRetry).toHaveProperty('patch');
    expect(axiosWithRetry).toHaveProperty('delete');
  });

  it('retries axios requests', async () => {
    const mockAxios = {
      get: vi.fn().mockResolvedValue({ data: 'test' }),
    };

    const axiosWithRetry = createRetryAxios(mockAxios);
    const result = await axiosWithRetry.get('/api/test');

    expect(result.data).toBe('test');
    expect(mockAxios.get).toHaveBeenCalledWith('/api/test');
  });

  it('passes arguments to axios methods', async () => {
    const mockAxios = {
      post: vi.fn().mockResolvedValue({ data: 'created' }),
    };

    const axiosWithRetry = createRetryAxios(mockAxios);
    await axiosWithRetry.post('/api/test', { name: 'test' }, { headers: {} });

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/api/test',
      { name: 'test' },
      { headers: {} }
    );
  });
});
