import { Predicate } from 'effect';
import type { Posting } from './posting';

/**
 * Whether someone living in a country can take a job: "no" only when the
 * post rules them out (remote fenced to regions that leave them out, or an
 * office in another country); "unclear" when it can't be told.
 */
export type Eligibility = 'yes' | 'no' | 'unclear';

const EU = new Set(
  'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE'.split(
    ' '
  )
);
const APAC = 'AU NZ SG JP KR IN ID PH MY TH VN HK TW CN';
const NORTH_AMERICA = 'US CA MX';
const LATAM = 'MX BR AR CL CO PE UY CR EC BO PY VE GT';
const EUROPE = 'EU GB CH NO IS';
const EMEA = `${EUROPE} AE IL SA QA TR ZA NG KE EG MA`;
const ANYWHERE = '*';

/** Region names as posts write them, lower-case, to ISO country codes. */
const REGIONS: Record<string, string> = {
  worldwide: ANYWHERE,
  anywhere: ANYWHERE,
  global: ANYWHERE,
  international: ANYWHERE,
  remote: ANYWHERE,
  'non-us': ANYWHERE,
  apac: APAC,
  apj: APAC,
  'asia pacific': APAC,
  'asia-pacific': APAC,
  asia: APAC,
  anz: 'AU NZ',
  oceania: 'AU NZ',
  australia: 'AU',
  'new zealand': 'NZ',
  namer: NORTH_AMERICA,
  'north america': NORTH_AMERICA,
  na: NORTH_AMERICA,
  amer: `${NORTH_AMERICA} ${LATAM}`,
  americas: `${NORTH_AMERICA} ${LATAM}`,
  latam: LATAM,
  'latin america': LATAM,
  'south america': LATAM,
  usa: 'US',
  'united states': 'US',
  canada: 'CA',
  uk: 'GB',
  'united kingdom': 'GB',
  england: 'GB',
  europe: EUROPE,
  'western europe': EUROPE,
  eu: 'EU',
  emea: EMEA,
  'middle east': 'AE IL SA QA TR',
  africa: 'ZA NG KE EG MA',
  india: 'IN',
  japan: 'JP',
  singapore: 'SG',
  brazil: 'BR',
  mexico: 'MX',
  germany: 'DE',
  france: 'FR',
  spain: 'ES',
  italy: 'IT',
  poland: 'PL',
  romania: 'RO',
  ireland: 'IE',
  netherlands: 'NL',
  portugal: 'PT',
  switzerland: 'CH',
  sweden: 'SE',
  'north macedonia': 'MK',
  'costa rica': 'CR',
};
// European time zones ("CET ±2h", "GMT-2 to GMT+2", "UTC+1 to UTC+2").
const EUROPE_TIME = /^(cet|cest|eet|eest|wet|west|bst|gmt|utc)\b/i;
const EUROPE_AND_AFRICA = `${EUROPE} ZA NG KE EG MA GH`;
// US states, US time zones and cities, as fenced US remote is written.
const US_LIKE =
  /^(us\b|u\.s\.|sf\b|nyc\b|bay area|silicon valley|pst\b|est\b|cst\b|mst\b|pacific time|eastern time|central time|alabama|alaska|arizona|california|colorado|florida|georgia|illinois|massachusetts|michigan|minnesota|mississippi|missouri|new york|north carolina|ohio|oklahoma|oregon|pennsylvania|tennessee|texas|utah|virginia|washington)/i;

/** The countries a region label covers; undefined when it can't be read. */
export const regionCountries = (
  label: string
): ReadonlySet<string> | undefined => {
  const name = label
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim();
  const known = REGIONS[name];
  if (known) return new Set(known.split(' '));
  if (/^[a-z]{2}$/.test(name)) return new Set([name.toUpperCase()]);
  if (US_LIKE.test(name)) return new Set(['US']);
  if (EUROPE_TIME.test(name)) return new Set(EUROPE_AND_AFRICA.split(' '));
  return undefined;
};

const covers = (countries: ReadonlySet<string>, country: string) =>
  countries.has(ANYWHERE) ||
  countries.has(country) ||
  (countries.has('EU') && EU.has(country));

/** Whether any of the regions covers the country, as far as they can be read. */
const regionsAllow = (
  regions: ReadonlyArray<string>,
  country: string
): Eligibility => {
  const read = regions.map(regionCountries);
  if (read.some((r) => r !== undefined && covers(r, country))) return 'yes';
  // A time zone or a list we can't read might still include them.
  return read.every((r) => r !== undefined) ? 'no' : 'unclear';
};

/** Whether someone in `country` (ISO alpha-2) can take the job. */
export const eligibility = (
  posting: Posting,
  country: string | undefined
): Eligibility => {
  if (!country) return 'unclear';
  const regions = posting.remoteRegions;
  switch (posting.remote) {
    case 'remote_global':
      return 'yes';
    case 'remote_region':
      return regions.length > 0 ? regionsAllow(regions, country) : 'unclear';
    case 'onsite':
    case 'hybrid':
      if (posting.countryCode) {
        return posting.countryCode.toUpperCase() === country ? 'yes' : 'no';
      }
      return regions.length > 0 ? regionsAllow(regions, country) : 'unclear';
    default:
      return 'unclear';
  }
};

/** The resume's country (basics.location.countryCode), upper-case. */
export const resumeCountry = (resume: unknown): string | undefined => {
  const at = (o: unknown, key: string): unknown =>
    Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
  const code = at(at(at(resume, 'basics'), 'location'), 'countryCode');
  return Predicate.isString(code) && /^[a-z]{2}$/i.test(code.trim())
    ? code.trim().toUpperCase()
    : undefined;
};
