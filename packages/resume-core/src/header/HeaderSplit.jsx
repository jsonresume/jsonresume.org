import React from 'react';
/**
 * HeaderSplit
 * Split header with name on left, contact on right
 */
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--resume-space-section);
  gap: var(--resume-space-item);

  @media print {
    break-after: avoid;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
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
  margin: 0;
`;

const Right = styled.div`
  text-align: right;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

export function HeaderSplit({ name, title, contacts, children, className }) {
  return (
    <Header className={className}>
      <Left>
        {name && <Name>{name}</Name>}
        {title && <Title>{title}</Title>}
      </Left>
      <Right>
        {contacts}
        {children}
      </Right>
    </Header>
  );
}

export default HeaderSplit;
