import styled from 'styled-components';
import Section from './Section';

const LanguageList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const LanguageItem = styled.div`
  background: #ffe8e8;
  padding: 15px;
  border-radius: 8px;
`;

const LanguageName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const Fluency = styled.p`
  color: #ff6363;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Languages = ({ languages }) => {
  if (!languages || languages.length === 0) return null;

  return (
    <Section title="Languages">
      <LanguageList>
        {languages.map((lang, i) => (
          <LanguageItem key={i}>
            <LanguageName>{lang.language}</LanguageName>
            {lang.fluency && <Fluency>{lang.fluency}</Fluency>}
          </LanguageItem>
        ))}
      </LanguageList>
    </Section>
  );
};

export default Languages;
