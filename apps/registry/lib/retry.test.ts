import { describe, it, expect, vi, beforeEach } from 'vitest';
import { retryWithBackoff, createRetryFetch, createRetryAxios } from './retry';

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

  it('retries on failure and eventually succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fetch failed'))
      .mockResolvedValueOnce('success');

    // Use shouldRetry to make errors retryable
    const result = await retryWithBackoff(fn, {
      maxAttempts: 3,
      shouldRetry: () => true,
    });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws after max attempts exceeded', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('persistent failure'));

    await expect(
      retryWithBackoff(fn, { maxAttempts: 2, shouldRetry: () => true })
    ).rejects.toThrow('persistent failure');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry non-retryable errors', async () => {
    const error = new Error('Bad Request');
    (error as any).response = { status: 400 };
    const fn = vi.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn, { maxAttempts: 3 })).rejects.toThrow(
      'Bad Request'
    );

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on retryable status codes', async () => {
    const error429 = new Error('Too Many Requests');
    (error429 as any).response = { status: 429 };

    const fn = vi
      .fn()
      .mockRejectedValueOnce(error429)
      .mockResolvedValueOnce('success');

    const result = await retryWithBackoff(fn);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('applies exponential backoff delays', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValueOnce('success');

    const startTime = Date.now();
    await retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelay: 100,
      backoffMultiplier: 2,
      shouldRetry: () => true,
    });

    expect(fn).toHaveBeenCalledTimes(3);
    // Total time should be at least initial delay + (initial delay * multiplier)
    // With jitter, it will vary, but should be roughly 100ms + 200ms = 300ms minimum
    expect(Date.now() - startTime).toBeGreaterThanOrEqual(200);
  });

  it('respects maxDelay configuration', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValueOnce('success');

    const startTime = Date.now();
    await retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 100, // Cap delays at 100ms
      backoffMultiplier: 10,
      shouldRetry: () => true,
    });

    const totalTime = Date.now() - startTime;
    // Even with 10x multiplier, delays should be capped at 100ms each
    // So total should be roughly 100ms + 100ms = 200ms, not 1000ms + 10000ms
    expect(totalTime).toBeLessThan(500);
  });

  it('includes jitter in delay calculations', async () => {
    let callCount = 0;

    const fn = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount < 3) {
        // Fail first 2 attempts, succeed on 3rd
        throw new Error('retry');
      }
      return 'success';
    });

    const startTime = Date.now();
    await retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelay: 100,
      backoffMultiplier: 2,
      shouldRetry: () => true,
    });

    const totalTime = Date.now() - startTime;
    // With jitter (±25%), total time should be roughly:
    // delay1 (100ms ± 25%) + delay2 (200ms ± 25%) = 300ms ± 75ms
    // So roughly 225ms to 375ms
    expect(totalTime).toBeGreaterThanOrEqual(200);
    expect(totalTime).toBeLessThan(400);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('createRetryFetch', () => {
  it('creates a fetch wrapper with retry logic', async () => {
    global.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(new Response('success'));

    const retryFetch = createRetryFetch({
      maxAttempts: 2,
      shouldRetry: () => true,
    });
    const response = await retryFetch('https://api.example.com');

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(await response.text()).toBe('success');
  });
});

describe('createRetryAxios', () => {
  it('creates an axios wrapper with retry logic', async () => {
    const mockAxios = {
      get: vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: 'success' }),
    };

    const retryAxios = createRetryAxios(mockAxios as any, {
      maxAttempts: 2,
      shouldRetry: () => true,
    });
    const response = await retryAxios.get('/api/data');

    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(response.data).toBe('success');
  });
});
