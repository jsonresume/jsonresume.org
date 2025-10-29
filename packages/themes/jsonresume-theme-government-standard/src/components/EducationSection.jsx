import React from 'react';
import { Section, DateRange } from '@resume/core';
import {
  StyledSectionTitle,
  EducationItem,
  Institution,
  Degree,
  EducationDate,
} from '../styles.js';

export function EducationSection({ education }) {
  if (!education?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Education</StyledSectionTitle>
      {education.map((edu, index) => (
        <EducationItem key={index}>
          <Institution>{edu.institution}</Institution>
          <Degree>
            {edu.studyType} in {edu.area}
            {edu.score && ` - ${edu.score}`}
          </Degree>
          {(edu.startDate || edu.endDate) && (
            <EducationDate>
              <DateRange startDate={edu.startDate} endDate={edu.endDate} />
            </EducationDate>
          )}
        </EducationItem>
      ))}
    </Section>
  );
}
