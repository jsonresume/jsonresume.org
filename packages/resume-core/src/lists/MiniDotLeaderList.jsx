import React from 'react';
import styled from 'styled-components';

/**
 * MiniDotLeaderList
 * Items separated with midline dots (·) with fixed spacing
 * Ideal for inline skill tags and compact horizontal lists
 */

const List = styled.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Item = styled.li`
  display: inline-flex;
  align-items: center;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);

  &:not(:last-child)::after {
    content: '·'; /* Midline dot (U+00B7) */
    margin-left: 8px;
    color: ${(props) => props.$color || 'var(--resume-color-accent)'};
    font-weight: var(--resume-weight-semibold);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &:not(:last-child)::after {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

/**
 * @param {Object} props
 * @param {Array<string|Object>} props.items - Array of items (strings or objects with text)
 * @param {string} [props.color] - Custom dot color
 * @param {string} [props.className] - Additional CSS classes
 */
export function MiniDotLeaderList({ items = [], color, className }) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className}>
      {items.map((item, index) => {
        const text = typeof item === 'object' ? item.text : item;

        return (
          <Item key={index} $color={color}>
            {text}
          </Item>
        );
      })}
    </List>
  );
}

export default MiniDotLeaderList;
