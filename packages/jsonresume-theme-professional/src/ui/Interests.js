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

const Interests = ({ interests }) => {
  if (!interests) {
    return null;
  }

  return (
    <div>
      <Section title="Interests">
        {interests.map((w, key) => {
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

export default Interests;
