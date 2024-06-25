import styled from 'styled-components';
import List from './List';
import DateRange from './DateRange';
import Section from './Section';

const Company = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CompanyPosition = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const CompanyName = styled.div`
  font-style: italic;
  font-size: 13px;
`;

const WorkContainer = styled.div`
  margin-bottom: 10px;
`;

const Summary = styled.div`
  font-size: 13px;
  line-height: 16px;
`;

const Work = ({ work }) => {
  if (!work) {
    return null;
  }

  return (
    <div>
      <Section title="Experience">
        {work.map((w, key) => {
          return (
            <WorkContainer key={key}>
              <Company>
                <CompanyPosition>{w.position}</CompanyPosition>
                <DateRange startDate={w.startDate} endDate={w.endDate} />
              </Company>
              <CompanyName>{w.name}</CompanyName>
              <Summary>{w.summary}</Summary>
              <List items={w.highlights} />
            </WorkContainer>
          );
        })}
      </Section>
    </div>
  );
};

export default Work;
