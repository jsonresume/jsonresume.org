import styled from 'styled-components';
import Section from './Section';

const LanguageList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const LanguageItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const LanguageName = styled.span`
  font-size: 1rem;
  color: #333;
`;

const Fluency = styled.span`
  font-size: 0.9rem;
  color: #666;
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
