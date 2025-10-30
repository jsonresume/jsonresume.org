import React from 'react';
/**
 * BulletList
 * Simple bullet point list with custom styling
 */
import styled from 'styled-components';

const List = styled.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 24px;
  list-style: none;
`;

const Item = styled.li`
  position: relative;
  padding: 4px 0 4px 16px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  &::before {
    content: '${(props) => props.$bullet || '•'}';
    position: absolute;
    left: 0;
    color: ${(props) => props.$color || 'var(--resume-color-accent)'};
    font-weight: var(--resume-weight-bold);
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;

    &::before {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

/**
 * @param {Object} props
 * @param {Array<string|Object>} props.items - Array of items (strings or objects with text)
 * @param {string} [props.bullet='•'] - Custom bullet character
 * @param {string} [props.color] - Custom bullet color
 * @param {string} [props.className] - Additional CSS classes
 */
export function BulletList({ items = [], bullet = '•', color, className }) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className}>
      {items.map((item, index) => {
        const text = typeof item === 'object' ? item.text : item;

        return (
          <Item key={index} $bullet={bullet} $color={color}>
            {text}
          </Item>
        );
      })}
    </List>
  );
}

export default BulletList;
