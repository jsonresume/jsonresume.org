import React from 'react';
import styled from 'styled-components';

/**
 * AchievementListTight
 * Compressed bullet list with hanging punctuation and strict orphan/widow control
 * Optimized for dense achievement sections with 2-3 line maximum per item
 */

const List = styled.ul`
  margin: var(--resume-space-tight) 0;
  padding-left: 20px;
  list-style: none;
`;

const Item = styled.li`
  position: relative;
  padding: 2px 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: 1.4;
  break-inside: avoid;
  orphans: 2;
  widows: 2;
  max-height: 4.2em; /* Enforce 2-3 line max (1.4 line-height × 3 lines) */
  overflow: hidden;
  text-overflow: ellipsis;

  &::before {
    content: '${(props) => props.$bullet || '•'}';
    position: absolute;
    left: -16px;
    color: ${(props) => props.$color || 'var(--resume-color-accent)'};
    font-weight: var(--resume-weight-semibold);
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
 * @param {Array<string|Object>} props.items - Array of achievement items (strings or objects with text)
 * @param {string} [props.bullet='•'] - Custom bullet character
 * @param {string} [props.color] - Custom bullet color
 * @param {string} [props.className] - Additional CSS classes
 */
export function AchievementListTight({
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

export default AchievementListTight;
