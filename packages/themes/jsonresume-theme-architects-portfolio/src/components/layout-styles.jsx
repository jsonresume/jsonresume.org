import styled from 'styled-components';
import { ContactInfo } from '@resume/core';

export const Layout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 72px 48px;
  background: #fafaf9;
  font-family: 'Jost', 'Red Hat Display', -apple-system, BlinkMacSystemFont,
    sans-serif;
  color: #1f2937;
  line-height: 1.6;

  @media print {
    padding: 40px;
    background: white;
  }
`;

export const Header = styled.header`
  margin-bottom: 56px;
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
`;

export const Name = styled.h1`
  font-size: 48px;
  font-weight: 300;
  color: #111827;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const Label = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const StyledContactInfo = styled(ContactInfo)`
  font-size: 14px;
  color: #6b7280;

  a {
    font-size: 14px;
    color: #6b7280;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: #6b7280;
    }
  }
`;

export const Summary = styled.p`
  font-size: 15px;
  line-height: 1.8;
  color: #374151;
  margin: 24px 0 0 0;
  font-weight: 300;
`;

export const SectionTitle = styled.h2`
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin: 48px 0 24px 0;
  letter-spacing: 3px;
  text-transform: uppercase;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }
`;
