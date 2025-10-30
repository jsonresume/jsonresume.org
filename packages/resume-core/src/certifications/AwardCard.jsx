import React from 'react';
/**
 * AwardCard
 * Card for awards with title, awarder, date, and summary
 */
import styled from 'styled-components';

const Card = styled.div`
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-tight);
  break-inside: avoid;

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--resume-space-tight);
  margin-bottom: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const Title = styled.h3`
  margin: 0;
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-medium);
  color: var(--resume-color-primary);
`;

const Date = styled.time`
  font-size: var(--resume-size-small);
  color: var(--resume-color-tertiary);
  white-space: nowrap;
`;

const Awarder = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
  margin-bottom: 8px;
`;

const Summary = styled.p`
  margin: 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
`;

/**
 * @param {Object} props
 * @param {string} props.title - Award title
 * @param {string} [props.awarder] - Organization that gave the award
 * @param {string} [props.date] - Date received
 * @param {string} [props.summary] - Award description
 * @param {string} [props.className] - Additional CSS classes
 */
export function AwardCard({ title, awarder, date, summary, className }) {
  return (
    <Card className={className}>
      <Header>
        <Title>{title}</Title>
        {date && <Date>{date}</Date>}
      </Header>
      {awarder && <Awarder>{awarder}</Awarder>}
      {summary && <Summary>{summary}</Summary>}
    </Card>
  );
}

export default AwardCard;
