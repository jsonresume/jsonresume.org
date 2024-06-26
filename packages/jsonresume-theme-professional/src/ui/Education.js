import Section from './Section';
import Experience from './Experience';

const Education = ({ education }) => {
  if (!education) {
    return null;
  }

  return (
    <div>
      <Section title="Education">
        {education.map((e, key) => {
          let subTitle = e.area ? `${e.studyType} in ${e.area}` : e.studyType;

          if (e.score) {
            subTitle = `${subTitle} (${e.score})`;
          }

          return (
            <Experience
              title={e.institution}
              subTitle={subTitle}
              startDate={e.startDate}
              endDate={e.endDate}
              highlights={e.courses}
              key={key}
            />
          );
        })}
      </Section>
    </div>
  );
};

export default Education;
