import styled from 'styled-components';
import Section from './Section';

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const SkillCategory = styled.div`
  margin-bottom: 1rem;
`;

const CategoryName = styled.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin-bottom: 0.5rem;
`;

const KeywordList = styled.div`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
`;

const Skills = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <Section title="Skills">
      <SkillsGrid>
        {skills.map((skill, i) => (
          <SkillCategory key={i}>
            <CategoryName>{skill.name}</CategoryName>
            {skill.keywords && skill.keywords.length > 0 && (
              <KeywordList>{skill.keywords.join(' • ')}</KeywordList>
            )}
          </SkillCategory>
        ))}
      </SkillsGrid>
    </Section>
  );
};

export default Skills;
