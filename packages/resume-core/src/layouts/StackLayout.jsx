import React from 'react';
/**
 * StackLayout
 * Vertical stack layout with consistent spacing
 */
import styled from 'styled-components';

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.$spacing || 'var(--resume-space-item)'};

  @media print {
    gap: ${(props) => props.$spacing || '12px'};
  }
`;

export function StackLayout({ spacing, children, className }) {
  return (
    <Stack $spacing={spacing} className={className}>
      {children}
    </Stack>
  );
}

export default StackLayout;
