import styled from 'styled-components';

/**
 * Date formatting utility
 * Formats date ranges for work/education experience
 *
 * @param {Object} options - DateRange options
 * @param {string|Date} options.startDate - Start date (ISO string or Date object)
 * @param {string|Date} [options.endDate] - End date (ISO string, Date object, or null for "Present")
 * @param {string} [options.format] - Format style: 'short' (default), 'long', 'numeric'
 * @returns {string} Formatted date range
 *
 * @example
 * formatDateRange({ startDate: '2020-01-15', endDate: null })
 * // 'Jan 2020 - Present'
 */
export function formatDateRange({ startDate, endDate, format = 'short' }) {
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

/**
 * DateRange Component
 * Styled date range display for consistent formatting
 *
 * @component
 * @example
 * <DateRange startDate="2020-01-15" endDate={null} />
 * <DateRange startDate="2018-06" endDate="2020-03" format="long" />
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
  className,
  ...rest
}) {
  const formatted = formatDateRange({ startDate, endDate, format });

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
