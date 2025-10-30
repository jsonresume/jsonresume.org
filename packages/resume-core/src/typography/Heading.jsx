import React from 'react';
/**
 * Heading
 * Semantic heading component
 */
import styled from 'styled-components';

const StyledHeading = styled.h1`
  font-size: ${(props) => {
    const sizes = {
      1: 'var(--resume-size-name)',
      2: 'var(--resume-size-heading)',
      3: 'var(--resume-size-subheading)',
      4: 'var(--resume-size-body)',
    };
    return sizes[props.$level] || sizes[2];
  }};
  font-weight: ${(props) => props.$weight || 'var(--resume-weight-semibold)'};
  color: ${(props) => props.$color || 'var(--resume-color-primary)'};
  margin: 0 0 ${(props) => props.$spacing || 'var(--resume-space-tight)'} 0;
  line-height: var(--resume-line-height-tight);
`;

export function Heading({
  level = 2,
  weight,
  color,
  spacing,
  children,
  className,
  as,
}) {
  const Component = as || `h${level}`;
  return (
    <StyledHeading
      as={Component}
      $level={level}
      $weight={weight}
      $color={color}
      $spacing={spacing}
      className={className}
    >
      {children}
    </StyledHeading>
  );
}

export default Heading;
