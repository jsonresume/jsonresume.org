import React from 'react';
import styled from 'styled-components';

/**
 * InlineKicker Component
 * Small uppercase prefix label for emphasizing content category or type.
 * Commonly used before headings or sections to provide context.
 *
 * @component
 * @example
 * <InlineKicker>Featured Project</InlineKicker>
 * <InlineKicker color="#2563eb">Senior Role</InlineKicker>
 *
 * @param {React.ReactNode} children - The text content to display
 * @param {string} [color] - Custom text color (defaults to theme secondary)
 * @param {string} [className] - Additional CSS classes
 * @param {React.ElementType} [as='span'] - HTML element to render as
 */

const StyledKicker = styled.span`
  display: inline-block;
  font-size: ${(props) =>
    props.theme?.typography?.sizes?.small || 'var(--resume-size-small, 10px)'};
  font-weight: ${(props) =>
    props.theme?.typography?.weights?.semibold ||
    'var(--resume-weight-semibold, 600)'};
  color: ${(props) =>
    props.$color ||
    props.theme?.colors?.secondary ||
    'var(--resume-color-secondary, #4a4a4a)'};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.2;

  @media print {
    font-size: 9pt;
    color: ${(props) => props.$color || '#4a4a4a'};
    letter-spacing: 0.08em;
  }
`;

export function InlineKicker({
  children,
  color,
  className,
  as = 'span',
  ...rest
}) {
  return (
    <StyledKicker
      as={as}
      $color={color}
      className={`resume-inline-kicker ${className || ''}`.trim()}
      {...rest}
    >
      {children}
    </StyledKicker>
  );
}

export default InlineKicker;
