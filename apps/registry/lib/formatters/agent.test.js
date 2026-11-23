import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGenerateText } = vi.hoisted(() => ({
  mockGenerateText: vi.fn(),
}));

vi.mock('ai', () => ({ generateText: mockGenerateText }));
vi.mock('@ai-sdk/openai', () => ({ openai: () => 'model' }));
vi.mock('../logger', () => ({ default: { warn: vi.fn() } }));

import agent from './agent';
import { clearContentCache } from '../contentCache';

const resume = { basics: { name: 'Jane' } };

describe('agent formatter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearContentCache();
    mockGenerateText.mockResolvedValue({ text: '# Agent Specification' });
  });

  it('generates markdown and caches it', async () => {
    const result = await agent.format(resume, { username: 'jane' });

    expect(result.content).toBe('# Agent Specification');
    expect(result.headers[0].value).toContain('text/markdown');
    const { prompt } = mockGenerateText.mock.calls[0][0];
    expect(prompt).toContain('https://registry.jsonresume.org/jane.json');
    expect(prompt).toContain('"Jane"');
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
});
