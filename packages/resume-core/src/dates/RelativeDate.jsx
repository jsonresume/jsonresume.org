import React from 'react';
/**
 * RelativeDate
 * Display relative date (e.g., "2 years ago", "3 months")
 */
import styled from 'styled-components';

const Container = styled.time`
  font-size: ${(props) => props.$size || 'var(--resume-size-small)'};
  color: ${(props) => props.$color || 'var(--resume-color-tertiary)'};
  white-space: nowrap;
`;

/**
 * Calculate relative time from a date
 * @param {string|Date} date - Date to calculate from
 * @param {boolean} ago - Include "ago" suffix
 * @returns {string} Relative time string
 */
function getRelativeTime(date, ago = true) {
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
 * @param {string|Date} endDate - End date (defaults to now)
 * @returns {string} Duration string
 */
function getDuration(startDate, endDate = new Date()) {
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
