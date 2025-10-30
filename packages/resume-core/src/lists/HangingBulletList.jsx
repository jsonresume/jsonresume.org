import React from 'react';
import styled from 'styled-components';

/**
 * HangingBulletList
 * Bullets hang outside the text block using text-indent (not positioned pseudo-elements)
 * Creates clean alignment with text flush to left margin
 */

const List = styled.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 0;
  list-style: none;
`;

const Item = styled.li`
  position: relative;
  padding: 4px 0 4px 20px; /* Left padding for bullet space */
  text-indent: -20px; /* Negative indent to hang bullet outside */
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  break-inside: avoid;

  &::before {
    content: '${(props) => props.$bullet || '•'}';
    color: ${(props) => props.$color || 'var(--resume-color-accent)'};
    font-weight: var(--resume-weight-semibold);
    display: inline-block;
    width: 20px;
    text-indent: 0; /* Reset indent for bullet */
  }

  /* Reset text-indent for child elements */
  > * {
    text-indent: 0;
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    orphans: 2;
    widows: 2;

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
export function HangingBulletList({
  items = [],
  bullet = '•',
  color,
  className,
}) {
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

export default HangingBulletList;
