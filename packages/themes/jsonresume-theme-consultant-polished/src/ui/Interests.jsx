import styled from 'styled-components';
import Section from './Section.jsx';

const InterestList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InterestItem = styled.div`
  margin-bottom: 0.75rem;
`;

const InterestName = styled.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin-bottom: 0.25rem;
`;

const Keywords = styled.div`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
`;

const Interests = ({ interests }) => {
  if (!interests || interests.length === 0) return null;

  return (
    <Section title="Interests">
      <InterestList>
        {interests.map((interest, i) => (
          <InterestItem key={i}>
            <InterestName>{interest.name}</InterestName>
            {interest.keywords && interest.keywords.length > 0 && (
              <Keywords>{interest.keywords.join(', ')}</Keywords>
            )}
          </InterestItem>
        ))}
      </InterestList>
    </Section>
  );
};

export default Interests;
