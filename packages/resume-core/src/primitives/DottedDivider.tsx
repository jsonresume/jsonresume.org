import React from 'react';
import styled from 'styled-components';

/**
 * DottedDivider Component
 * Dotted horizontal rule for visual rhythm and section separation
 * Optimized to prevent moiré patterns in PDF generation
 *
 * Design constraints:
 * - Fixed dot size (2px) to avoid rendering artifacts
 * - Fixed spacing (4px) to prevent moiré in PDFs
 * - Uses semantic <hr> for accessibility
 *
 * @component
 * @example
 * // Standard dotted divider
 * <DottedDivider />
 *
 * @example
 * // Custom color
 * <DottedDivider color="#94a3b8" />
 *
 * @example
 * // Sparse dotted divider
 * <DottedDivider spacing="8px" />
 */

interface DottedDividerProps {
  /** Dot color (defaults to theme border color) */
  color?: string;
  /** Spacing between dots (defaults to 4px) */
  spacing?: string;
  /** Dot size (defaults to 2px) */
  dotSize?: string;
  /** Additional CSS class name */
  className?: string;
}

const StyledHr = styled.hr<DottedDividerProps>`
  border: none;
  border-top: ${(props) => props.dotSize || '2px'} dotted
    ${(props) =>
      props.color ||
      props.theme?.colors?.border ||
      'var(--resume-color-border, #e5e7eb)'};
  margin-top: ${(props) =>
    props.theme?.spacing?.tight || 'var(--resume-space-tight, 0.5rem)'};
  margin-bottom: ${(props) =>
    props.theme?.spacing?.tight || 'var(--resume-space-tight, 0.5rem)'};

  /* Override default border-top-width to use fixed spacing */
  ${(props) =>
    props.spacing &&
    `
    background-image: radial-gradient(
      circle,
      ${
        props.color ||
        props.theme?.colors?.border ||
        'var(--resume-color-border, #e5e7eb)'
      } ${props.dotSize || '2px'},
      transparent ${props.dotSize || '2px'}
    );
    background-size: ${props.spacing} 1px;
    background-repeat: repeat-x;
    background-position: center;
    border: none;
    height: 1px;
  `}

  @media print {
    /* Ensure dots render in all print modes */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Prevent page breaks */
    page-break-inside: avoid;
    /* Fixed dot rendering for PDF generation */
    border-top-width: ${(props) => props.dotSize || '2px'};
  }
`;

export function DottedDivider({
  color,
  spacing,
  dotSize,
  className,
  ...rest
}: DottedDividerProps) {
  return (
    <StyledHr
      role="separator"
      aria-orientation="horizontal"
      color={color}
      spacing={spacing}
      dotSize={dotSize}
      className={`resume-dotted-divider ${className || ''}`.trim()}
      {...rest}
    />
  );
}

export default DottedDivider;
