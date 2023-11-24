import styled from 'styled-components';
import SubTitle from './SubTitle';
import List from './List';
import DateRange from './DateRange';

const Company = styled.div`
  font-size: 16px;
  font-weight: 500;
  display: flex;
`;

const CompanyPosition = styled.div`
  font-weight: 600;
`;

const CompanyName = styled.div`
  color: #444;
`;

const Work = ({ work }) => {
  if (!work) {
    return null;
  }

  return (
    <div>
      <SubTitle>Professional Experience</SubTitle>
      {work.slice(0, 1).map((w) => {
        return (
          <div>
            <Company>
              <CompanyPosition>{w.position}</CompanyPosition>
              &nbsp;-&nbsp;
              <CompanyName>{w.name}</CompanyName>
            </Company>
            <DateRange startDate={w.startDate} endDate={w.endDate} />
            <p>{w.summary}</p>
            <List items={w.highlights} />
          </div>
        );
      })}
    </div>
  );
};

export default Work;
