import { Predicate } from 'effect';

export type Entry = Readonly<Record<string, unknown>>;

/** A field as text: strings and numbers, trimmed; anything else is absent. */
export const text = (value: unknown): string | undefined => {
  if (Predicate.isNumber(value)) return String(value);
  if (!Predicate.isString(value)) return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

/** The objects in a list field, skipping anything else. */
export const entries = (value: unknown): ReadonlyArray<Entry> =>
  Array.isArray(value) ? value.filter(Predicate.isObject) : [];

/** The text items in a list field, e.g. highlights or keywords. */
export const texts = (value: unknown): ReadonlyArray<string> =>
  Array.isArray(value) ? value.flatMap((item) => text(item) ?? []) : [];

/** A location, structured ({ city, region, ... }) or already a string. */
export const place = (value: unknown): string | undefined => {
  if (!Predicate.isObject(value)) return text(value);
  const parts = [
    'address',
    'city',
    'region',
    'postalCode',
    'countryCode',
  ].flatMap((key) => text(value[key]) ?? []);
  return parts.length > 0 ? parts.join(', ') : undefined;
};

/** "2019-01 – 2021-06", "2019-01 – present", "until 2021-06", or absent. */
export const period = (entry: Entry): string | undefined => {
  const start = text(entry['startDate']);
  const end = text(entry['endDate']);
  if (start) return `${start} – ${end ?? 'present'}`;
  return end ? `until ${end}` : undefined;
};
