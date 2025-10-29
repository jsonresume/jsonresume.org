import styled from 'styled-components';
import Section from './Section';
import DateRange from './DateRange';

const WorkItem = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Position = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const Company = styled.p`
  font-size: 1.1rem;
  color: #ff6363;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  margin-top: 0.75rem;
  color: #555;
`;

const Highlights = styled.ul`
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  list-style: disc;

  li {
    color: #555;
    margin-bottom: 0.5rem;
  }
`;

const Work = ({ work }) => {
  if (!work || work.length === 0) return null;

  return (
    <Section title="Experience">
      {work.map((item, i) => (
        <WorkItem key={i}>
          <Position>{item.position}</Position>
          <Company>{item.name}</Company>
          <DateRange startDate={item.startDate} endDate={item.endDate} />
          {item.summary && <Description>{item.summary}</Description>}
          {item.highlights && item.highlights.length > 0 && (
            <Highlights>
              {item.highlights.map((highlight, j) => (
                <li key={j}>{highlight}</li>
              ))}
            </Highlights>
          )}
        </WorkItem>
      ))}
    </Section>
  );
};

export default Work;
