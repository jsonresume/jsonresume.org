import React from 'react';
import { Section } from '@resume/core';
import {
  StyledSectionTitle,
  SkillsGrid,
  SkillCategory,
  SkillName,
  SkillTags,
} from '../Resume.jsx';

export function SkillsSection({ skills }) {
  if (!skills?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Toolkit</StyledSectionTitle>
      <SkillsGrid>
        {skills.map((skill, index) => (
          <SkillCategory key={index}>
            <SkillName>{skill.name}</SkillName>
            {skill.keywords?.length > 0 && (
              <SkillTags>{skill.keywords.join(' • ')}</SkillTags>
            )}
          </SkillCategory>
        ))}
      </SkillsGrid>
    </Section>
  );
}
