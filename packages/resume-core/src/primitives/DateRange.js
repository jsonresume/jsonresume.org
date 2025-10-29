/**
 * DateRange Primitive
 * Formats date ranges for work/education experience
 *
 * @param {Object} options - DateRange options
 * @param {string|Date} options.startDate - Start date (ISO string or Date object)
 * @param {string|Date} [options.endDate] - End date (ISO string, Date object, or null for "Present")
 * @param {string} [options.format] - Format style: 'short' (default), 'long', 'numeric'
 * @returns {string} Formatted date range
 *
 * @example
 * DateRange({ startDate: '2020-01-15', endDate: null })
 * // 'Jan 2020 - Present'
 *
 * DateRange({ startDate: '2018-06', endDate: '2020-03', format: 'long' })
 * // 'June 2018 - March 2020'
 */
export function DateRange({ startDate, endDate, format = 'short' }) {
  if (!startDate) return '';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';

    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

    if (isNaN(date.getTime())) return dateStr; // Invalid date, return as-is

    const monthFormats = {
      short: { month: 'short' },
      long: { month: 'long' },
      numeric: { month: '2-digit' },
    };

    const options = {
      ...monthFormats[format],
      year: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  };

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  return `${start} - ${end}`;
}

export default DateRange;
