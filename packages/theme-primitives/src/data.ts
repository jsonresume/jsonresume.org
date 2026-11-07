import { Option, Predicate, Schema } from 'effect';
import { formatLocation, safeUrl } from '@jsonresume/utils';
import type { Data } from './types.js';

const ObjectData = Schema.Record(Schema.String, Schema.Unknown);
export const record = (value: unknown): Data =>
  Option.getOrElse(Schema.decodeUnknownOption(ObjectData)(value), () => ({}));
export const text = (value: unknown): string =>
  Predicate.isString(value) ? value.trim() : '';
export const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(text).filter(Boolean) : [];
export const records = (value: unknown): Data[] =>
  Array.isArray(value)
    ? value.map(record).filter((item) => Object.keys(item).length > 0)
    : [];
export const join = (...values: unknown[]) =>
  values.map(text).filter(Boolean).join(' · ');
export const link = (value: unknown) => {
  const candidate = safeUrl(text(value)) ?? '';
  return /^(https?:\/\/|mailto:|tel:)/i.test(candidate) ? candidate : '';
};
export const location = (value: unknown): string => {
  if (Predicate.isString(value)) return value;
  const item = record(value);
  return formatLocation({
    city: text(item.city),
    region: text(item.region),
    countryCode: text(item.countryCode),
  });
};
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        char
      ] ?? char)
  );

export function paragraphs(...values: unknown[]): string[] {
  return [...new Set(values.map(text).filter(Boolean))]
    .flatMap((value) => value.split(/\n\s*\n/))
    .filter(Boolean);
}
