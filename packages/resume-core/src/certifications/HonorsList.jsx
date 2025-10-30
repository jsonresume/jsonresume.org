import React from 'react';
/**
 * HonorsList
 * List of honors and awards with compact display
 */
import styled from 'styled-components';

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--resume-space-tight);
  padding: 8px 0;
  border-bottom: 1px solid var(--resume-color-border);
  break-inside: avoid;

  &:last-child {
    border-bottom: none;
  }

  @media print {
    border-bottom: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
  margin-bottom: 2px;
`;

const Awarder = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

const Date = styled.time`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  white-space: nowrap;
`;

/**
 * @param {Object} props
 * @param {Array} props.items - Array of honors/awards
 * @param {string} props.items[].title - Honor title
 * @param {string} [props.items[].awarder] - Organization
 * @param {string} [props.items[].date] - Date received
 * @param {string} [props.className] - Additional CSS classes
 */
export function HonorsList({ items = [], className }) {
  if (!items || items.length === 0) return null;

  return (
    <List className={className}>
      {items.map((item, index) => (
        <Item key={index}>
          <Info>
            <Title>{item.title}</Title>
            {item.awarder && <Awarder>{item.awarder}</Awarder>}
          </Info>
          {item.date && <Date>{item.date}</Date>}
        </Item>
      ))}
    </List>
  );
}

export default HonorsList;
