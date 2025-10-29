import styled from 'styled-components';
import { SectionTitle, ContactInfo } from '@resume/core';

export const Layout = styled.div`
  max-width: 8.5in;
  margin: 0 auto;
  padding: 1in;
  background: #ffffff;
  font-family: 'Times New Roman', Georgia, serif;
  font-size: 12pt;
  color: #000000;
  line-height: 1.4;

  @media print {
    padding: 0;
    margin: 0;
  }
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 24pt;
  padding-bottom: 12pt;
  border-bottom: 2pt solid #000000;
`;

export const Name = styled.h1`
  font-size: 18pt;
  font-weight: bold;
  color: #000000;
  margin: 0 0 6pt 0;
  letter-spacing: 0;
  text-transform: uppercase;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const Label = styled.div`
  font-size: 12pt;
  color: #000000;
  margin-bottom: 8pt;
  font-weight: normal;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const StyledContactInfo = styled(ContactInfo)`
  font-size: 11pt;
  text-align: center;

  a {
    font-size: 11pt;
    color: #000000;
    text-decoration: underline;
  }
`;

export const Summary = styled.p`
  font-size: 12pt;
  line-height: 1.4;
  color: #000000;
  margin: 12pt 0 0 0;
  text-align: left;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const StyledSectionTitle = styled(SectionTitle)`
  font-size: 14pt;
  font-weight: bold;
  color: #000000;
  margin: 18pt 0 12pt 0;
  padding-bottom: 4pt;
  border-bottom: 1pt solid #000000;
  text-transform: uppercase;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const WorkItem = styled.div`
  margin-bottom: 18pt;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const WorkHeader = styled.div`
  margin-bottom: 6pt;
`;

export const Position = styled.h3`
  font-size: 13pt;
  font-weight: bold;
  color: #000000;
  margin: 0 0 3pt 0;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const Company = styled.div`
  font-size: 12pt;
  color: #000000;
  font-weight: normal;
  margin-bottom: 3pt;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const DateText = styled.div`
  font-size: 11pt;
  color: #111827;
  font-weight: normal;
  font-style: italic;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const WorkSummary = styled.p`
  margin: 6pt 0;
  color: #000000;
  line-height: 1.4;
  font-size: 12pt;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const Highlights = styled.ul`
  margin: 6pt 0 0 18pt;
  padding: 0;
  list-style-type: disc;

  li {
    margin: 3pt 0;
    color: #000000;
    line-height: 1.4;
    font-size: 12pt;
    font-family: 'Times New Roman', Georgia, serif;
  }
`;

export const EducationItem = styled.div`
  margin-bottom: 12pt;
  page-break-inside: avoid;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Institution = styled.h3`
  font-size: 13pt;
  font-weight: bold;
  color: #000000;
  margin: 0 0 3pt 0;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const Degree = styled.div`
  font-size: 12pt;
  color: #000000;
  margin-bottom: 3pt;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const EducationDate = styled.div`
  font-size: 11pt;
  color: #111827;
  font-style: italic;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const SkillsList = styled.div`
  margin-bottom: 12pt;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SkillName = styled.h4`
  font-size: 12pt;
  font-weight: bold;
  color: #000000;
  margin: 0 0 3pt 0;
  display: inline;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const SkillTags = styled.span`
  font-size: 12pt;
  color: #000000;
  font-weight: normal;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const SimpleList = styled.div`
  margin-bottom: 12pt;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ListItemTitle = styled.h4`
  font-size: 12pt;
  font-weight: bold;
  color: #000000;
  margin: 0 0 3pt 0;
  font-family: 'Times New Roman', Georgia, serif;
`;

export const ListItemText = styled.p`
  font-size: 12pt;
  color: #000000;
  margin: 3pt 0;
  line-height: 1.4;
  font-family: 'Times New Roman', Georgia, serif;
`;
