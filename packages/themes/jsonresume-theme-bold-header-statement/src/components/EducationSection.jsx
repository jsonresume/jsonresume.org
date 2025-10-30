import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, DateRange } from '@resume/core';

const StyledSectionTitle = styled(SectionTitle)`
  font-size: 14px;
  font-weight: 700;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 60px 0 32px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #0f766e;
`;

const ContentBlock = styled.div`
  margin-bottom: 50px;
  background: #fafafa;
  padding: 32px;
  border-radius: 8px;
  border-left: 4px solid #0f766e;

  &:last-child {
    margin-bottom: 0;
  }

  @media print {
    background: white;
    border: 1px solid #e5e7eb;
    padding: 24px;
  }
`;

const Institution = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
`;

const Degree = styled.div`
  font-size: 16px;
  color: #4b5563;
  margin-bottom: 8px;
  font-weight: 400;
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export function EducationSection({ education }) {
  if (!education?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Education</StyledSectionTitle>
      {education.map((edu, index) => (
        <ContentBlock key={index}>
          <Institution>{edu.institution}</Institution>
          <Degree>
            {edu.studyType} in {edu.area}
            {edu.score && ` • ${edu.score}`}
          </Degree>
          <EducationDate>
            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
          </EducationDate>
        </ContentBlock>
      ))}
    </Section>
  );
}
