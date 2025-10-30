import React from 'react';
import styled from 'styled-components';

/**
 * TwoColumnMicroGrid Component
 * Text-only two-column micro grid with semantic single-column DOM order.
 * Uses CSS column flow for visual presentation while maintaining linear semantic order.
 * Perfect for compact information display that needs to remain accessible and ATS-friendly.
 *
 * @component
 * @example
 * <TwoColumnMicroGrid>
 *   <span>Item 1</span>
 *   <span>Item 2</span>
 *   <span>Item 3</span>
 *   <span>Item 4</span>
 * </TwoColumnMicroGrid>
 *
 * @param {React.ReactNode} children - Grid items to display
 * @param {string} [gap='8px'] - Gap between items
 * @param {string} [columnGap='16px'] - Gap between columns
 * @param {string} [className] - Additional CSS classes
 * @param {React.ElementType} [as='div'] - HTML element to render as
 */

const StyledTwoColumnGrid = styled.div`
  /* Use CSS columns for visual two-column layout */
  column-count: 2;
  column-gap: ${(props) => props.$columnGap || '16px'};

  /* Prevent column breaks inside items */
  & > * {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: ${(props) => props.$gap || '8px'};
    display: block;
  }

  /* Last item in each column shouldn't have bottom margin */
  & > *:last-child {
    margin-bottom: 0;
  }

  @media print {
    column-count: 2;
    column-gap: 12pt;

    & > * {
      margin-bottom: 6pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }

  /* Collapse to single column on small screens */
  @media (max-width: 768px) {
    column-count: 1;
    column-gap: 0;

    & > * {
      margin-bottom: ${(props) => props.$gap || '8px'};
    }
  }
`;

export function TwoColumnMicroGrid({
  children,
  gap = '8px',
  columnGap = '16px',
  className,
  as = 'div',
  ...rest
}) {
  return (
    <StyledTwoColumnGrid
      as={as}
      $gap={gap}
      $columnGap={columnGap}
      className={`resume-two-column-micro-grid ${className || ''}`.trim()}
      {...rest}
    >
      {children}
    </StyledTwoColumnGrid>
  );
}

export default TwoColumnMicroGrid;
