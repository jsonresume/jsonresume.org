import { describe, it, expect, vi, beforeEach } from 'vitest';

const { store, mockCache } = vi.hoisted(() => {
  const store = new Map();
  return {
    store,
    mockCache: {
      get: vi.fn(async (key) => (store.has(key) ? store.get(key) : null)),
      set: vi.fn(async (key, value) => {
        store.set(key, value);
      }),
    },
  };
});

vi.mock('@vercel/functions', () => ({ getCache: () => mockCache }));
vi.mock('./logger', () => ({ default: { warn: vi.fn() } }));

import { cachedByContent } from './contentCache';

describe('cachedByContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.clear();
  });

  it('computes once per distinct input', async () => {
    const compute = vi.fn(async () => [0.1, 0.2]);

    await cachedByContent('ns', { resume: 1 }, compute);
    const again = await cachedByContent('ns', { resume: 1 }, compute);
    await cachedByContent('ns', { resume: 2 }, compute);

    expect(again).toEqual([0.1, 0.2]);
    expect(compute).toHaveBeenCalledTimes(2);
  });

  it('passes ttl and name through to the cache', async () => {
    await cachedByContent('ns', 'x', async () => 'v', { ttl: 60, name: 'n' });

    expect(mockCache.set).toHaveBeenCalledWith(expect.any(String), 'v', {
      ttl: 60,
      name: 'n',
    });
  });

  it('computes when the cache errors', async () => {
    mockCache.get.mockRejectedValueOnce(new Error('down'));
    mockCache.set.mockRejectedValueOnce(new Error('down'));

    expect(await cachedByContent('ns', 'x', async () => 'v')).toBe('v');
  });
});
