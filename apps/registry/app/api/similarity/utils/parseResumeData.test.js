import { describe, it, expect, vi } from 'vitest';
import { parseResumeData } from './parseResumeData';

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
  },
}));

describe('parseResumeData', () => {
  it('parses valid resume data with embeddings', () => {
    const data = [
      {
        username: 'johndoe',
        resume: JSON.stringify({
          basics: { label: 'Software Developer' },
        }),
        embedding: '[0.1, 0.2, 0.3]',
      },
    ];

    const result = parseResumeData(data);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      username: 'johndoe',
      embedding: [0.1, 0.2, 0.3],
      position: 'Software Developer',
    });
  });

  it('handles array embeddings directly', () => {
    const data = [
      {
        username: 'janedoe',
        resume: JSON.stringify({
          basics: { label: 'Designer' },
        }),
        embedding: [0.4, 0.5, 0.6],
      },
    ];

    const result = parseResumeData(data);

    expect(result).toHaveLength(1);
    expect(result[0].embedding).toEqual([0.4, 0.5, 0.6]);
  });

  it('filters out items with null embeddings', () => {
    const data = [
      {
        username: 'user1',
        resume: '{"basics": {"label": "Developer"}}',
        embedding: '[0.1, 0.2]',
      },
      {
        username: 'user2',
        resume: '{"basics": {"label": "Designer"}}',
        embedding: null,
      },
    ];

    const result = parseResumeData(data);

    expect(result).toHaveLength(1);
    expect(result[0].username).toBe('user1');
  });

  it('uses "Unknown Position" when basics.label is missing', () => {
    const data = [
      {
        username: 'johndoe',
        resume: JSON.stringify({ basics: {} }),
        embedding: '[0.1, 0.2]',
      },
    ];

    const result = parseResumeData(data);

    expect(result[0].position).toBe('Unknown Position');
  });

  it('handles invalid JSON resume data', () => {
    const data = [
      {
        username: 'johndoe',
        resume: 'invalid json {',
        embedding: '[0.1, 0.2]',
      },
    ];

    const result = parseResumeData(data);

    expect(result[0].position).toBe('Unknown Position');
  });

  it('processes multiple valid items', () => {
    const data = [
      {
        username: 'user1',
        resume: '{"basics": {"label": "Developer"}}',
        embedding: '[0.1, 0.2]',
      },
      {
        username: 'user2',
        resume: '{"basics": {"label": "Designer"}}',
        embedding: '[0.3, 0.4]',
      },
      {
        username: 'user3',
        resume: '{"basics": {"label": "Manager"}}',
        embedding: '[0.5, 0.6]',
      },
    ];

    const result = parseResumeData(data);

    expect(result).toHaveLength(3);
    expect(result[0].username).toBe('user1');
    expect(result[1].username).toBe('user2');
    expect(result[2].username).toBe('user3');
  });

  it('handles mixed valid and array embeddings', () => {
    const data = [
      {
        username: 'user1',
        resume: '{"basics": {"label": "Developer"}}',
        embedding: '[0.1, 0.2]',
      },
      {
        username: 'user2',
        resume: '{"basics": {"label": "Manager"}}',
        embedding: [0.5, 0.6],
      },
    ];

    const result = parseResumeData(data);

    expect(result).toHaveLength(2);
    expect(result[0].username).toBe('user1');
    expect(result[1].username).toBe('user2');
  });

  it('handles resume with missing basics section', () => {
    const data = [
      {
        username: 'johndoe',
        resume: '{"work": []}',
        embedding: '[0.1, 0.2]',
      },
    ];

    const result = parseResumeData(data);

    expect(result[0].position).toBe('Unknown Position');
  });

  it('returns empty array when all embeddings are null', () => {
    const data = [
      {
        username: 'user1',
        resume: '{"basics": {"label": "Developer"}}',
        embedding: null,
      },
      {
        username: 'user2',
        resume: '{"basics": {"label": "Designer"}}',
        embedding: null,
      },
    ];

    const result = parseResumeData(data);

    expect(result).toHaveLength(0);
  });
});
