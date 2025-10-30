import React from 'react';
import styled from 'styled-components';

/**
 * AccentTopRule Component
 * Short accent rule positioned above sections for visual hierarchy
 * Creates visual separation and draws attention to important sections
 *
 * Design constraints:
 * - Length: 25-40% of text width (optimal visual balance)
 * - Thickness: 2-3pt for prominence without overwhelming
 * - Positioned with margin-bottom for proper spacing
 * - Can be aligned left, center, or right
 *
 * @component
 * @example
 * // Standard top rule above section
 * <AccentTopRule />
 * <h2>Work Experience</h2>
 *
 * @example
 * // Centered rule with custom width
 * <AccentTopRule width="35%" align="center" />
 *
 * @example
 * // Custom color and thickness
 * <AccentTopRule color="#8b5cf6" thickness="3pt" />
 */

interface AccentTopRuleProps {
  /** Rule width as percentage or CSS length (defaults to 30%) */
  width?: string;
  /** Alignment: left, center, or right (defaults to left) */
  align?: 'left' | 'center' | 'right';
  /** Rule thickness (defaults to 2.5pt) */
  thickness?: string;
  /** Rule color (defaults to theme accent color) */
  color?: string;
  /** Additional CSS class name */
  className?: string;
}

const StyledRule = styled.div<AccentTopRuleProps>`
  width: ${(props) => props.width || '30%'};
  max-width: 40%; /* Design constraint: max 40% */
  min-width: 25%; /* Design constraint: min 25% */
  height: ${(props) => props.thickness || '2.5pt'};
  background-color: ${(props) =>
    props.color ||
    props.theme?.colors?.accent ||
    'var(--resume-color-accent, #2563eb)'};
  margin-bottom: ${(props) =>
    props.theme?.spacing?.tight || 'var(--resume-space-tight, 0.5rem)'};
  margin-left: ${(props) => {
    if (props.align === 'center') return 'auto';
    if (props.align === 'right') return 'auto';
    return '0';
  }};
  margin-right: ${(props) => {
    if (props.align === 'center') return 'auto';
    if (props.align === 'right') return '0';
    return 'auto';
  }};

  @media print {
    /* Ensure color renders in print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Prevent page breaks */
    page-break-inside: avoid;
    /* Ensure minimum thickness for print visibility */
    min-height: 2pt;
  }

  @media screen and (max-width: 768px) {
    /* Increase width slightly on mobile for better visibility */
    width: ${(props) => (props.width ? `calc(${props.width} * 1.2)` : '36%')};
  }
`;

export function AccentTopRule({
  width,
  align = 'left',
  thickness,
  color,
  className,
  ...rest
}: AccentTopRuleProps) {
  return (
    <StyledRule
      role="presentation"
      aria-hidden="true"
      width={width}
      align={align}
      thickness={thickness}
      color={color}
      className={`resume-accent-top-rule ${className || ''}`.trim()}
      {...rest}
    />
  );
}

export default AccentTopRule;
