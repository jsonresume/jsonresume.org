import React from 'react';
import { Section, DateRange } from '@resume/core';
import { SectionTitle } from './layout-styles.jsx';
import {
  WorkItem,
  WorkHeader,
  Position,
  Company,
  DateText,
  WorkSummary,
  Highlights,
} from './section-styles.jsx';

export function WorkSection({ work = [] }) {
  if (!work?.length) return null;

  return (
    <Section>
      <SectionTitle>Experience</SectionTitle>
      {work.map((job, index) => (
        <WorkItem key={index}>
          <WorkHeader>
            <div>
              <Position>{job.position}</Position>
              {job.name && <Company>{job.name}</Company>}
            </div>
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
        </WorkItem>
      ))}
    </Section>
  );
}
