import { Predicate } from 'effect';

/**
 * Characters XML 1.0 forbids: control codes other than tab and line breaks,
 * and U+FFFE/U+FFFF. Text pasted from a PDF often carries them, and one in
 * a document part makes Word refuse the whole file.
 */
// eslint-disable-next-line no-control-regex
const FORBIDDEN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g;

/** A vertical tab or form feed separated words; the rest are dropped. */
const replacement = (c: string) => (c === '\v' || c === '\f' ? ' ' : '');

/** A value with every string in it safe to write into a document's XML. */
export const xmlSafe = (value: unknown): unknown => {
  if (Predicate.isString(value)) return value.replace(FORBIDDEN, replacement);
  if (Array.isArray(value)) return value.map(xmlSafe);
  if (Predicate.isObject(value))
    return Object.fromEntries(
      Object.entries(value).map(([key, field]) => [key, xmlSafe(field)])
    );
  return value;
};
