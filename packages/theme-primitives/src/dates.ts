import { formatDateRange } from '@jsonresume/utils';
import { Option, Predicate } from 'effect';
import { text } from './data.js';
import type { Data } from './types.js';

const validDate = (value: string) =>
  /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value);

export function date(value: unknown, locale: string): string {
  const raw = Predicate.isDate(value)
    ? Option.getOrElse(
        Option.liftThrowable(() => value.toISOString().slice(0, 10))(),
        () => ''
      )
    : text(value);
  if (!raw || !validDate(raw)) return raw;
  if (raw.length === 4) return raw;
  return formatDateRange({ startDate: raw, locale });
}

export function period(
  item: Data,
  locale: string,
  present: string,
  ongoing: boolean
): string {
  const start = text(item.startDate);
  const end = text(item.endDate);
  if (!start && !end) return '';
  const last = /^(present|current|now)$/i.test(end)
    ? present
    : date(end, locale);
  return [date(start, locale), last || (ongoing && start ? present : '')]
    .filter(Boolean)
    .join(' – ');
}
