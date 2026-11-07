const MONTHS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

const ISO = /^[12]\d{3}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;

const pad = (n: number) => String(n).padStart(2, '0');

const monthOf = (word: string) => {
  const index = MONTHS.indexOf(word.slice(0, 3).toLowerCase());
  return index < 0 ? undefined : index + 1;
};

const validYear = (y: number) => y >= 1000 && y <= 2999;

/**
 * A date as JSON Resume writes it (2024-06-30, 2024-06 or 2024), from the
 * ways resumes and LinkedIn write them: "Jan 2020", "January 2020",
 * "01/2020", "2020/01", "15 Jan 2020", "2020". Undefined when it isn't one
 * ("Present", "Summer"), so the field is left out.
 */
export const isoDate = (raw: string): string | undefined => {
  const text = raw.trim().replace(/\s+/g, ' ');
  if (ISO.test(text)) return text;
  // 15 Jan 2020, Jan 15 2020, January 15, 2020
  const dayFirst = /^(\d{1,2}) ([a-z]+)\.?,? (\d{4})$/i.exec(text);
  const dayAfter = /^([a-z]+)\.? (\d{1,2}),? (\d{4})$/i.exec(text);
  const full = dayFirst
    ? { d: dayFirst[1], m: dayFirst[2], y: dayFirst[3] }
    : dayAfter
    ? { d: dayAfter[2], m: dayAfter[1], y: dayAfter[3] }
    : undefined;
  if (full) {
    const month = monthOf(full.m ?? '');
    const day = Number(full.d);
    const year = Number(full.y);
    if (month && validYear(year) && day >= 1 && day <= 31)
      return `${year}-${pad(month)}-${pad(day)}`;
  }
  const named = /^([a-z]+)\.?,? (\d{4})$/i.exec(text);
  if (named) {
    const month = monthOf(named[1] ?? '');
    const year = Number(named[2]);
    if (month && validYear(year)) return `${year}-${pad(month)}`;
  }
  const numeric =
    /^(\d{1,2})[/.-](\d{4})$/.exec(text) ?? /^(\d{4})[/.](\d{1,2})$/.exec(text);
  if (numeric) {
    const [a = '', b = ''] = [numeric[1], numeric[2]];
    const [month, year] =
      a.length === 4 ? [Number(b), Number(a)] : [Number(a), Number(b)];
    if (month >= 1 && month <= 12 && validYear(year))
      return `${year}-${pad(month)}`;
  }
  return undefined;
};
