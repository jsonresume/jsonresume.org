import React from 'react';
/**
 * SkillPill
 * Badge-style skill display
 */
import styled from 'styled-components';

const Pill = styled.span`
  display: inline-block;
  padding: ${(props) => (props.$size === 'small' ? '4px 8px' : '6px 12px')};
  margin: 4px;
  background-color: ${(props) =>
    props.$variant === 'filled'
      ? 'var(--resume-color-accent)'
      : 'var(--resume-color-background)'};
  color: ${(props) =>
    props.$variant === 'filled' ? '#ffffff' : 'var(--resume-color-primary)'};
  border: ${(props) =>
    props.$variant === 'outlined'
      ? '1px solid var(--resume-color-border)'
      : 'none'};
  border-radius: ${(props) =>
    props.$rounded ? '999px' : 'var(--resume-radius-sm)'};
  font-size: ${(props) =>
    props.$size === 'small'
      ? 'var(--resume-size-small)'
      : 'var(--resume-size-body)'};
  font-weight: var(--resume-weight-medium);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    margin: 2px;
  }
`;

export function SkillPill({
  children,
  variant = 'outlined',
  size = 'medium',
  rounded = true,
  className,
}) {
  return (
    <Pill
      $variant={variant}
      $size={size}
      $rounded={rounded}
      className={className}
    >
      {children}
    </Pill>
  );
}

export default SkillPill;
