const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

const decodeEntities = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) {
      return String.fromCodePoint(parseInt(code.slice(2), 16));
    }
    if (code.startsWith('#'))
      return String.fromCodePoint(Number(code.slice(1)));
    return ENTITIES[code.toLowerCase()] ?? whole;
  });

/**
 * An HN comment's HTML as plain paragraphs. HN emits only <p>, <a>, <i>
 * and <pre><code>; links keep their full URL (HN shortens the text).
 */
export const postParagraphs = (html: string): string[] =>
  html
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>.*?<\/a>/gi, (_, href: string) =>
      decodeEntities(href)
    )
    .split(/<p>/i)
    .map((part) => decodeEntities(part.replace(/<[^>]+>/g, '')).trim())
    .filter(Boolean);

export const postText = (html: string): string =>
  postParagraphs(html).join('\n\n');
