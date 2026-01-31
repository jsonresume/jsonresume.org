import styled from 'styled-components';
import Section from './Section.jsx';
import Date from './Date';

const PubItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PubName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const Publisher = styled.p`
  color: #ff6363;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const PubDate = styled.p`
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
`;

const Summary = styled.p`
  margin-top: 0.5rem;
  color: #555;
`;

const PubLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: #ff6363;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Publications = ({ publications }) => {
  if (!publications || publications.length === 0) return null;

  return (
    <Section title="Publications">
      {publications.map((pub, i) => (
        <PubItem key={i}>
          <PubName>{pub.name}</PubName>
          {pub.publisher && <Publisher>{pub.publisher}</Publisher>}
          {pub.releaseDate && (
            <PubDate>
              <Date date={pub.releaseDate} />
            </PubDate>
          )}
          {pub.summary && <Summary>{pub.summary}</Summary>}
          {pub.url && (
            <PubLink href={pub.url} target="_blank" rel="noopener noreferrer">
              Read Publication →
            </PubLink>
          )}
        </PubItem>
      ))}
    </Section>
  );
};

export default Publications;
