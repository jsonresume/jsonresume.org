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

const WorkHeader = styled.div`
  margin-bottom: 16px;
`;

const Position = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
`;

const Company = styled.div`
  font-size: 18px;
  color: #0f766e;
  font-weight: 500;
  margin-bottom: 8px;
`;

const DateText = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const WorkSummary = styled.p`
  margin: 16px 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 16px;
  font-weight: 300;
`;

const Highlights = styled.ul`
  margin: 16px 0 0 0;
  padding-left: 24px;
  list-style-type: none;

  li {
    margin: 10px 0;
    color: #374151;
    line-height: 1.7;
    font-weight: 300;
    position: relative;
    padding-left: 8px;

    &::before {
      content: '▸';
      position: absolute;
      left: -16px;
      color: #0f766e;
      font-weight: 700;
    }
  }
`;

export function WorkSection({ work }) {
  if (!work?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Experience</StyledSectionTitle>
      {work.map((job, index) => (
        <ContentBlock key={index}>
          <WorkHeader>
            <Position>{job.position}</Position>
            {job.name && <Company>{job.name}</Company>}
            <DateText>
              <DateRange startDate={job.startDate} endDate={job.endDate} />
            </DateText>
          </WorkHeader>
          {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
          {job.highlights?.length > 0 && (
            <Highlights>
              {job.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </Highlights>
          )}
        </ContentBlock>
      ))}
    </Section>
  );
}
