import React from 'react';
import styled from 'styled-components';

/**
 * KeylineDivider Component
 * Low-contrast horizontal rule with adjustable inset
 * Optimized for ATS parsing and print quality
 *
 * Design constraints:
 * - ≥0.3pt stroke weight to prevent disappearing in print
 * - Supports horizontal inset for visual hierarchy
 * - Uses semantic <hr> for accessibility
 *
 * @component
 * @example
 * // Full-width keyline
 * <KeylineDivider />
 *
 * @example
 * // Inset keyline for nested sections
 * <KeylineDivider inset="1rem" />
 *
 * @example
 * // Custom color
 * <KeylineDivider color="#e5e7eb" />
 */

interface KeylineDividerProps {
  /** Horizontal inset from edges (CSS length value) */
  inset?: string;
  /** Border color (defaults to theme border color) */
  color?: string;
  /** Additional CSS class name */
  className?: string;
}

const StyledHr = styled.hr<KeylineDividerProps>`
  border: none;
  border-top: 0.5pt solid
    ${(props) =>
      props.color ||
      props.theme?.colors?.border ||
      'var(--resume-color-border, #e5e7eb)'};
  margin-left: ${(props) => props.inset || '0'};
  margin-right: ${(props) => props.inset || '0'};
  margin-top: ${(props) =>
    props.theme?.spacing?.tight || 'var(--resume-space-tight, 0.5rem)'};
  margin-bottom: ${(props) =>
    props.theme?.spacing?.tight || 'var(--resume-space-tight, 0.5rem)'};

  @media print {
    /* Ensure minimum stroke weight for print visibility */
    border-top-width: 0.3pt;
    /* Prevent page breaks */
    page-break-inside: avoid;
    /* Ensure border renders in all print modes */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function KeylineDivider({
  inset,
  color,
  className,
  ...rest
}: KeylineDividerProps) {
  return (
    <StyledHr
      role="separator"
      aria-orientation="horizontal"
      inset={inset}
      color={color}
      className={`resume-keyline-divider ${className || ''}`.trim()}
      {...rest}
    />
  );
}

export default KeylineDivider;
