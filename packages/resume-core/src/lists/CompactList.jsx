import React from 'react';
/**
 * CompactList
 * Condensed list with minimal spacing for tight layouts
 */
import styled from 'styled-components';

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  break-inside: avoid;

  &:not(:last-child) {
    border-bottom: ${(props) =>
      props.$divider ? '1px solid var(--resume-color-border)' : 'none'};
    padding-bottom: ${(props) => (props.$divider ? '6px' : '2px')};
    margin-bottom: ${(props) => (props.$divider ? '6px' : '0')};
  }

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
    border-bottom: ${(props) =>
      props.$divider ? '1px solid var(--resume-color-border)' : 'none'};
  }
`;

const Bullet = styled.span`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.$color || 'var(--resume-color-accent)'};

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 1px solid ${(props) => props.$color || 'var(--resume-color-accent)'};
  }
`;

const Text = styled.span`
  flex: 1;
  line-height: 1.4;
`;

/**
 * @param {Object} props
 * @param {Array<string|Object>} props.items - Array of items (strings or objects with text)
 * @param {boolean} [props.showBullets=true] - Show bullet points
 * @param {boolean} [props.divider=false] - Show dividers between items
 * @param {string} [props.color] - Custom bullet color
 * @param {string} [props.className] - Additional CSS classes
 */
export function CompactList({
  items = [],
  showBullets = true,
  divider = false,
  color,
  className,
}) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className}>
      {items.map((item, index) => {
        const text = typeof item === 'object' ? item.text : item;

        return (
          <Item key={index} $divider={divider}>
            {showBullets && <Bullet $color={color} />}
            <Text>{text}</Text>
          </Item>
        );
      })}
    </List>
  );
}

export default CompactList;
