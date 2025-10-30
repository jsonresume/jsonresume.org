import React from 'react';
import styled from 'styled-components';

/**
 * GreyLabelCaps Component
 * Tiny uppercase gray labels for section metadata and categorization.
 * Ensures minimum 4.5:1 contrast ratio for WCAG AA compliance.
 *
 * @component
 * @example
 * <GreyLabelCaps>Education</GreyLabelCaps>
 * <GreyLabelCaps size="xs">2018-2022</GreyLabelCaps>
 *
 * @param {React.ReactNode} children - The label text
 * @param {string} [size='sm'] - Size variant: 'xs' (8pt) or 'sm' (9pt)
 * @param {string} [className] - Additional CSS classes
 * @param {React.ElementType} [as='span'] - HTML element to render as
 */

const StyledGreyLabel = styled.span`
  display: inline-block;
  font-size: ${(props) => {
    if (props.$size === 'xs') return '8pt';
    return '9pt'; // default sm
  }};
  font-weight: ${(props) =>
    props.theme?.typography?.weights?.medium ||
    'var(--resume-weight-medium, 500)'};
  /* Ensure 4.5:1 contrast minimum - #767676 provides 4.54:1 on white */
  color: #767676;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.3;

  @media print {
    font-size: ${(props) => {
      if (props.$size === 'xs') return '8pt';
      return '9pt';
    }};
    color: #767676;
    letter-spacing: 0.08em;
  }
`;

export function GreyLabelCaps({
  children,
  size = 'sm',
  className,
  as = 'span',
  ...rest
}) {
  return (
    <StyledGreyLabel
      as={as}
      $size={size}
      className={`resume-grey-label-caps resume-grey-label-caps-${size} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledGreyLabel>
  );
}

export default GreyLabelCaps;
