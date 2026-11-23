import { describe, it, expect, vi, afterEach } from 'vitest';
import { cachedByContent } from './contentCache';

describe('cachedByContent', () => {
  afterEach(() => vi.useRealTimers());

  it('computes once per distinct input', async () => {
    const compute = vi.fn(async () => [0.1, 0.2]);

    await cachedByContent('ns-a', { resume: 1 }, compute);
    const again = await cachedByContent('ns-a', { resume: 1 }, compute);
    await cachedByContent('ns-a', { resume: 2 }, compute);

    expect(again).toEqual([0.1, 0.2]);
    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('keeps namespaces apart', async () => {
    const compute = vi.fn(async () => 'v');

    await cachedByContent('ns-b', 'x', compute);
    await cachedByContent('ns-c', 'x', compute);

    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('recomputes once the ttl has passed', async () => {
    vi.useFakeTimers();
    const compute = vi.fn(async () => 'v');

    await cachedByContent('ns-d', 'x', compute, { ttl: 60 });
    vi.advanceTimersByTime(30_000);
    await cachedByContent('ns-d', 'x', compute, { ttl: 60 });
    vi.advanceTimersByTime(31_000);
    await cachedByContent('ns-d', 'x', compute, { ttl: 60 });

    expect(compute).toHaveBeenCalledTimes(2);
  });
});
