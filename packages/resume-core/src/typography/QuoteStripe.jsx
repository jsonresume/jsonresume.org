import React from 'react';
import styled from 'styled-components';

/**
 * QuoteStripe
 * Single-line pull-quote with left accent rule.
 * Adds padding to prevent curly quote clipping and provides visual emphasis.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Quote content to render
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.accentColor] - Color of the left border accent
 * @param {string} [props.borderWidth='3px'] - Width of the left border
 * @param {string} [props.fontStyle='italic'] - Font style (italic, normal)
 * @param {string} [props.paddingLeft='16px'] - Left padding (inside accent rule)
 *
 * @example
 * ```jsx
 * <QuoteStripe>
 *   "Exceptional problem solver with keen attention to detail"
 * </QuoteStripe>
 *
 * <QuoteStripe accentColor="#2563eb" borderWidth="4px">
 *   Leadership excellence in cross-functional teams
 * </QuoteStripe>
 * ```
 */

const StyledQuoteStripe = styled.blockquote`
  margin: 0 0 var(--resume-space-item) 0;
  padding: 2px 0 2px ${(props) => props.$paddingLeft || '16px'};
  border-left: ${(props) => props.$borderWidth || '3px'} solid
    ${(props) => props.$accentColor || 'var(--resume-color-accent)'};

  font-size: var(--resume-size-body);
  font-style: ${(props) => props.$fontStyle || 'italic'};
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-primary);
  line-height: var(--resume-line-height-normal);

  /* Prevent quote clipping with subtle padding */
  padding-right: 2px;

  /* Single-line constraint */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Print optimization */
  @media print {
    page-break-inside: avoid;
    color: #000;
    border-left-color: ${(props) => props.$accentColor || '#000'};
  }
`;

export function QuoteStripe({
  children,
  className,
  accentColor,
  borderWidth,
  fontStyle,
  paddingLeft,
}) {
  return (
    <StyledQuoteStripe
      $accentColor={accentColor}
      $borderWidth={borderWidth}
      $fontStyle={fontStyle}
      $paddingLeft={paddingLeft}
      className={className}
    >
      {children}
    </StyledQuoteStripe>
  );
}

export default QuoteStripe;
