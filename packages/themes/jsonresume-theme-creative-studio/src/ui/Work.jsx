import styled from 'styled-components';
import Section from './Section.jsx';
import DateRange from './DateRange.jsx';

import { InlineMarkdown } from '@jsonresume/core';
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
          {item.summary && (
            <InlineMarkdown as={Description} text={item.summary} />
          )}
          {item.highlights && item.highlights.length > 0 && (
            <Highlights>
              {item.highlights.map((highlight, j) => (
                <InlineMarkdown as="li" key={j} text={highlight} />
              ))}
            </Highlights>
          )}
        </WorkItem>
      ))}
    </Section>
  );
};

export default Work;
