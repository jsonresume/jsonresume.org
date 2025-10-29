import styled from 'styled-components';
import Section from './Section';
import Date from './Date';

const AwardItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AwardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const Awarder = styled.p`
  color: #ff6363;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const AwardDate = styled.p`
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
`;

const Summary = styled.p`
  margin-top: 0.5rem;
  color: #555;
`;

const Awards = ({ awards }) => {
  if (!awards || awards.length === 0) return null;

  return (
    <Section title="Awards">
      {awards.map((award, i) => (
        <AwardItem key={i}>
          <AwardTitle>{award.title}</AwardTitle>
          {award.awarder && <Awarder>{award.awarder}</Awarder>}
          {award.date && (
            <AwardDate>
              <Date date={award.date} />
            </AwardDate>
          )}
          {award.summary && <Summary>{award.summary}</Summary>}
        </AwardItem>
      ))}
    </Section>
  );
};

export default Awards;
