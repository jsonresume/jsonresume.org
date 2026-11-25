import { describe, expect, it } from 'vitest';
import schema from '@jsonresume/schema/schema.json';
import { helpText } from './help';

/** Every description in the schema, wherever it sits. */
const descriptions = (node: unknown): Array<string> => {
  if (typeof node !== 'object' || node === null) return [];
  const own =
    'description' in node && typeof node.description === 'string'
      ? [node.description]
      : [];
  return [...own, ...Object.values(node).flatMap(descriptions)];
};

describe('helpText', () => {
  it('leaves no developer notes in any field’s help', () => {
    for (const description of descriptions(schema)) {
      const help = helpText(description);
      expect(help).not.toMatch(/#\d|RFC|\[\]\.|basics\.|\n|ISO-3166/);
      expect(help).not.toMatch(/^[a-z]/);
    }
  });

  it('says what the address and objective fields want', () => {
    expect(
      helpText(
        'To add multiple address lines, use \n. For example, 1234 Glücklichkeit Straße\nHinterhaus 5. Etage li.'
      )
    ).toBe(
      'Put each line of the address on its own line, e.g. 1234 Glücklichkeit Straße, then Hinterhaus 5. Etage li.'
    );
    expect(
      helpText(
        "Forward-looking career goal, e.g. 'Seeking a senior backend role in climate tech'. Distinct from basics.summary, which describes background (#317)"
      )
    ).toBe(
      "Forward-looking career goal, e.g. 'Seeking a senior backend role in climate tech'. Your summary says where you’ve been; this says where you’re going. Job matches read it; themes don’t show it."
    );
  });

  it('turns the Markdown note into one plain line', () => {
    expect(
      helpText(
        'Specify multiple accomplishments. Inline Markdown allowed: **strong**, *emphasis*, `code` and [links](https://example.com); no headings, lists or tables (#600)'
      )
    ).toBe(
      'Specify multiple accomplishments. You can use **bold**, *italics*, `code` and [links](https://example.com).'
    );
  });
});
