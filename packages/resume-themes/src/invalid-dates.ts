/**
 * Dates a theme couldn't read, taken out of its HTML. Some themes (even)
 * print every entry's date range, so an entry without a start date showed
 * "Invalid Date – Present". With no dates at all the range goes; with an
 * end date only, that date stays. Found by rendering every resume viewed
 * in 30 days in its own theme (2026-11-25).
 */
export const withoutInvalidDates = (html: string) =>
  html
    .replace(/<time datetime="">Invalid Date<\/time>\s*–\s*Present/g, '')
    .replace(/<time datetime="">Invalid Date<\/time>\s*–\s*/g, '')
    .replace(/<time datetime="">Invalid Date<\/time>/g, '');
