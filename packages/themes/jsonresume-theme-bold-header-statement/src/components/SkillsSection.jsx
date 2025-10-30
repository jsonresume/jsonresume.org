import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle } from '@resume/core';

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

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
`;

const SkillCategory = styled.div`
  padding: 24px;
  background: white;
  border-radius: 8px;
  border: 2px solid #0f766e;
  transition: transform 0.2s;
`;

const SkillName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #0f766e;
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const SkillTags = styled.div`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  font-weight: 300;
`;

export function SkillsSection({ skills }) {
  if (!skills?.length) return null;

  return (
    <Section>
      <StyledSectionTitle>Skills</StyledSectionTitle>
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
