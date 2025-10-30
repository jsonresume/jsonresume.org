import React from 'react';
/**
 * GridLayout
 * Responsive grid layout for organizing content
 */
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$columns === 1 ? '1fr' : `repeat(${props.$columns}, 1fr)`};
  gap: ${(props) => props.$gap || 'var(--resume-column-gap)'};
  margin-bottom: ${(props) => props.$spacing || 'var(--resume-space-section)'};

  @media print {
    gap: ${(props) => props.$gap || '16px'};
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export function GridLayout({ columns = 2, gap, spacing, children, className }) {
  return (
    <Grid
      $columns={columns}
      $gap={gap}
      $spacing={spacing}
      className={className}
    >
      {children}
    </Grid>
  );
}

export default GridLayout;
