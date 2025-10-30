import React from 'react';
/**
 * DividerVariants
 * Various divider styles (dotted, dashed, gradient, decorative)
 */
import styled from 'styled-components';

const Divider = styled.hr`
  border: none;
  margin: ${(props) => props.$spacing || 'var(--resume-space-item) 0'};
  height: ${(props) => {
    if (props.$variant === 'thick') return '3px';
    if (props.$variant === 'gradient') return '2px';
    return '1px';
  }};
  background: ${(props) => {
    if (props.$variant === 'gradient') {
      return `linear-gradient(
        to right,
        transparent,
        ${props.$color || 'var(--resume-color-border)'},
        transparent
      )`;
    }
    if (props.$variant === 'dotted') {
      return `repeating-linear-gradient(
        to right,
        ${props.$color || 'var(--resume-color-border)'} 0,
        ${props.$color || 'var(--resume-color-border)'} 4px,
        transparent 4px,
        transparent 8px
      )`;
    }
    if (props.$variant === 'dashed') {
      return `repeating-linear-gradient(
        to right,
        ${props.$color || 'var(--resume-color-border)'} 0,
        ${props.$color || 'var(--resume-color-border)'} 12px,
        transparent 12px,
        transparent 20px
      )`;
    }
    return props.$color || 'var(--resume-color-border)';
  }};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    background: ${(props) => props.$color || 'var(--resume-color-border)'};
  }
`;

const DecorativeDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${(props) => props.$spacing || 'var(--resume-space-item) 0'};
  gap: var(--resume-space-tight);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${(props) =>
      props.$color || 'var(--resume-color-border)'};
  }

  @media print {
    &::before,
    &::after {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

const Icon = styled.span`
  color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  font-size: 16px;
`;

/**
 * @param {Object} props
 * @param {string} [props.variant='solid'] - Divider style (solid, dotted, dashed, gradient, thick, decorative)
 * @param {string} [props.color] - Custom color
 * @param {string} [props.spacing] - Custom margin
 * @param {string|React.ReactNode} [props.icon] - Icon for decorative variant
 * @param {string} [props.className] - Additional CSS classes
 */
export function DividerVariants({
  variant = 'solid',
  color,
  spacing,
  icon = '◆',
  className,
}) {
  if (variant === 'decorative') {
    return (
      <DecorativeDivider
        $color={color}
        $spacing={spacing}
        className={className}
      >
        <Icon $color={color}>{icon}</Icon>
      </DecorativeDivider>
    );
  }

  return (
    <Divider
      $variant={variant}
      $color={color}
      $spacing={spacing}
      className={className}
    />
  );
}

export default DividerVariants;
