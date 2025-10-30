import React from 'react';
import styled from 'styled-components';

/**
 * MetaRow Component
 * Displays metadata in a compact row format with bullet separators.
 * Perfect for location, date, and type information.
 * Ensures minimum 4.5:1 contrast ratio for accessibility.
 *
 * @component
 * @example
 * <MetaRow items={['San Francisco, CA', 'Jan 2020 - Present', 'Full-time']} />
 * <MetaRow separator=" | ">
 *   <span>Remote</span>
 *   <span>Contract</span>
 * </MetaRow>
 *
 * @param {Array<string|React.ReactNode>} [items] - Array of items to display
 * @param {React.ReactNode} [children] - Alternative to items array
 * @param {string} [separator='·'] - Separator character between items
 * @param {string} [className] - Additional CSS classes
 * @param {React.ElementType} [as='div'] - HTML element to render as
 */

const StyledMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: ${(props) =>
    props.theme?.typography?.sizes?.small || 'var(--resume-size-small, 10px)'};
  color: ${(props) =>
    props.theme?.colors?.secondary || 'var(--resume-color-secondary, #4a4a4a)'};
  line-height: 1.5;

  /* Ensure 4.5:1 contrast ratio minimum */
  @media screen {
    color: #4a4a4a; /* 9.29:1 contrast on white */
  }

  @media print {
    font-size: 9pt;
    color: #4a4a4a;
    gap: 6px;
  }
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;

  &:not(:last-child)::after {
    content: '${(props) => props.$separator}';
    margin-left: 8px;
    opacity: 0.6;

    @media print {
      margin-left: 6px;
    }
  }
`;

export function MetaRow({
  children,
  items,
  separator = '·',
  className,
  as = 'div',
  ...rest
}) {
  // Support both children (for manual composition) and items array (for convenience)
  const content = items
    ? items.filter(Boolean).map((item, index) => (
        <MetaItem key={index} $separator={separator}>
          {item}
        </MetaItem>
      ))
    : React.Children.map(children, (child, index) => (
        <MetaItem key={index} $separator={separator}>
          {child}
        </MetaItem>
      ));

  return (
    <StyledMetaRow
      as={as}
      className={`resume-meta-row ${className || ''}`.trim()}
      {...rest}
    >
      {content}
    </StyledMetaRow>
  );
}

export default MetaRow;
