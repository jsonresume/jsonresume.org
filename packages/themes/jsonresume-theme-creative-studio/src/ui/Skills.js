import styled from 'styled-components';
import Section from './Section';

const SkillCategory = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkillName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillItem = styled.span`
  background: #ffe8e8;
  color: #ff6363;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const Skills = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <Section title="Skills">
      {skills.map((skill, i) => (
        <SkillCategory key={i}>
          <SkillName>{skill.name}</SkillName>
          {skill.keywords && skill.keywords.length > 0 && (
            <SkillList>
              {skill.keywords.map((keyword, j) => (
                <SkillItem key={j}>{keyword}</SkillItem>
              ))}
            </SkillList>
          )}
        </SkillCategory>
      ))}
    </Section>
  );
};

export default Skills;
