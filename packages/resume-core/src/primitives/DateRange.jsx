import React from 'react';
import styled from 'styled-components';
import { formatDateRange } from '@jsonresume/utils/dates';

/**
 * The pure date-formatting function now lives in @jsonresume/utils (no React /
 * styled-components). It is re-exported here so existing imports
 * (`import { formatDateRange } from '@jsonresume/core'`) keep working.
 */
export { formatDateRange };

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
