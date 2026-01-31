import styled from 'styled-components';
import Section from './Section.jsx';

const AwardItem = styled.div`
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

const Title = styled.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin: 0;
`;

const DateText = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Awarder = styled.div`
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

const Awards = ({ awards }) => {
  if (!awards || awards.length === 0) return null;

  return (
    <Section title="Awards & Honors">
      {awards.map((award, i) => (
        <AwardItem key={i}>
          <Header>
            <Title>{award.title}</Title>
            {award.date && <DateText>{formatDate(award.date)}</DateText>}
          </Header>
          {award.awarder && <Awarder>{award.awarder}</Awarder>}
          {award.summary && <Summary>{award.summary}</Summary>}
        </AwardItem>
      ))}
    </Section>
  );
};

export default Awards;
