import React from 'react';
import styled from 'styled-components';
import { ContactInfo } from '@resume/core';

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e2e8f0;
`;

const Name = styled.h1`
  font-family: 'Lora', Georgia, serif;
  font-size: 48px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
`;

const Label = styled.div`
  font-size: 18px;
  font-weight: 300;
  color: #64748b;
  margin-bottom: 24px;
  letter-spacing: 0.5px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  font-weight: 300;
  justify-content: center;

  a {
    font-size: 14px;
  }
`;

const Summary = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #475569;
  margin: 24px auto 0;
  max-width: 700px;
  font-weight: 300;
`;

export function Header({ basics }) {
  return (
    <HeaderContainer>
      <Name>{basics.name}</Name>
      {basics.label && <Label>{basics.label}</Label>}
      <StyledContactInfo basics={basics} />
      {basics.summary && <Summary>{basics.summary}</Summary>}
    </HeaderContainer>
  );
}
