import React from 'react';
import styled from 'styled-components';

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

const SkillCategory = styled.div`
  padding: 12px;
  background: #f9f9e8;
  border: 1px solid #333333;
`;

const SkillName = styled.h4`
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin: 0 0 6px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SkillTags = styled.div`
  font-size: 13px;
  color: #555555;
  line-height: 1.6;
  font-family: 'Courier Prime', monospace;
`;

export function Skills({ skills = [] }) {
  if (!skills?.length) return null;

  return (
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
  );
}
