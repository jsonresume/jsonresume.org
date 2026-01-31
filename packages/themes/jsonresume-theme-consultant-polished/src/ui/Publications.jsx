import styled from 'styled-components';
import Section from './Section.jsx';

const PublicationItem = styled.div`
  margin-bottom: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Name = styled.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin: 0;
  font-style: italic;
`;

const Date = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Publisher = styled.div`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.25rem;
`;

const Summary = styled.div`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
`;

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const Publications = ({ publications }) => {
  if (!publications || publications.length === 0) return null;

  return (
    <Section title="Publications">
      {publications.map((pub, i) => (
        <PublicationItem key={i}>
          <Header>
            <Name>
              {pub.url ? (
                <a href={pub.url} target="_blank" rel="noopener noreferrer">
                  {pub.name}
                </a>
              ) : (
                pub.name
              )}
            </Name>
            {pub.releaseDate && <Date>{formatDate(pub.releaseDate)}</Date>}
          </Header>
          {pub.publisher && <Publisher>{pub.publisher}</Publisher>}
          {pub.summary && <Summary>{pub.summary}</Summary>}
        </PublicationItem>
      ))}
    </Section>
  );
};

export default Publications;
