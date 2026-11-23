import { describe, expect, it } from 'vitest';
import { loadSpec, SPEC_NAMES, toSiteMarkdown } from './spec';

describe('specifications on the site', () => {
  it('drops the title and points links at the site or GitHub', () => {
    const markdown = toSiteMarkdown(
      '# JSON Resume 1.x\n\nSee [the schema](schema.json), [jobs](JOB-SPEC.md#2-fields), [decisions](DECISIONS.md) and [a site](https://example.com).\n'
    );
    expect(markdown).not.toContain('# JSON Resume 1.x');
    expect(markdown).toContain('[the schema](/schema.json)');
    expect(markdown).toContain('[jobs](/spec/job#2-fields)');
    expect(markdown).toContain(
      '[decisions](https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/DECISIONS.md)'
    );
    expect(markdown).toContain('[a site](https://example.com)');
  });

  it('loads every specification with no relative link left over', async () => {
    for (const name of SPEC_NAMES) {
      const doc = await loadSpec(name);
      expect(doc.body.length).toBeGreaterThan(1000);
      const relative = [...doc.body.matchAll(/\]\(([^)\s]+)\)/g)]
        .map((m) => m[1] ?? '')
        .filter((href) => !/^(https?:|\/|#|mailto:)/.test(href));
      expect(relative).toEqual([]);
    }
  });
});
