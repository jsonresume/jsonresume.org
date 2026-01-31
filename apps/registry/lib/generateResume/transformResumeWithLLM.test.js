import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('ai', () => ({
  generateText: vi.fn(),
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

    expect(await transformResumeWithLLM(resume, '')).toEqual(resume);
    expect(await transformResumeWithLLM(resume, null)).toEqual(resume);
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

  it('applies dot-notation changes from LLM response', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const { generateText } = await import('ai');
    generateText.mockResolvedValue({
      text: JSON.stringify({
        'basics.label': 'Frontend Developer',
        'basics.summary': 'Updated summary',
      }),
    });

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = {
      basics: { name: 'Test User', label: 'Developer', summary: 'Old summary' },
    };

    const result = await transformResumeWithLLM(resume, 'promote frontend');

    expect(result.basics.label).toBe('Frontend Developer');
    expect(result.basics.summary).toBe('Updated summary');
    expect(result.basics.name).toBe('Test User'); // Unchanged
  });

  it('applies nested array changes', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const { generateText } = await import('ai');
    generateText.mockResolvedValue({
      text: '{"work.0.summary": "Updated job summary"}',
    });

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = {
      basics: { name: 'Test' },
      work: [{ name: 'Company', summary: 'Old summary' }],
    };

    const result = await transformResumeWithLLM(resume, 'update first job');

    expect(result.work[0].summary).toBe('Updated job summary');
    expect(result.work[0].name).toBe('Company'); // Unchanged
  });

  it('handles JSON in markdown code blocks', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const { generateText } = await import('ai');
    generateText.mockResolvedValue({
      text: '```json\n{"basics.label": "Engineer"}\n```',
    });

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = { basics: { name: 'Test', label: 'Dev' } };

    const result = await transformResumeWithLLM(resume, 'change label');
    expect(result.basics.label).toBe('Engineer');
  });

  it('returns original resume on API error', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const { generateText } = await import('ai');
    generateText.mockRejectedValue(new Error('API Error'));

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = { basics: { name: 'Test User' } };

    const result = await transformResumeWithLLM(resume, 'some prompt');
    expect(result).toEqual(resume);
  });

  it('returns original resume on JSON parse error', async () => {
    process.env.OPENAI_API_KEY = 'test-key';

    const { generateText } = await import('ai');
    generateText.mockResolvedValue({ text: 'invalid json' });

    const { transformResumeWithLLM } = await import(
      './transformResumeWithLLM.js'
    );
    const resume = { basics: { name: 'Test User' } };

    const result = await transformResumeWithLLM(resume, 'some prompt');
    expect(result).toEqual(resume);
  });
});
