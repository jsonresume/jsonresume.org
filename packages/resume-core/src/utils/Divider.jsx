import React from 'react';
/**
 * Divider
 * Horizontal line separator
 */
import styled from 'styled-components';

const StyledDivider = styled.hr`
  width: 100%;
  height: ${(props) => props.$thickness || '1px'};
  background-color: ${(props) => props.$color || 'var(--resume-color-border)'};
  border: none;
  margin: ${(props) => props.$spacing || 'var(--resume-space-item)'} 0;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

export function Divider({ thickness, color, spacing, className }) {
  return (
    <StyledDivider
      $thickness={thickness}
      $color={color}
      $spacing={spacing}
      className={className}
    />
  );
}

export default Divider;
