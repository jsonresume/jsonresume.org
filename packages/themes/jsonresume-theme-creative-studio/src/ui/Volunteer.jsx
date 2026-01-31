import styled from 'styled-components';
import Section from './Section.jsx';
import DateRange from './DateRange.jsx';

const VolunteerItem = styled.div`
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

const Organization = styled.p`
  font-size: 1.1rem;
  color: #ff6363;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  margin-top: 0.75rem;
  color: #555;
`;

const Volunteer = ({ volunteer }) => {
  if (!volunteer || volunteer.length === 0) return null;

  return (
    <Section title="Volunteer">
      {volunteer.map((item, i) => (
        <VolunteerItem key={i}>
          <Position>{item.position}</Position>
          <Organization>{item.organization}</Organization>
          <DateRange startDate={item.startDate} endDate={item.endDate} />
          {item.summary && <Description>{item.summary}</Description>}
        </VolunteerItem>
      ))}
    </Section>
  );
};

export default Volunteer;
