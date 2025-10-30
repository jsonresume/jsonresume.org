import React from 'react';
/**
 * SidebarLayout
 * Layout with main content and sidebar
 */
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.$sidebarPosition === 'right'
      ? `1fr ${props.$sidebarWidth || '30%'}`
      : `${props.$sidebarWidth || '30%'} 1fr`};
  gap: ${(props) => props.$gap || 'var(--resume-column-gap)'};

  @media print {
    gap: ${(props) => props.$gap || '16px'};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  grid-area: ${(props) => (props.$position === 'right' ? '1 / 2' : '1 / 1')};

  @media (max-width: 768px) {
    grid-area: auto;
  }
`;

const Main = styled.main`
  grid-area: ${(props) =>
    props.$sidebarPosition === 'right' ? '1 / 1' : '1 / 2'};

  @media (max-width: 768px) {
    grid-area: auto;
  }
`;

export function SidebarLayout({
  sidebarWidth = '30%',
  sidebarPosition = 'left',
  gap,
  sidebar,
  children,
  className,
}) {
  return (
    <Container
      $sidebarWidth={sidebarWidth}
      $sidebarPosition={sidebarPosition}
      $gap={gap}
      className={className}
    >
      <Sidebar $position={sidebarPosition}>{sidebar}</Sidebar>
      <Main $sidebarPosition={sidebarPosition}>{children}</Main>
    </Container>
  );
}

export default SidebarLayout;
