import React from 'react';
/**
 * NumberedList
 * Numbered list with custom styling
 */
import styled from 'styled-components';

const List = styled.ol`
  margin: var(--resume-space-tight) 0;
  padding-left: 28px;
  counter-reset: list-counter;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 6px 0;
  counter-increment: list-counter;
  break-inside: avoid;

  &::before {
    content: counter(list-counter) '.';
    flex-shrink: 0;
    width: 24px;
    font-weight: var(--resume-weight-medium);
    color: ${(props) => props.$color || 'var(--resume-color-accent)'};
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

const Text = styled.span`
  flex: 1;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

/**
 * @param {Object} props
 * @param {Array<string|Object>} props.items - Array of items (strings or objects with text)
 * @param {string} [props.color] - Custom number color
 * @param {number} [props.start=1] - Starting number
 * @param {string} [props.className] - Additional CSS classes
 */
export function NumberedList({ items = [], color, start = 1, className }) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className} start={start}>
      {items.map((item, index) => {
        const text = typeof item === 'object' ? item.text : item;

        return (
          <Item key={index} $color={color}>
            <Text>{text}</Text>
          </Item>
        );
      })}
    </List>
  );
}

export default NumberedList;
