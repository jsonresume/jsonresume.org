import React from 'react';
/**
 * SkillGroup
 * Group of skills organized by category
 */
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: var(--resume-space-item);
`;

const Category = styled.h4`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin-bottom: var(--resume-space-tight);
`;

const Skills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Skill = styled.span`
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);

  &:not(:last-child)::after {
    content: '${(props) => props.$separator || '•'}';
    margin-left: 6px;
    color: var(--resume-color-border);
  }
`;

export function SkillGroup({
  category,
  skills = [],
  separator = '•',
  className,
}) {
  return (
    <Container className={className}>
      {category && <Category>{category}</Category>}
      <Skills>
        {skills.map((skill, index) => (
          <Skill key={index} $separator={separator}>
            {typeof skill === 'string' ? skill : skill.name}
          </Skill>
        ))}
      </Skills>
    </Container>
  );
}

export default SkillGroup;
