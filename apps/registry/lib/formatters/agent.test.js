import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGenerateText, store, mockCache } = vi.hoisted(() => {
  const store = new Map();
  return {
    store,
    mockGenerateText: vi.fn(),
    mockCache: {
      get: vi.fn(async (key) => store.get(key) ?? null),
      set: vi.fn(async (key, value) => {
        store.set(key, value);
      }),
    },
  };
});

vi.mock('ai', () => ({ generateText: mockGenerateText }));
vi.mock('@ai-sdk/openai', () => ({ openai: () => 'model' }));
vi.mock('@vercel/functions', () => ({ getCache: () => mockCache }));
vi.mock('../logger', () => ({ default: { warn: vi.fn() } }));

import agent from './agent';

const resume = { basics: { name: 'Jane' } };

describe('agent formatter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.clear();
    mockGenerateText.mockResolvedValue({ text: '# Agent Specification' });
  });

  it('generates markdown and caches it', async () => {
    const result = await agent.format(resume, { username: 'jane' });

    expect(result.content).toBe('# Agent Specification');
    expect(result.headers[0].value).toContain('text/markdown');
    const { prompt } = mockGenerateText.mock.calls[0][0];
    expect(prompt).toContain('https://registry.jsonresume.org/jane.json');
    expect(prompt).toContain('"Jane"');
    expect(mockCache.set).toHaveBeenCalledTimes(1);
  });

  it('serves the same resume from the cache without calling the model', async () => {
    await agent.format(resume, { username: 'jane' });
    const second = await agent.format(resume, { username: 'jane' });

    expect(second.content).toBe('# Agent Specification');
    expect(mockGenerateText).toHaveBeenCalledTimes(1);
  });

  it('regenerates when the resume changes', async () => {
    await agent.format(resume, { username: 'jane' });
    await agent.format(
      { basics: { name: 'Jane', label: 'Engineer' } },
      { username: 'jane' }
    );

    expect(mockGenerateText).toHaveBeenCalledTimes(2);
  });

  it('still generates when the cache is unavailable', async () => {
    mockCache.get.mockRejectedValueOnce(new Error('cache down'));
    mockCache.set.mockRejectedValueOnce(new Error('cache down'));

    const result = await agent.format(resume, { username: 'jane' });

    expect(result.content).toBe('# Agent Specification');
  });
});
