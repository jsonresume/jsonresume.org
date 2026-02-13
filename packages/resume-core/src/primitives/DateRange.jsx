import React from 'react';
import styled from 'styled-components';

/**
 * Date formatting utility with Intl.DateTimeFormat
 * Formats date ranges for work/education experience with full locale support
 *
 * @param {Object} options - DateRange options
 * @param {string|Date} options.startDate - Start date (ISO string or Date object)
 * @param {string|Date} [options.endDate] - End date (ISO string, Date object, or null for "Present")
 * @param {string} [options.format='short'] - Format style: 'short' (default), 'long', 'numeric'
 * @param {string} [options.locale='en-US'] - BCP 47 locale (e.g., 'en-US', 'fr-FR', 'ar-SA')
 * @param {string} [options.numberingSystem] - Numbering system (e.g., 'arab', 'latn', 'hanidec')
 * @param {string} [options.presentLabel] - Custom label for present/ongoing (defaults to localized)
 * @returns {string} Formatted date range
 *
 * @example
 * formatDateRange({ startDate: '2020-01-15', endDate: null })
 * // 'Jan 2020 - Present'
 *
 * @example
 * formatDateRange({
 *   startDate: '2020-01-15',
 *   locale: 'fr-FR',
 *   format: 'long'
 * })
 * // 'janvier 2020 - Présent'
 *
 * @example
 * formatDateRange({
 *   startDate: '2020-01-15',
 *   locale: 'ar-SA',
 *   numberingSystem: 'arab'
 * })
 * // With Arabic numerals
 */
export function formatDateRange({
  startDate,
  endDate,
  format = 'short',
  locale = 'en-US',
  numberingSystem,
  presentLabel,
}) {
  if (!startDate) return '';

  // Determine "Present" label based on locale
  const getPresentLabel = () => {
    if (presentLabel) return presentLabel;

    const labels = {
      en: 'Present',
      'en-US': 'Present',
      'en-GB': 'Present',
      fr: 'Présent',
      'fr-FR': 'Présent',
      es: 'Presente',
      'es-ES': 'Presente',
      de: 'Heute',
      'de-DE': 'Heute',
      it: 'Presente',
      'it-IT': 'Presente',
      pt: 'Presente',
      'pt-BR': 'Presente',
      ja: '現在',
      'ja-JP': '現在',
      zh: '至今',
      'zh-CN': '至今',
      'zh-TW': '至今',
      ko: '현재',
      'ko-KR': '현재',
      ar: 'حاضر',
      'ar-SA': 'حاضر',
    };

    return labels[locale] || labels[locale.split('-')[0]] || 'Present';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return getPresentLabel();

    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

    if (isNaN(date.getTime())) return dateStr; // Invalid date, return as-is

    // Configure Intl.DateTimeFormat based on format style
    const monthFormats = {
      short: { month: 'short' },
      long: { month: 'long' },
      numeric: { month: '2-digit' },
    };

    const options = {
      ...monthFormats[format],
      year: 'numeric',
    };

    // Add numbering system if provided
    if (numberingSystem) {
      options.numberingSystem = numberingSystem;
    }

    // Use Intl.DateTimeFormat for proper locale support
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  };

  const start = formatDate(startDate);

  // undefined = single date (no range), null = ongoing (show "Present")
  if (endDate === undefined) return start;

  const end = formatDate(endDate);

  return `${start} - ${end}`;
}

/**
 * DateRange Component
 * Styled date range display for consistent formatting with full i18n support
 *
 * @component
 * @example
 * <DateRange startDate="2020-01-15" endDate={null} />
 *
 * @example
 * <DateRange
 *   startDate="2018-06"
 *   endDate="2020-03"
 *   format="long"
 *   locale="fr-FR"
 * />
 *
 * @example
 * // Arabic with Arabic-Indic numerals
 * <DateRange
 *   startDate="2020-01-15"
 *   locale="ar-SA"
 *   numberingSystem="arab"
 * />
 */

const StyledDateRange = styled.span`
  font-size: ${(props) =>
    props.theme?.typography?.small || 'var(--resume-size-small, 10pt)'};
  color: ${(props) =>
    props.theme?.colors?.tertiary || 'var(--resume-color-tertiary, #666)'};
  white-space: nowrap;
`;

export function DateRange({
  startDate,
  endDate,
  format = 'short',
  locale = 'en-US',
  numberingSystem,
  presentLabel,
  className,
  ...rest
}) {
  const formatted = formatDateRange({
    startDate,
    endDate,
    format,
    locale,
    numberingSystem,
    presentLabel,
  });

  if (!formatted) return null;

  return (
    <StyledDateRange
      className={`resume-date-range ${className || ''}`.trim()}
      {...rest}
    >
      {formatted}
    </StyledDateRange>
  );
}

export default DateRange;
