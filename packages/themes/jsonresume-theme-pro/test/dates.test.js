import { describe, expect, it } from 'vitest';
import { parseDate, rangeHtml, singleDateHtml } from '../src/dates.js';
import { LABELS_EN } from '../src/settings.js';

const ctx = () => ({ labels: LABELS_EN, diagnostics: [] });
const plain = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

describe('date policy', () => {
  it.each([
    ['2021', '2021'],
    ['2021-05', 'May 2021'],
    ['2021-05-09', '9 May 2021'],
    ['2026-09', 'Sep 2026'],
    ['2021-05-09T23:30:00-10:00', '9 May 2021'],
  ])('single %s -> %s, keeping precision', (input, expected) => {
    expect(plain(singleDateHtml(input, ctx()))).toBe(expected);
  });

  it('formats ranges with an en dash', () => {
    expect(plain(rangeHtml('2021-05', '2024-09', ctx()))).toBe(
      'May 2021 – Sep 2024'
    );
  });

  it('uses Present only under the ongoing convention or an explicit marker', () => {
    expect(
      plain(rangeHtml('2021-05', null, ctx(), { ongoingWhenOpen: true }))
    ).toBe('May 2021 – Present');
    expect(plain(rangeHtml('2021-05', 'present', ctx()))).toBe(
      'May 2021 – Present'
    );
    expect(plain(rangeHtml('2021-05', undefined, ctx()))).toBe('From May 2021');
    expect(plain(rangeHtml(null, '2024-09', ctx()))).toBe('Until Sep 2024');
  });

  it('omits the element when neither endpoint is supplied', () => {
    expect(rangeHtml(undefined, '', ctx())).toBeNull();
    expect(rangeHtml('  ', null, ctx(), { ongoingWhenOpen: true })).toBeNull();
    expect(singleDateHtml('', ctx())).toBeNull();
  });

  it('collapses identical endpoints', () => {
    expect(plain(rangeHtml('2020', '2020', ctx()))).toBe('2020');
  });

  it('shows malformed dates as supplied, with a diagnostic', () => {
    const c = ctx();
    expect(plain(rangeHtml('Spring 2019', '2021-13', c))).toBe(
      'Spring 2019 – 2021-13'
    );
    expect(c.diagnostics).toHaveLength(2);
    expect(parseDate('2015-02-29')).toEqual({ raw: '2015-02-29' });
    expect(parseDate('2016-02-29')).toEqual({ year: 2016, month: 2, day: 29 });
  });

  it('adds machine-readable time only for valid dates', () => {
    expect(singleDateHtml('2021-05', ctx())).toContain(
      '<time class="pro-nowrap" datetime="2021-05">'
    );
    expect(singleDateHtml('Spring 2019', ctx())).not.toContain('<time');
  });

  it('is independent of the server timezone', () => {
    const tz = process.env.TZ;
    process.env.TZ = 'Pacific/Kiritimati';
    try {
      expect(plain(singleDateHtml('2021-01-01', ctx()))).toBe('1 Jan 2021');
    } finally {
      process.env.TZ = tz;
    }
  });
});
