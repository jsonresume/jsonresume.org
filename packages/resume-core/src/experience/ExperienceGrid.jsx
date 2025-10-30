import React from 'react';
/**
 * ExperienceGrid
 * Grid layout for experiences
 */
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--resume-space-item);
  margin-bottom: var(--resume-space-section);

  @media print {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  padding: var(--resume-space-item);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);

  @media print {
    break-inside: avoid;
  }
`;

const Title = styled.h4`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin: 0 0 4px 0;
`;

const Company = styled.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-accent);
  margin-bottom: 4px;
`;

const Date = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

export function ExperienceGrid({ experiences = [], className }) {
  return (
    <Grid className={className}>
      {experiences.map((exp, index) => (
        <Item key={index}>
          <Title>{exp.position}</Title>
          {exp.company && <Company>{exp.company}</Company>}
          {exp.date && <Date>{exp.date}</Date>}
        </Item>
      ))}
    </Grid>
  );
}

export default ExperienceGrid;
