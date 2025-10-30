import React from 'react';
import styled from 'styled-components';

/**
 * ListDashCompact
 * Dash-led list for minimal themes using proper en-dash (–) not hyphen (-)
 * Compact spacing ideal for skill lists and brief item collections
 */

const List = styled.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 0;
  list-style: none;
`;

const Item = styled.li`
  position: relative;
  padding: 2px 0 2px 16px;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: 1.5;
  break-inside: avoid;

  &::before {
    content: '–'; /* En-dash (U+2013), not hyphen */
    position: absolute;
    left: 0;
    color: ${(props) => props.$color || 'var(--resume-color-text)'};
    font-weight: var(--resume-weight-normal);
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
 * @param {string} [props.color] - Custom dash color
 * @param {string} [props.className] - Additional CSS classes
 */
export function ListDashCompact({ items = [], color, className }) {
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

export default ListDashCompact;
