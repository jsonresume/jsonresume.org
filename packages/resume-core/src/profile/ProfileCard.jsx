import React from 'react';
/**
 * ProfileCard
 * Combined profile information card
 */
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: ${(props) => props.$direction || 'column'};
  align-items: ${(props) =>
    props.$direction === 'row' ? 'center' : 'flex-start'};
  gap: var(--resume-space-item);
  padding: var(--resume-space-item);
  background-color: var(--resume-color-background);
  border: 1px solid var(--resume-color-border);
  border-radius: var(--resume-radius-md);
  margin-bottom: var(--resume-space-section);

  @media print {
    border: 1px solid var(--resume-color-border);
    break-inside: avoid;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Name = styled.h1`
  font-size: var(--resume-size-name);
  font-weight: var(--resume-weight-bold);
  color: var(--resume-color-primary);
  margin: 0 0 4px 0;
`;

const Title = styled.h2`
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-normal);
  color: var(--resume-color-secondary);
  margin: 0 0 var(--resume-space-tight) 0;
`;

const Summary = styled.p`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
  line-height: var(--resume-line-height-normal);
  margin: 0;
`;

export function ProfileCard({
  name,
  title,
  summary,
  avatar,
  direction = 'column',
  children,
  className,
}) {
  return (
    <Card $direction={direction} className={className}>
      {avatar}
      <Info>
        {name && <Name>{name}</Name>}
        {title && <Title>{title}</Title>}
        {summary && <Summary>{summary}</Summary>}
        {children}
      </Info>
    </Card>
  );
}

export default ProfileCard;
