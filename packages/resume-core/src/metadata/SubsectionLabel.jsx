import React from 'react';
import styled from 'styled-components';

/**
 * SubsectionLabel Component
 * Small inline label positioned above content blocks.
 * Uses tracked uppercase for visual hierarchy without excessive weight.
 *
 * @component
 * @example
 * <SubsectionLabel>Key Achievements</SubsectionLabel>
 * <SubsectionLabel variant="caps">Technical Skills</SubsectionLabel>
 *
 * @param {React.ReactNode} children - The label text
 * @param {string} [variant='tracked'] - Style variant: 'tracked' (uppercase with spacing) or 'caps' (small caps)
 * @param {string} [className] - Additional CSS classes
 * @param {React.ElementType} [as='div'] - HTML element to render as
 */

const StyledLabel = styled.div`
  display: block;
  font-size: ${(props) =>
    props.theme?.typography?.sizes?.small || 'var(--resume-size-small, 10px)'};
  font-weight: ${(props) =>
    props.theme?.typography?.weights?.semibold ||
    'var(--resume-weight-semibold, 600)'};
  color: ${(props) =>
    props.theme?.colors?.secondary || 'var(--resume-color-secondary, #4a4a4a)'};
  margin-bottom: 6px;
  line-height: 1.4;

  /* Tracked uppercase variant */
  ${(props) =>
    props.$variant === 'tracked' &&
    `
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-variant: normal;
  `}

  /* Small caps variant */
  ${(props) =>
    props.$variant === 'caps' &&
    `
    font-variant: small-caps;
    letter-spacing: 0.05em;
    text-transform: lowercase;
  `}

  @media print {
    font-size: 9pt;
    color: #4a4a4a;
    margin-bottom: 4px;

    ${(props) =>
      props.$variant === 'tracked' &&
      `
      text-transform: uppercase;
      letter-spacing: 0.1em;
    `}

    ${(props) =>
      props.$variant === 'caps' &&
      `
      font-variant: small-caps;
      letter-spacing: 0.05em;
    `}
  }
`;

export function SubsectionLabel({
  children,
  variant = 'tracked',
  className,
  as = 'div',
  ...rest
}) {
  return (
    <StyledLabel
      as={as}
      $variant={variant}
      className={`resume-subsection-label resume-subsection-label-${variant} ${
        className || ''
      }`.trim()}
      {...rest}
    >
      {children}
    </StyledLabel>
  );
}

export default SubsectionLabel;
