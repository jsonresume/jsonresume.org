import React from 'react';
import styled from 'styled-components';

/**
 * AccentSidebarStripe Component
 * Narrow decorative accent stripe along the far left edge
 * Positioned absolutely to avoid interfering with ATS parsing
 *
 * Design constraints:
 * - Maximum width: 6mm (≈22.68px) to stay within safe margins
 * - No text content allowed (decorative only)
 * - Absolute positioning to avoid layout disruption
 * - ATS-safe: parsers ignore positioned elements
 *
 * @component
 * @example
 * // Minimal accent stripe
 * <AccentSidebarStripe />
 *
 * @example
 * // Custom width and color
 * <AccentSidebarStripe width="4mm" color="#2563eb" />
 *
 * @example
 * // Right-aligned stripe
 * <AccentSidebarStripe position="right" />
 */

interface AccentSidebarStripeProps {
  /** Stripe width (max 6mm, defaults to 4mm) */
  width?: string;
  /** Stripe color (defaults to theme accent color) */
  color?: string;
  /** Position: left or right edge (defaults to left) */
  position?: 'left' | 'right';
  /** Height (defaults to 100%) */
  height?: string;
  /** Top offset (defaults to 0) */
  top?: string;
  /** Additional CSS class name */
  className?: string;
}

const StyledStripe = styled.div<AccentSidebarStripeProps>`
  position: absolute;
  ${(props) => (props.position === 'right' ? 'right: 0;' : 'left: 0;')}
  top: ${(props) => props.top || '0'};
  width: ${(props) => props.width || '4mm'};
  max-width: 6mm; /* ATS-safe maximum */
  height: ${(props) => props.height || '100%'};
  background-color: ${(props) =>
    props.color ||
    props.theme?.colors?.accent ||
    'var(--resume-color-accent, #2563eb)'};
  pointer-events: none; /* Prevent interaction */

  @media print {
    /* Ensure color renders in print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Prevent page breaks inside stripe */
    page-break-inside: avoid;
  }

  @media screen and (max-width: 768px) {
    /* Reduce width on mobile */
    width: ${(props) => (props.width ? `calc(${props.width} * 0.75)` : '3mm')};
  }
`;

export function AccentSidebarStripe({
  width,
  color,
  position = 'left',
  height,
  top,
  className,
  ...rest
}: AccentSidebarStripeProps) {
  return (
    <StyledStripe
      role="presentation"
      aria-hidden="true"
      width={width}
      color={color}
      position={position}
      height={height}
      top={top}
      className={`resume-accent-stripe ${className || ''}`.trim()}
      {...rest}
    />
  );
}

export default AccentSidebarStripe;
