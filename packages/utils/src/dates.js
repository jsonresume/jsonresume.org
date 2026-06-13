/**
 * Pure date utilities for JSON Resume.
 *
 * Framework-free: no React, no styled-components. The styled DateRange /
 * RelativeDate components in @jsonresume/core import these functions back.
 *
 * @module @jsonresume/utils/dates
 */

/**
 * Date formatting utility with Intl.DateTimeFormat
 * Formats date ranges for work/education experience with full locale support
 *
 * @param {Object} options - DateRange options
 * @param {string|Date} options.startDate - Start date (ISO string or Date object)
 * @param {string|Date} [options.endDate] - End date (ISO string, Date object, or null/undefined for "Present")
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

  // A missing endDate (null OR undefined) means the role is ongoing: render
  // start + separator + "Present". Both cases flow through formatDate(endDate),
  // which returns the localized present label for a falsy value.
  const end = formatDate(endDate);

  return `${start} - ${end}`;
}

/**
 * Calculate relative time from a date
 * @param {string|Date} date - Date to calculate from
 * @param {boolean} [ago=true] - Include "ago" suffix
 * @returns {string} Relative time string
 *
 * @example
 * getRelativeTime('2020-01-01') // '6 years ago'
 */
export function getRelativeTime(date, ago = true) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  const suffix = ago ? ' ago' : '';

  if (diffYear > 0) {
    return `${diffYear} year${diffYear !== 1 ? 's' : ''}${suffix}`;
  }
  if (diffMonth > 0) {
    return `${diffMonth} month${diffMonth !== 1 ? 's' : ''}${suffix}`;
  }
  if (diffWeek > 0) {
    return `${diffWeek} week${diffWeek !== 1 ? 's' : ''}${suffix}`;
  }
  if (diffDay > 0) {
    return `${diffDay} day${diffDay !== 1 ? 's' : ''}${suffix}`;
  }
  if (diffHour > 0) {
    return `${diffHour} hour${diffHour !== 1 ? 's' : ''}${suffix}`;
  }
  if (diffMin > 0) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''}${suffix}`;
  }
  return 'just now';
}

/**
 * Calculate duration between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} [endDate=new Date()] - End date (defaults to now)
 * @returns {string} Duration string
 *
 * @example
 * getDuration('2020-01-01', '2022-07-01') // '2 years, 6 months'
 */
export function getDuration(startDate, endDate = new Date()) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end - start;
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  const years = diffYear;
  const months = diffMonth % 12;

  if (years > 0 && months > 0) {
    return `${years} year${years !== 1 ? 's' : ''}, ${months} month${
      months !== 1 ? 's' : ''
    }`;
  }
  if (years > 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  if (months > 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  return `${diffDay} day${diffDay !== 1 ? 's' : ''}`;
}

/**
 * Ensures all date fields in the resume are plain strings.
 * Some themes (e.g. macchiato) use moment.js or Handlebars helpers that
 * break when dates are Date objects instead of strings.
 *
 * @param {Object} resume - JSON Resume object
 * @returns {Object} A shallow copy with Date-valued date fields stringified
 */
export function normalizeDates(resume) {
  const dateFields = ['startDate', 'endDate', 'date', 'releaseDate'];
  const sections = [
    'work',
    'education',
    'volunteer',
    'projects',
    'awards',
    'publications',
  ];

  const normalized = { ...resume };
  for (const section of sections) {
    if (Array.isArray(normalized[section])) {
      normalized[section] = normalized[section].map((item) => {
        const copy = { ...item };
        for (const field of dateFields) {
          if (copy[field] instanceof Date) {
            copy[field] = copy[field].toISOString().split('T')[0];
          }
          // Non-Date, non-string values (plain objects, arrays, etc.) are left
          // untouched. Previously these were String()-coerced, which turned a
          // malformed object date into the literal "[object Object]" and joined
          // arrays into comma strings — mangling the value handed to the theme.
        }
        return copy;
      });
    }
  }
  return normalized;
}
