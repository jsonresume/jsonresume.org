import { Predicate } from 'effect';
import type { ResumeDocument } from './render.ts';

/** Themes that name the country from `location.countryCode`, and throw on anything but an ISO code. */
const READS_CODES = new Set(['even']);

/** Codes and names people write for the commonest countries that aren't their ISO code or English name. */
const WRITTEN: Record<string, string> = {
  usa: 'US',
  'united states of america': 'US',
  uk: 'GB',
  gbr: 'GB',
  uae: 'AE',
  ind: 'IN',
  can: 'CA',
  cdn: 'CA',
  aus: 'AU',
  col: 'CO',
  idn: 'ID',
  cze: 'CZ',
  deu: 'DE',
  ger: 'DE',
  fra: 'FR',
  esp: 'ES',
  mex: 'MX',
  pak: 'PK',
  brasil: 'BR',
  deutschland: 'DE',
  polska: 'PL',
  italia: 'IT',
  nederland: 'NL',
  españa: 'ES',
  maroc: 'MA',
  türkiye: 'TR',
};

let known: { byName: Map<string, string>; codes: Set<string> } | undefined;

/** Every region's code, and its English name, lower-case, to the code ("india" to "IN"). */
const regions = () => {
  if (known) return known;
  const byName = new Map<string, string>();
  const names = new Intl.DisplayNames(['en'], { type: 'region' });
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const a of letters)
    for (const b of letters) {
      const name = names.of(a + b);
      if (name && name !== a + b) byName.set(name.toLowerCase(), a + b);
    }
  known = { byName, codes: new Set(byName.values()) };
  return known;
};

/** The ISO code a resume's country means, if it means one. */
export const regionCode = (written: string): string | undefined => {
  const text = written.trim();
  if (/^[A-Za-z]{2}$/.test(text)) {
    const code = text.toUpperCase();
    return regions().codes.has(code) ? code : undefined;
  }
  const key = text.toLowerCase().replace(/\s*\(.*\)\s*$/, '');
  return WRITTEN[key] ?? regions().byName.get(key);
};

/**
 * For themes that read the country as an ISO code: "USA" and "India" as
 * their codes; a country no code fits ("Planet Earth") is kept as the
 * region, so it still shows, rather than stopping the page.
 */
export const withRegionCodes = (
  theme: string,
  resume: ResumeDocument
): ResumeDocument => {
  const basics = resume['basics'];
  if (!READS_CODES.has(theme) || !Predicate.isObject(basics)) return resume;
  const location = basics['location'];
  if (!Predicate.isObject(location)) return resume;
  const written = location['countryCode'];
  if (!Predicate.isString(written) || !written.trim()) return resume;
  const code = regionCode(written);
  if (code === written) return resume;
  const { countryCode: _, ...rest } = location;
  return {
    ...resume,
    basics: {
      ...basics,
      location: code
        ? { ...rest, countryCode: code }
        : { ...rest, region: location['region'] || written },
    },
  };
};
