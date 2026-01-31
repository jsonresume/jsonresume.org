import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the AI SDK
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn(() => 'mocked-model'),
}));

vi.mock('../logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('transformResumeWithLLM', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('returns original resume when no prompt provided', async () => {
    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = { basics: { name: 'Test User' } };

    const result = await transformResumeWithLLM(resume, '');
    expect(result).toEqual(resume);

    const result2 = await transformResumeWithLLM(resume, null);
    expect(result2).toEqual(resume);
  });

  it('returns original resume when OPENAI_API_KEY not set', async () => {
    const originalKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = { basics: { name: 'Test User' } };

    const result = await transformResumeWithLLM(resume, 'promote frontend');
    expect(result).toEqual(resume);

    process.env.OPENAI_API_KEY = originalKey;
  });

  it('calls generateObject with correct parameters', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const { generateObject } = await import('ai');
    generateObject.mockResolvedValue({
      object: {
        basics: { name: 'Test User', label: 'Frontend Developer' },
      },
    });

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = { basics: { name: 'Test User', label: 'Developer' } };

    const result = await transformResumeWithLLM(
      resume,
      'promote frontend experience'
    );

    expect(generateObject).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringContaining('professional resume editor'),
        prompt: expect.stringContaining('promote frontend experience'),
      })
    );

    expect(result.basics.label).toBe('Frontend Developer');
  });

  it('returns original resume on API error', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const { generateObject } = await import('ai');
    generateObject.mockRejectedValue(new Error('API Error'));

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = { basics: { name: 'Test User' } };

    const result = await transformResumeWithLLM(resume, 'some prompt');
    expect(result).toEqual(resume);
  });
});
