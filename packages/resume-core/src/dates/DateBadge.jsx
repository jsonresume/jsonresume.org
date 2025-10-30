import React from 'react';
/**
 * DateBadge
 * Badge-style date display with icon support
 */
import styled from 'styled-components';

const Badge = styled.time`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background-color: ${(props) =>
    props.$variant === 'filled'
      ? 'var(--resume-color-accent)'
      : 'var(--resume-color-background)'};
  color: ${(props) =>
    props.$variant === 'filled' ? 'white' : 'var(--resume-color-secondary)'};
  border: 1px solid
    ${(props) =>
      props.$variant === 'filled'
        ? 'var(--resume-color-accent)'
        : 'var(--resume-color-border)'};
  border-radius: var(--resume-radius-full);
  font-size: var(--resume-size-small);
  white-space: nowrap;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid var(--resume-color-border);
    background-color: ${(props) =>
      props.$variant === 'filled'
        ? 'var(--resume-color-accent)'
        : 'transparent'};
  }

  @media (max-width: 768px) {
    font-size: var(--resume-size-tiny);
    padding: 3px 10px;
  }
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

/**
 * @param {Object} props
 * @param {string} props.date - Date string to display
 * @param {string} [props.dateTime] - ISO datetime for semantic markup
 * @param {string|React.ReactNode} [props.icon] - Optional icon or emoji
 * @param {string} [props.variant='outlined'] - Style variant (outlined, filled)
 * @param {string} [props.className] - Additional CSS classes
 */
export function DateBadge({
  date,
  dateTime,
  icon,
  variant = 'outlined',
  className,
}) {
  return (
    <Badge dateTime={dateTime} $variant={variant} className={className}>
      {icon && <Icon>{icon}</Icon>}
      {date}
    </Badge>
  );
}

export default DateBadge;
