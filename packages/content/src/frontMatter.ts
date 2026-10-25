import { Schema } from 'effect';

/**
 * Splits `---`-fenced front matter from a Markdown document. Front matter is
 * flat `key: value` lines; values may be wrapped in single or double quotes.
 * Anything richer belongs in a data file, not a document header.
 */
export class FrontMatterError extends Schema.TaggedError<FrontMatterError>()(
  'FrontMatterError',
  { source: Schema.String, message: Schema.String }
) {}

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const LINE = /^([A-Za-z][\w-]*):\s*(.*)$/;

const unquote = (value: string) => {
  const quoted = /^(['"])(.*)\1$/.exec(value);
  return quoted ? quoted[2] : value;
};

export function parseFrontMatter(
  source: string,
  name = 'document'
): { data: Record<string, string>; body: string } {
  const match = FENCE.exec(source);
  if (!match) {
    throw new FrontMatterError({
      source: name,
      message: 'Missing front matter',
    });
  }
  const data: Record<string, string> = {};
  for (const raw of match[1].split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const field = LINE.exec(line);
    if (!field) {
      throw new FrontMatterError({
        source: name,
        message: `Unreadable front matter line: ${line}`,
      });
    }
    data[field[1]] = unquote(field[2].trim());
  }
  return { data, body: source.slice(match[0].length).replace(/^\s+/, '') };
}
