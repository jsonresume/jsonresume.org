import styled from 'styled-components';

import Section from './Section';

const SkillName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const SkillList = styled.div`
  font-size: 13px;
  line-height: 16px;
  margin-left: 5px;
`;

const SkillContainer = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: baseline;
`;

const Skills = ({ skills }) => {
  if (!skills) {
    return null;
  }

  return (
    <div>
      <Section title="Skills">
        {skills.map((w, key) => {
          return (
            <div key={key}>
              <SkillContainer>
                <SkillName>{w.name}:</SkillName>
                <SkillList>{w.keywords.join(', ')}</SkillList>
              </SkillContainer>
            </div>
          );
        })}
      </Section>
    </div>
  );
};

export default Skills;
