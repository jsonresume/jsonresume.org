// One location formatter for the masthead and every entry.

import { isObject, text } from './text.js';

let regionNames;
function countryName(code) {
  try {
    regionNames ??= new Intl.DisplayNames(['en'], { type: 'region' });
    const name = regionNames.of(code.toUpperCase());
    return name && name !== code.toUpperCase() ? name : code;
  } catch {
    return code;
  }
}

/**
 * A string location is shown as supplied. A structured one (#323) shows
 * city, region and country; street address and postal code only with
 * `full`. Country codes are written out ("AU" -> "Australia").
 */
export function formatLocation(location, { full = false } = {}) {
  if (typeof location === 'string') return text(location);
  if (!isObject(location)) return null;
  const code = text(location.countryCode);
  const country = code ? countryName(code) : text(location.country);
  const region = full
    ? [text(location.region), text(location.postalCode)]
        .filter(Boolean)
        .join(' ')
    : text(location.region);
  const parts = [
    full ? text(location.address) : null,
    text(location.city),
    region || null,
    country,
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}
