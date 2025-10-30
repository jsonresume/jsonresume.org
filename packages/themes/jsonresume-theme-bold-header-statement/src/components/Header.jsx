import React from 'react';
import styled from 'styled-components';
import { ContactInfo } from '@resume/core';

const HeaderSection = styled.header`
  width: 100%;
  background: linear-gradient(135deg, #0f766e 0%, #0d9488 100%);
  padding: 80px 60px;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    transform: translate(30%, -30%);
  }

  @media print {
    padding: 60px 40px;
    background: #0f766e;
  }
`;

const Name = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin: 0 0 16px 0;
  letter-spacing: -2px;
  line-height: 1;
  text-transform: uppercase;
  position: relative;
  z-index: 1;

  @media print {
    font-size: 3.5rem;
  }
`;

const Label = styled.div`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 32px;
  font-weight: 300;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
`;

const StyledContactInfo = styled(ContactInfo)`
  font-size: 16px;
  position: relative;
  z-index: 1;

  a {
    color: white;
    font-weight: 400;
  }

  span {
    color: rgba(255, 255, 255, 0.9);
  }
`;

export function Header({ basics }) {
  return (
    <HeaderSection>
      <Name>{basics.name}</Name>
      {basics.label && <Label>{basics.label}</Label>}
      <StyledContactInfo basics={basics} />
    </HeaderSection>
  );
}
