/**
 * The schema's descriptions, rewritten as help for people filling in the
 * form: they are written for developers (issue numbers, RFCs, field paths
 * like skills[].name, a literal "\n"), and the form shows each under its
 * field. The schema itself keeps them as they are.
 */
const REWRITES: ReadonlyArray<readonly [RegExp, string]> = [
  // Issue references: "(#313)".
  [/\s*\(#\d+\)/g, ''],
  [
    /\s*Inline Markdown allowed:[^;]*; no headings, lists or tables\.?/,
    ' You can use **bold**, *italics*, `code` and [links](https://example.com).',
  ],
  [
    /^URL \(as per RFC 3986\) to a image in JPEG or PNG format$/,
    'A link to a photo of you, JPEG or PNG.',
  ],
  [/^URL \(as per RFC 3986\) (?:to|of) /, 'A link to '],
  [
    /^To add multiple address lines, use \n\. For example, (.*)\n(.*?)\.?$/s,
    'Put each line of the address on its own line, e.g. $1, then $2.',
  ],
  [
    /Distinct from basics\.summary, which describes background/,
    'Your summary says where you’ve been; this says where you’re going. Job matches read it; themes don’t show it.',
  ],
  [/^code as per ISO-3166-1 ALPHA-2, /, 'Two-letter country code, '],
  [/^A skills\[\]\.name or skills\[\]\.id/, 'The name of one of your skills'],
  [
    /, naming or repeating entries of the top-level skills list, so a skill can point to where it was used/,
    ', from your Skills section, so each skill shows where you used it',
  ],
  [
    /^Deprecated alias of summary, kept for compatibility; when both are set, summary wins\..*$/s,
    'An older name for Summary. Use Summary instead; it wins when both are set.',
  ],
];

export function helpText(description: string): string {
  const text = REWRITES.reduce(
    (out, [pattern, replacement]) => out.replace(pattern, replacement),
    description
  )
    .replace(/\s+/g, ' ')
    .trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
