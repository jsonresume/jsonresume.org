import React from 'react';
import { Section, DateRange } from '@resume/core';
import {
  StyledSectionTitle,
  WorkItem,
  WorkHeader,
  Position,
  Company,
  DateText,
  WorkSummary,
  Highlights,
} from '../styles.js';

export function WorkSection({ work }) {
  if (!work?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Professional Experience</StyledSectionTitle>
      {work.map((job, index) => (
        <WorkItem key={index}>
          <WorkHeader>
            <Position>{job.position}</Position>
            {job.name && <Company>{job.name}</Company>}
            {(job.startDate || job.endDate) && (
              <DateText>
                <DateRange startDate={job.startDate} endDate={job.endDate} />
              </DateText>
            )}
          </WorkHeader>
          {job.summary && <WorkSummary>{job.summary}</WorkSummary>}
          {job.highlights?.length > 0 && (
            <Highlights>
              {job.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </Highlights>
          )}
        </WorkItem>
      ))}
    </Section>
  );
}
