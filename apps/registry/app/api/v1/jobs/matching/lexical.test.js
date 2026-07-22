import { describe, it, expect } from 'vitest';
import { buildLexicalQuery, promptToLexicalQuery } from './lexical';

describe('buildLexicalQuery', () => {
  it('joins skill names and keywords with OR, quoting phrases', () => {
    const q = buildLexicalQuery({
      skills: [
        { name: 'Frontend', keywords: ['React', 'Vercel AI SDK'] },
        { name: 'Rust' },
      ],
    });
    expect(q).toBe('Frontend OR React OR "Vercel AI SDK" OR Rust');
  });

  it('dedupes case-insensitively and drops generic filler', () => {
    const q = buildLexicalQuery({
      skills: [
        { name: 'react', keywords: ['React', 'Software', 'Engineering'] },
      ],
    });
    expect(q).toBe('react');
  });

  it('strips tsquery metacharacters', () => {
    const q = buildLexicalQuery({
      skills: [{ name: "C(1) & B's | weird:term" }],
    });
    expect(q).not.toMatch(/[()|&:']/);
  });

  it('returns empty string for no skills', () => {
    expect(buildLexicalQuery({})).toBe('');
    expect(buildLexicalQuery(null)).toBe('');
  });

  it('caps the number of terms', () => {
    const skills = Array.from({ length: 60 }, (_, i) => ({
      name: `skillname${i}`,
    }));
    const q = buildLexicalQuery({ skills });
    expect(q.split(' OR ').length).toBeLessThanOrEqual(25);
  });
});

describe('promptToLexicalQuery', () => {
  it('ORs distinctive words and drops stopwords/short words', () => {
    const q = promptToLexicalQuery(
      'remote founding engineer TypeScript and Node.js for an AI startup'
    );
    expect(q).toContain('typescript');
    expect(q).toContain('founding');
    expect(q).not.toContain(' and ');
    expect(q).not.toMatch(/(^| )remote( |$)/); // stopword for jobs corpus
    expect(q.split(' OR ').length).toBeGreaterThan(2);
  });

  it('handles empty input', () => {
    expect(promptToLexicalQuery('')).toBe('');
    expect(promptToLexicalQuery(null)).toBe('');
  });
});
