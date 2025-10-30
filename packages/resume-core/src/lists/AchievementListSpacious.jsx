import React from 'react';
import styled from 'styled-components';

/**
 * AchievementListSpacious
 * Airy bullet list with larger leading and baseline grid alignment
 * Maintains 6pt or 8pt baseline grid multiples for typographic rhythm
 */

const List = styled.ul`
  margin: var(--resume-space-comfortable) 0;
  padding-left: 24px;
  list-style: none;
`;

const Item = styled.li`
  position: relative;
  padding: 6px 0; /* 6pt baseline grid */
  margin-bottom: 8px; /* 8pt baseline grid */
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: 1.6; /* 1.6 × 16px = 25.6px ≈ 26px (multiple of 6pt baseline) */
  break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: '${(props) => props.$bullet || '•'}';
    position: absolute;
    left: -20px;
    color: ${(props) => props.$color || 'var(--resume-color-accent)'};
    font-weight: var(--resume-weight-semibold);
    line-height: inherit;
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
export function AchievementListSpacious({
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

export default AchievementListSpacious;
