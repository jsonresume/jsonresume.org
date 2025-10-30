import React from 'react';
/**
 * HeaderCentered
 * Centered header layout
 */
import styled from 'styled-components';

const Header = styled.header`
  text-align: center;
  margin-bottom: var(--resume-space-section);

  @media print {
    break-after: avoid;
  }
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
  margin: 0 0 var(--resume-space-item) 0;
`;

const Contacts = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--resume-space-tight);
  flex-wrap: wrap;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;

export function HeaderCentered({ name, title, contacts, children, className }) {
  return (
    <Header className={className}>
      {name && <Name>{name}</Name>}
      {title && <Title>{title}</Title>}
      {contacts && <Contacts>{contacts}</Contacts>}
      {children}
    </Header>
  );
}

export default HeaderCentered;
