import React from 'react';
/**
 * Label
 * Small label/caption text
 */
import styled from 'styled-components';

const StyledLabel = styled.span`
  display: inline-block;
  font-size: var(--resume-size-small);
  font-weight: ${(props) => props.$weight || 'var(--resume-weight-medium)'};
  color: ${(props) => props.$color || 'var(--resume-color-secondary)'};
  text-transform: ${(props) => (props.$uppercase ? 'uppercase' : 'none')};
  letter-spacing: ${(props) => (props.$uppercase ? '0.05em' : 'normal')};
`;

export function Label({
  weight,
  color,
  uppercase = false,
  children,
  className,
  as = 'span',
}) {
  return (
    <StyledLabel
      as={as}
      $weight={weight}
      $color={color}
      $uppercase={uppercase}
      className={className}
    >
      {children}
    </StyledLabel>
  );
}

export default Label;
