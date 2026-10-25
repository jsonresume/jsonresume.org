import type { TimelineItem } from './timeline';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** "May 2021" from 2021-05 or 2021-05-01; "2021" from 2021. */
export const monthYear = (iso: string) => {
  const [year, month] = iso.split('-');
  const name = month ? MONTHS[Number(month) - 1] : undefined;
  return name ? `${name} ${year}` : year ?? iso;
};

const months = (iso: string) => {
  const [year = '0', month = '1'] = iso.split('-');
  return Number(year) * 12 + Number(month) - 1;
};

/** "2 yrs 3 mos", "8 mos", from a start to an end (inclusive of both months). */
export const duration = (start: string, end: string) => {
  const total = Math.max(1, months(end) - months(start) + 1);
  const years = Math.floor(total / 12);
  const rest = total % 12;
  return [
    years ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : '',
    rest ? `${rest} ${rest === 1 ? 'mo' : 'mos'}` : '',
  ]
    .filter(Boolean)
    .join(' ');
};

/**
 * When an item happened, as people write it: "May 2021 – present · 4 yrs
 * 6 mos", "2019 – 2021", or one date for an award. `today` is YYYY-MM.
 */
export const when = (item: TimelineItem, today: string) => {
  if (!item.start) return item.end ? `Until ${monthYear(item.end)}` : '';
  if (!item.current && !item.end) return monthYear(item.start);
  const end = item.end ?? today;
  const range = `${monthYear(item.start)} – ${
    item.end ? monthYear(item.end) : 'present'
  }`;
  // Whole years say nothing about months: 2019 – 2021 stays as it is.
  return item.start.length > 4 && end.length > 4
    ? `${range} · ${duration(item.start, end)}`
    : range;
};
