import React from 'react';
import { Section, DateRange } from '@resume/core';
import { SectionTitle } from './layout-styles';
import {
  EducationItem,
  Institution,
  Degree,
  EducationDate,
} from './section-styles';

export function EducationSection({ education = [] }) {
  if (!education?.length) return null;

  return (
    <Section>
      <SectionTitle>Education</SectionTitle>
      {education.map((edu, index) => (
        <EducationItem key={index}>
          <Institution>{edu.institution}</Institution>
          <Degree>
            {edu.studyType} in {edu.area}
            {edu.score && ` • ${edu.score}`}
          </Degree>
          <EducationDate>
            <DateRange startDate={edu.startDate} endDate={edu.endDate} />
          </EducationDate>
        </EducationItem>
      ))}
    </Section>
  );
}
