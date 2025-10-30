import React from 'react';
/**
 * HeaderMinimal
 * Minimal single-line header
 */
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: var(--resume-space-item);
  border-bottom: 2px solid var(--resume-color-border);
  margin-bottom: var(--resume-space-section);
  gap: var(--resume-space-item);

  @media print {
    border-bottom: 2px solid var(--resume-color-border);
    break-after: avoid;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Name = styled.h1`
  font-size: var(--resume-size-heading);
  font-weight: var(--resume-weight-bold);
  color: var(--resume-color-primary);
  margin: 0;
`;

const Contact = styled.div`
  font-size: var(--resume-size-small);
  color: var(--resume-color-secondary);
`;

export function HeaderMinimal({ name, contact, children, className }) {
  return (
    <Header className={className}>
      {name && <Name>{name}</Name>}
      {contact && <Contact>{contact}</Contact>}
      {children}
    </Header>
  );
}

export default HeaderMinimal;
