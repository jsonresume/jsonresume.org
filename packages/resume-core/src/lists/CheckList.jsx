import React from 'react';
/**
 * CheckList
 * List with checkmarks for completed items
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
  gap: 10px;
  padding: 6px 0;
  break-inside: avoid;

  @media print {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Check = styled.span`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$checked
      ? 'var(--resume-color-accent)'
      : 'var(--resume-color-border)'};
  color: white;
  font-size: 12px;
  margin-top: 2px;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    border: 2px solid
      ${(props) =>
        props.$checked
          ? 'var(--resume-color-accent)'
          : 'var(--resume-color-border)'};
  }
`;

const Text = styled.span`
  flex: 1;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  text-decoration: ${(props) =>
    props.$checked && props.$strikethrough ? 'line-through' : 'none'};
  opacity: ${(props) => (props.$checked && props.$strikethrough ? 0.7 : 1)};
`;

/**
 * @param {Object} props
 * @param {Array} props.items - Array of items
 * @param {string} props.items[].text - Item text
 * @param {boolean} [props.items[].checked] - Whether item is checked
 * @param {boolean} [props.strikethrough=false] - Strike through checked items
 * @param {string} [props.className] - Additional CSS classes
 */
export function CheckList({ items = [], strikethrough = false, className }) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className}>
      {items.map((item, index) => {
        const isChecked = typeof item === 'object' ? item.checked : false;
        const text = typeof item === 'object' ? item.text : item;

        return (
          <Item key={index}>
            <Check $checked={isChecked}>{isChecked && '✓'}</Check>
            <Text $checked={isChecked} $strikethrough={strikethrough}>
              {text}
            </Text>
          </Item>
        );
      })}
    </List>
  );
}

export default CheckList;
