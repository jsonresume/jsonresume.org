import styled from 'styled-components';
import Section from './Section.jsx';

const InterestList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const InterestItem = styled.div`
  background: #ffe8e8;
  padding: 15px 20px;
  border-radius: 20px;
`;

const InterestName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Keywords = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Keyword = styled.span`
  background: #fff;
  color: #ff6363;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
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
              <Keywords>
                {interest.keywords.map((keyword, j) => (
                  <Keyword key={j}>{keyword}</Keyword>
                ))}
              </Keywords>
            )}
          </InterestItem>
        ))}
      </InterestList>
    </Section>
  );
};

export default Interests;
