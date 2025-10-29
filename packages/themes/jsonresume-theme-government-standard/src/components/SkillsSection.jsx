import React from 'react';
import { Section } from '@resume/core';
import {
  StyledSectionTitle,
  SkillsList,
  SkillName,
  SkillTags,
} from '../styles.js';

export function SkillsSection({ skills }) {
  if (!skills?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Professional Skills</StyledSectionTitle>
      {skills.map((skill, index) => (
        <SkillsList key={index}>
          <SkillName>{skill.name}:</SkillName>{' '}
          {skill.keywords?.length > 0 && (
            <SkillTags>{skill.keywords.join(', ')}</SkillTags>
          )}
        </SkillsList>
      ))}
    </Section>
  );
}
