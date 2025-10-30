import React from 'react';
/**
 * FlexLayout
 * Flexible layout with customizable direction and alignment
 */
import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: ${(props) => props.$direction || 'row'};
  justify-content: ${(props) => props.$justify || 'flex-start'};
  align-items: ${(props) => props.$align || 'stretch'};
  flex-wrap: ${(props) => (props.$wrap ? 'wrap' : 'nowrap')};
  gap: ${(props) => props.$gap || 'var(--resume-space-tight)'};

  @media print {
    gap: ${(props) => props.$gap || '8px'};
  }

  @media (max-width: 768px) {
    flex-direction: ${(props) =>
      props.$responsiveDirection || props.$direction === 'row'
        ? 'column'
        : props.$direction};
  }
`;

export function FlexLayout({
  direction = 'row',
  justify = 'flex-start',
  align = 'stretch',
  wrap = false,
  gap,
  responsiveDirection,
  children,
  className,
}) {
  return (
    <Flex
      $direction={direction}
      $justify={justify}
      $align={align}
      $wrap={wrap}
      $gap={gap}
      $responsiveDirection={responsiveDirection}
      className={className}
    >
      {children}
    </Flex>
  );
}

export default FlexLayout;
