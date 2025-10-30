import React from 'react';
/**
 * ExperienceCard
 * Card-style work experience display
 */
import styled from 'styled-components';

const Card = styled.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-item);

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--resume-space-tight);
  flex-wrap: wrap;
  gap: 8px;
`;

const Title = styled.h3`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin: 0;
`;

const Company = styled.div`
  font-size: var(--resume-size-body);
  color: var(--resume-color-accent);
  font-weight: var(--resume-weight-medium);
`;

const Meta = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  margin-bottom: var(--resume-space-tight);
`;

const Summary = styled.p`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  margin: 0;
`;

export function ExperienceCard({
  title,
  company,
  location,
  date,
  summary,
  children,
  className,
}) {
  return (
    <Card className={className}>
      <Header>
        <Title>{title}</Title>
      </Header>
      {company && <Company>{company}</Company>}
      <Meta>
        {location && <span>{location}</span>}
        {location && date && <span> • </span>}
        {date && <span>{date}</span>}
      </Meta>
      {summary && <Summary>{summary}</Summary>}
      {children}
    </Card>
  );
}

export default ExperienceCard;
