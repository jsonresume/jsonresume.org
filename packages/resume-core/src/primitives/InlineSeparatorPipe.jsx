import React from 'react';
import styled from 'styled-components';

/**
 * InlineSeparatorPipe Component
 * Vertical pipe separator for inline metadata with thin space padding.
 * Prevents crowding and improves readability in compact layouts.
 * Uses Unicode thin space (U+2009) for optimal spacing.
 *
 * @component
 * @example
 * <span>
 *   Remote
 *   <InlineSeparatorPipe />
 *   Full-time
 *   <InlineSeparatorPipe />
 *   $100k-$150k
 * </span>
 *
 * @param {string} [color] - Custom color for the pipe
 * @param {string} [className] - Additional CSS classes
 * @param {React.ElementType} [as='span'] - HTML element to render as
 */

const StyledPipe = styled.span`
  /* Thin space (U+2009) + pipe + thin space for balanced spacing */
  &::before {
    content: '\u2009|\u2009';
    opacity: 0.5;
    color: ${(props) => props.$color || 'currentColor'};
    font-weight: normal;
  }

  /* Ensure consistent spacing across browsers */
  display: inline;
  white-space: pre;

  @media print {
    &::before {
      content: '\u2009|\u2009';
      opacity: 0.6;
    }
  }
`;

export function InlineSeparatorPipe({
  color,
  className,
  as = 'span',
  ...rest
}) {
  return (
    <StyledPipe
      as={as}
      $color={color}
      className={`resume-inline-separator-pipe ${className || ''}`.trim()}
      aria-hidden="true"
      role="presentation"
      {...rest}
    />
  );
}

export default InlineSeparatorPipe;
