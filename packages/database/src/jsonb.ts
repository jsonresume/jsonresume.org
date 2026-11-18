/**
 * A value as text for a `jsonb` parameter (`${jsonbText(v)}::jsonb`).
 * Postgres can't hold the NUL character in jsonb ("\u0000 cannot be
 * converted to text"), and resumes carry them from PDFs and old gists:
 * two legacy resumes' pages answered 500 until they were dropped. Every
 * other character is kept.
 */
export const jsonbText = (value: unknown): string =>
  JSON.stringify(value, (_key, v: unknown) =>
    typeof v === 'string' ? v.replaceAll('\u0000', '') : v
  );
