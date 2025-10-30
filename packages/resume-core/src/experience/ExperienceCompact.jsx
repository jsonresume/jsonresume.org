import React from 'react';
/**
 * ExperienceCompact
 * Compact list-style experience display
 */
import styled from 'styled-components';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid var(--resume-color-border);
  gap: var(--resume-space-tight);

  &:last-child {
    border-bottom: none;
  }

  @media print {
    break-inside: avoid;
  }
`;

const Main = styled.div`
  flex: 1;
`;

const Title = styled.span`
  font-size: var(--resume-size-body);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;

const Company = styled.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);

  &::before {
    content: ' at ';
  }
`;

const Date = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  white-space: nowrap;
`;

export function ExperienceCompact({ experiences = [], className }) {
  return (
    <List className={className}>
      {experiences.map((exp, index) => (
        <Item key={index}>
          <Main>
            <Title>{exp.position}</Title>
            {exp.company && <Company>{exp.company}</Company>}
          </Main>
          {exp.date && <Date>{exp.date}</Date>}
        </Item>
      ))}
    </List>
  );
}

export default ExperienceCompact;
