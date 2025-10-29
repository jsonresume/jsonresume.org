import styled from 'styled-components';
import Section from './Section';

const EducationItem = styled.div`
  margin-bottom: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Degree = styled.h3`
  font-size: 1.0625rem;
  color: #0b1f3a;
  margin: 0;
`;

const DateRange = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Institution = styled.div`
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const Details = styled.div`
  font-size: 0.95rem;
  color: #666;
`;

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric' });
};

const Education = ({ education }) => {
  if (!education || education.length === 0) return null;

  return (
    <Section title="Education">
      {education.map((item, i) => (
        <EducationItem key={i}>
          <Header>
            <Degree>
              {item.studyType} {item.area && `in ${item.area}`}
            </Degree>
            <DateRange>
              {item.startDate && formatDate(item.startDate)}
              {item.endDate && ` - ${formatDate(item.endDate)}`}
            </DateRange>
          </Header>
          <Institution>{item.institution}</Institution>
          {(item.score || item.courses) && (
            <Details>
              {item.score && <div>GPA: {item.score}</div>}
              {item.courses && item.courses.length > 0 && (
                <div>Relevant Coursework: {item.courses.join(', ')}</div>
              )}
            </Details>
          )}
        </EducationItem>
      ))}
    </Section>
  );
};

export default Education;
