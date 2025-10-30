import React from 'react';
/**
 * CertificationBadge
 * Badge-style certification display with icon support
 */
import styled from 'styled-components';

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: ${(props) =>
    props.$variant === 'filled'
      ? 'var(--resume-color-accent)'
      : 'var(--resume-color-background)'};
  color: ${(props) =>
    props.$variant === 'filled' ? 'white' : 'var(--resume-color-primary)'};
  border: 1px solid
    ${(props) =>
      props.$variant === 'filled'
        ? 'var(--resume-color-accent)'
        : 'var(--resume-color-border)'};
  border-radius: var(--resume-radius-full);
  font-size: var(--resume-size-small);
  font-weight: var(--resume-weight-medium);
  break-inside: avoid;

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
    padding: 6px 12px;
  }
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const Text = styled.span`
  white-space: nowrap;
`;

const Date = styled.span`
  opacity: 0.8;
  font-size: var(--resume-size-tiny);
  font-weight: var(--resume-weight-normal);
`;

/**
 * @param {Object} props
 * @param {string} props.name - Certification name
 * @param {string} [props.date] - Certification date
 * @param {string|React.ReactNode} [props.icon] - Icon or emoji
 * @param {string} [props.variant='outlined'] - Style variant (outlined, filled)
 * @param {string} [props.className] - Additional CSS classes
 */
export function CertificationBadge({
  name,
  date,
  icon,
  variant = 'outlined',
  className,
}) {
  return (
    <Badge $variant={variant} className={className}>
      {icon && <Icon>{icon}</Icon>}
      <Text>{name}</Text>
      {date && <Date>({date})</Date>}
    </Badge>
  );
}

export default CertificationBadge;
