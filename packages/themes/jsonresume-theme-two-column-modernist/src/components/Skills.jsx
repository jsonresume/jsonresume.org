import React from 'react';
import styled from 'styled-components';

const SidebarSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarTitle = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  color: #1f1f1f;
`;

const SkillCategory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SkillName = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0;
  color: #1f1f1f;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillItem = styled.li`
  font-size: 0.8rem;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
`;

export function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <SidebarSection>
      <SidebarTitle>Skills</SidebarTitle>
      {skills.map((skill, i) => (
        <SkillCategory key={i}>
          {skill.name && <SkillName>{skill.name}</SkillName>}
          {skill.keywords && skill.keywords.length > 0 && (
            <SkillList>
              {skill.keywords.map((keyword, j) => (
                <SkillItem key={j}>{keyword}</SkillItem>
              ))}
            </SkillList>
          )}
        </SkillCategory>
      ))}
    </SidebarSection>
  );
}
