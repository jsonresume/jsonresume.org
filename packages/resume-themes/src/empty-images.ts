/** An `<img>` whose src is empty: `src=""`, `src=''`, or `src=` and nothing. */
const EMPTY_IMAGE = /<img\b[^>]*?\ssrc=(?:""|''|(?=\s|\/?>))[^>]*>/gi;

/**
 * Photos a resume doesn't have, taken out of its HTML. Two themes print
 * their photo whatever the resume holds: tan-responsive as `src=""`, which
 * shows its alt text ("avatar") instead, and minyma unquoted, as
 * `<img src= alt="avatar">`, which browsers read as a link to a page
 * called `alt="avatar"` and show broken. Found by rendering every theme
 * without a photo (2026-11-28).
 */
export const withoutEmptyImages = (html: string) =>
  html.replace(EMPTY_IMAGE, '');
