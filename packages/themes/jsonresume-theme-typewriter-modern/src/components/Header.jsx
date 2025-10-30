import React from 'react';
import styled from 'styled-components';
import { ContactInfo } from '@resume/core';

const HeaderContainer = styled.header`
  margin-bottom: 48px;
  padding-bottom: 24px;
  border-bottom: 2px solid #333333;
`;

const Name = styled.h1`
  font-family: 'Work Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 38px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const Label = styled.div`
  font-size: 16px;
  color: #666666;
  margin-bottom: 16px;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  font-family: 'Courier Prime', monospace;

  a {
    font-size: 14px;
    color: #333333;
    text-decoration: underline;
  }
`;

const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #444444;
  margin: 20px 0 0 0;
  font-family: 'Courier Prime', monospace;
`;

export function Header({ basics = {} }) {
  return (
    <HeaderContainer>
      <Name>{basics.name}</Name>
      {basics.label && <Label>{basics.label}</Label>}
      <StyledContactInfo basics={basics} />
      {basics.summary && <Summary>{basics.summary}</Summary>}
    </HeaderContainer>
  );
}
