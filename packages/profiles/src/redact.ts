import { Predicate } from 'effect';

/** What an account can keep off its public page: contact details. */
export const HIDEABLE = ['email', 'phone', 'address'] as const;
export type Hideable = (typeof HIDEABLE)[number];

const without = (o: Record<string, unknown>, keys: ReadonlyArray<string>) =>
  Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));

/**
 * The resume as the public sees it: basics.email, basics.phone, or the
 * street address and postcode (the town stays) removed, as the owner chose.
 * Their own copy, in the editor and their API, keeps everything.
 */
export const redact = (resume: unknown, hidden: ReadonlyArray<string>) => {
  if (hidden.length === 0 || !Predicate.isObject(resume)) return resume;
  const basics = resume['basics'];
  if (!Predicate.isObject(basics)) return resume;
  const location = basics['location'];
  const keep = without(
    basics,
    hidden.filter((h) => h === 'email' || h === 'phone')
  );
  if (hidden.includes('address') && Predicate.isObject(location))
    keep['location'] = without(location, ['address', 'postalCode']);
  return { ...resume, basics: keep };
};
