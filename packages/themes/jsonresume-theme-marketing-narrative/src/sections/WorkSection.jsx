import React from 'react';
import { Section, DateRange } from '@resume/core';
import {
  StyledSectionTitle,
  StoryItem,
  StoryHeader,
  Position,
  CompanyAndDate,
  Company,
  DateText,
  Narrative,
  Achievements,
  AchievementItem,
} from '../Resume.jsx';

export function WorkSection({ work }) {
  if (!work?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Professional Story</StyledSectionTitle>
      {work.map((job, index) => (
        <StoryItem key={index}>
          <StoryHeader>
            <Position>{job.position}</Position>
            <CompanyAndDate>
              {job.name && <Company>{job.name}</Company>}
              <DateText>
                <DateRange startDate={job.startDate} endDate={job.endDate} />
              </DateText>
            </CompanyAndDate>
          </StoryHeader>
          {job.summary && <Narrative>{job.summary}</Narrative>}
          {job.highlights?.length > 0 && (
            <Achievements>
              {job.highlights.map((highlight, i) => (
                <AchievementItem key={i}>{highlight}</AchievementItem>
              ))}
            </Achievements>
          )}
        </StoryItem>
      ))}
    </Section>
  );
}
