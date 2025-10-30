import React from 'react';
/**
 * SkillCategory
 * Categorized skills with hierarchical display
 */
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: var(--resume-space-item);
`;

const CategoryTitle = styled.h4`
  font-size: var(--resume-size-subheading);
  font-weight: var(--resume-weight-semibold);
  color: var(--resume-color-primary);
  margin-bottom: var(--resume-space-tight);
  border-bottom: 1px solid var(--resume-color-border);
  padding-bottom: 4px;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: var(--resume-size-body);
  color: var(--resume-color-secondary);
`;

const SkillName = styled.span`
  flex: 1;
`;

const SkillLevel = styled.span`
  font-size: var(--resume-size-small);
  color: var(--resume-color-accent);
  font-weight: var(--resume-weight-medium);
`;

export function SkillCategory({
  category,
  skills = [],
  showLevel = false,
  className,
}) {
  return (
    <Container className={className}>
      {category && <CategoryTitle>{category}</CategoryTitle>}
      <SkillList>
        {skills.map((skill, index) => (
          <SkillItem key={index}>
            <SkillName>
              {typeof skill === 'string' ? skill : skill.name}
            </SkillName>
            {showLevel && typeof skill === 'object' && skill.level && (
              <SkillLevel>{skill.level}</SkillLevel>
            )}
          </SkillItem>
        ))}
      </SkillList>
    </Container>
  );
}

export default SkillCategory;
