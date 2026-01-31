import styled from 'styled-components';
import Section from './Section.jsx';
import DateRange from './DateRange.jsx';

const EducationItem = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Degree = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const Institution = styled.p`
  font-size: 1.1rem;
  color: #ff6363;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Area = styled.p`
  color: #666;
  margin-top: 0.25rem;
`;

const Courses = styled.ul`
  margin-top: 0.75rem;
  padding-left: 1.5rem;
  list-style: disc;

  li {
    color: #555;
    margin-bottom: 0.5rem;
  }
`;

const Education = ({ education }) => {
  if (!education || education.length === 0) return null;

  return (
    <Section title="Education">
      {education.map((item, i) => (
        <EducationItem key={i}>
          <Degree>
            {item.studyType} {item.area && `in ${item.area}`}
          </Degree>
          <Institution>{item.institution}</Institution>
          <DateRange startDate={item.startDate} endDate={item.endDate} />
          {item.score && <Area>GPA: {item.score}</Area>}
          {item.courses && item.courses.length > 0 && (
            <Courses>
              {item.courses.map((course, j) => (
                <li key={j}>{course}</li>
              ))}
            </Courses>
          )}
        </EducationItem>
      ))}
    </Section>
  );
};

export default Education;
