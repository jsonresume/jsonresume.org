import styled from 'styled-components';
import { Section, SectionTitle } from '@resume/core';

export const Layout = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
  color: #1e293b;

  @media print {
    padding: 40px;
  }
`;

export const TimelineSection = styled(Section)`
  position: relative;
  padding-left: 0;

  /* Central timeline line */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #334155;
    transform: translateX(-50%);
  }
`;

export const StyledSectionTitle = styled(SectionTitle)`
  font-family: 'Lora', Georgia, serif;
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin: 50px 0 40px 0;
  text-align: center;
`;

export const GridSection = styled(Section)`
  margin-top: 50px;
`;

export const SimpleSection = styled(Section)`
  margin-top: 40px;
`;
