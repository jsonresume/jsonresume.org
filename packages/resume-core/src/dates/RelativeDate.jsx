import React from 'react';
/**
 * RelativeDate
 * Display relative date (e.g., "2 years ago", "3 months")
 *
 * The pure getRelativeTime / getDuration helpers now live in @jsonresume/utils
 * (framework-free); this component imports them back.
 */
import styled from 'styled-components';
import { getRelativeTime, getDuration } from '@jsonresume/utils/dates';

const Container = styled.time`
  font-size: ${(props) => props.$size || 'var(--resume-size-small)'};
  color: ${(props) => props.$color || 'var(--resume-color-tertiary)'};
  white-space: nowrap;
`;

/**
 * @param {Object} props
 * @param {string|Date} props.date - Date to display relatively
 * @param {string|Date} [props.startDate] - For duration calculation
 * @param {string|Date} [props.endDate] - For duration calculation
 * @param {boolean} [props.ago=true] - Include "ago" suffix
 * @param {string} [props.size] - Font size
 * @param {string} [props.color] - Text color
 * @param {string} [props.className] - Additional CSS classes
 */
export function RelativeDate({
  date,
  startDate,
  endDate,
  ago = true,
  size,
  color,
  className,
}) {
  const displayText = startDate
    ? getDuration(startDate, endDate || new Date())
    : getRelativeTime(date, ago);

  return (
    <Container
      dateTime={typeof date === 'string' ? date : date?.toISOString()}
      $size={size}
      $color={color}
      className={className}
    >
      {displayText}
    </Container>
  );
}

export default RelativeDate;
