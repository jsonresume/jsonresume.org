import React from 'react';
/**
 * Text
 * Body text component
 */
import styled from 'styled-components';

const StyledText = styled.p`
  font-size: ${(props) => props.$size || 'var(--resume-size-body)'};
  font-weight: ${(props) => props.$weight || 'var(--resume-weight-normal)'};
  color: ${(props) => props.$color || 'var(--resume-color-secondary)'};
  line-height: ${(props) =>
    props.$lineHeight || 'var(--resume-line-height-normal)'};
  margin: 0 0 ${(props) => props.$spacing || '0'} 0;
`;

export function Text({
  size,
  weight,
  color,
  lineHeight,
  spacing,
  children,
  className,
  as = 'p',
}) {
  return (
    <StyledText
      as={as}
      $size={size}
      $weight={weight}
      $color={color}
      $lineHeight={lineHeight}
      $spacing={spacing}
      className={className}
    >
      {children}
    </StyledText>
  );
}

export default Text;
