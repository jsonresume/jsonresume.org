import React from 'react';
/**
 * IconList
 * List with custom icons or emojis for each item
 */
import styled from 'styled-components';

const List = styled.ul`
  margin: var(--resume-space-tight) 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 6px 0;
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const IconWrapper = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${(props) => props.$color || 'var(--resume-color-accent)'};
  margin-top: 2px;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
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
 * @param {Array} props.items - Array of items
 * @param {string} props.items[].text - Item text
 * @param {string|React.ReactNode} [props.items[].icon] - Item icon
 * @param {string} [props.items[].color] - Icon color
 * @param {string|React.ReactNode} [props.defaultIcon='•'] - Default icon for all items
 * @param {string} [props.defaultColor] - Default icon color
 * @param {string} [props.className] - Additional CSS classes
 */
export function IconList({
  items = [],
  defaultIcon = '•',
  defaultColor,
  className,
}) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className}>
      {items.map((item, index) => {
        const icon =
          (typeof item === 'object' ? item.icon : null) || defaultIcon;
        const text = typeof item === 'object' ? item.text : item;
        const color =
          (typeof item === 'object' ? item.color : null) || defaultColor;

        return (
          <Item key={index}>
            <IconWrapper $color={color}>{icon}</IconWrapper>
            <Text>{text}</Text>
          </Item>
        );
      })}
    </List>
  );
}

export default IconList;
