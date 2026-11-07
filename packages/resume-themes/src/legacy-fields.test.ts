import { describe, expect, it } from 'vitest';
import { withLegacyWorkNames } from './legacy-fields.ts';

describe('legacy work headings', () => {
  it.each(['paper-plus-plus', 'tan-responsive'])(
    'preserves current employer names in %s',
    (theme) => {
      const input = {
        work: [
          {
            name: 'Current employer',
            url: 'https://example.com',
            position: 'Engineer',
          },
        ],
      };
      expect(withLegacyWorkNames(theme, input)['work']).toEqual([
        {
          ...input.work[0],
          company: 'Current employer',
          website: 'https://example.com',
        },
      ]);
      expect(input.work[0]).not.toHaveProperty('company');
    }
  );
  it('keeps existing legacy values and leaves other themes alone', () => {
    const input = {
      work: [
        { name: 'New', company: 'Legacy', website: 'https://legacy.example' },
      ],
    };
    expect(withLegacyWorkNames('paper-plus-plus', input)['work']).toEqual(
      input.work
    );
    expect(withLegacyWorkNames('elegant', input)).toBe(input);
  });
  it('preserves summaries in the bullet-only Tan template without inserting HTML', () => {
    const input = {
      work: [{ summary: 'Led <team> & delivery', highlights: ['Result'] }],
    };
    expect(withLegacyWorkNames('tan-responsive', input)['work']).toEqual([
      {
        ...input.work[0],
        company: undefined,
        website: undefined,
        highlights: ['Led &lt;team&gt; &amp; delivery', 'Result'],
      },
    ]);
  });
  it('does not introduce executable URLs into legacy website fields', () => {
    const result = withLegacyWorkNames('paper-plus-plus', {
      work: [{ url: 'java\nscript:alert(1)' }],
    });
    expect(result['work']).toEqual([
      { url: 'java\nscript:alert(1)', company: undefined, website: undefined },
    ]);
  });
});
