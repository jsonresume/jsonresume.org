import React from 'react';
/**
 * CardLayout
 * Grid layout for displaying cards
 */
import styled from 'styled-components';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(${(props) => props.$minCardWidth || '250px'}, 1fr)
  );
  gap: ${(props) => props.$gap || 'var(--resume-space-item)'};
  margin-bottom: ${(props) => props.$spacing || 'var(--resume-space-section)'};

  @media print {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${(props) => props.$gap || '12px'};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export function CardLayout({
  minCardWidth = '250px',
  gap,
  spacing,
  children,
  className,
}) {
  return (
    <CardGrid
      $minCardWidth={minCardWidth}
      $gap={gap}
      $spacing={spacing}
      className={className}
    >
      {children}
    </CardGrid>
  );
}

export default CardLayout;
