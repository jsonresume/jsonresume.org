import React from 'react';
import { Section } from '@resume/core';
import { SectionTitle } from './layout-styles.jsx';
import {
  SkillsGrid,
  SkillCategory,
  SkillName,
  SkillTags,
} from './section-styles.jsx';

export function SkillsSection({ skills = [] }) {
  if (!skills?.length) return null;

  return (
    <Section>
      <SectionTitle>Skills</SectionTitle>
      <SkillsGrid>
        {skills.map((skill, index) => (
          <SkillCategory key={index}>
            <SkillName>{skill.name}</SkillName>
            {skill.keywords?.length > 0 && (
              <SkillTags>{skill.keywords.join(', ')}</SkillTags>
            )}
          </SkillCategory>
        ))}
      </SkillsGrid>
    </Section>
  );
}
