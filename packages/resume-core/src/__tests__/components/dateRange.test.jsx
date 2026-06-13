import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHtml } from './renderHtml.jsx';
import { DateRange, formatDateRange } from '../../index.js';

describe('formatDateRange (pure)', () => {
  it('returns empty string when startDate is missing', () => {
    expect(formatDateRange({ startDate: '' })).toBe('');
    expect(formatDateRange({ startDate: null })).toBe('');
    expect(formatDateRange({ startDate: undefined })).toBe('');
  });

  it('formats a single date when endDate is undefined (no range)', () => {
    // undefined endDate => single date, NOT a range with "Present"
    const out = formatDateRange({ startDate: '2020-01-15' });
    expect(out).toContain('2020');
    expect(out).not.toContain('-');
    expect(out).not.toContain('Present');
  });

  it('shows "Present" for an ongoing role when endDate is null', () => {
    const out = formatDateRange({ startDate: '2020-01-15', endDate: null });
    expect(out).toContain('2020');
    expect(out).toContain('Present');
    expect(out).toContain(' - ');
  });

  it('formats a closed range with start and end', () => {
    const out = formatDateRange({
      startDate: '2018-06-01',
      endDate: '2020-03-01',
    });
    expect(out).toContain('2018');
    expect(out).toContain('2020');
    expect(out).toContain(' - ');
  });

  it('supports long month format', () => {
    const out = formatDateRange({ startDate: '2020-01-15', format: 'long' });
    expect(out).toContain('January');
  });

  it('supports numeric month format', () => {
    const out = formatDateRange({ startDate: '2020-01-15', format: 'numeric' });
    expect(out).toMatch(/01\/2020|01\s*2020/);
  });

  it('localizes the present label (fr-FR => Présent)', () => {
    const out = formatDateRange({
      startDate: '2020-01-15',
      endDate: null,
      locale: 'fr-FR',
    });
    expect(out).toContain('Présent');
  });

  it('falls back to the base-language present label (de => Heute)', () => {
    const out = formatDateRange({
      startDate: '2020-01-15',
      endDate: null,
      locale: 'de',
    });
    expect(out).toContain('Heute');
  });

  it('honours an explicit presentLabel override', () => {
    const out = formatDateRange({
      startDate: '2020-01-15',
      endDate: null,
      presentLabel: 'Now',
    });
    expect(out).toContain('Now');
  });

  it('returns an invalid date string as-is rather than NaN', () => {
    const out = formatDateRange({ startDate: 'not-a-date' });
    expect(out).toBe('not-a-date');
  });

  it('accepts Date objects as well as strings', () => {
    const out = formatDateRange({ startDate: new Date('2021-05-01') });
    expect(out).toContain('2021');
  });
});

describe('DateRange (component)', () => {
  it('renders formatted output in a span', () => {
    const { html } = renderHtml(
      <DateRange startDate="2020-01-15" endDate={null} />
    );
    expect(html).toContain('<span');
    expect(html).toContain('Present');
    expect(html).toContain('resume-date-range');
  });

  it('renders nothing when startDate is missing', () => {
    const { html } = renderHtml(<DateRange startDate="" />);
    expect(html).toBe('');
  });

  it('renders a closed range', () => {
    const { html } = renderHtml(
      <DateRange startDate="2018-06" endDate="2020-03" />
    );
    expect(html).toContain('2018');
    expect(html).toContain('2020');
  });

  it('merges a custom className', () => {
    const { html } = renderHtml(
      <DateRange startDate="2020-01" className="dates" />
    );
    expect(html).toContain('resume-date-range');
    expect(html).toContain('dates');
  });
});
