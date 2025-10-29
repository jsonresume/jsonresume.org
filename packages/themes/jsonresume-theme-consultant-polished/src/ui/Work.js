import styled from 'styled-components';
import Section from './Section';
import { marked } from 'marked';

const WorkItem = styled.div`
  margin-bottom: 2rem;
`;

const WorkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Position = styled.h3`
  font-size: 1.125rem;
  color: #0b1f3a;
  margin: 0;
`;

const DateRange = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
`;

const Company = styled.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.75rem;
`;

const Description = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 0.5rem;

  p {
    margin-bottom: 0.5rem;
  }
`;

const Highlights = styled.ul`
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  list-style: disc;

  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
    color: #444;
  }
`;

const formatDate = (date) => {
  if (!date) return 'Present';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const Work = ({ work }) => {
  if (!work || work.length === 0) return null;

  return (
    <Section title="Experience">
      {work.map((item, i) => (
        <WorkItem key={i}>
          <WorkHeader>
            <Position>{item.position}</Position>
            <DateRange>
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </DateRange>
          </WorkHeader>
          <Company>
            {item.name}
            {item.location && ` • ${item.location}`}
          </Company>
          {item.summary && (
            <Description
              dangerouslySetInnerHTML={{ __html: marked(item.summary) }}
            />
          )}
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
