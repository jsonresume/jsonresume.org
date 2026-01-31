import Section from './Section.jsx';
import Experience from './Experience.jsx';

const Volunteer = ({ volunteer }) => {
  if (!volunteer) {
    return null;
  }

  return (
    <div>
      <Section title="Volunteer">
        {volunteer.map((w, key) => {
          return (
            <Experience
              title={w.position}
              subTitle={w.organization}
              startDate={w.startDate}
              endDate={w.endDate}
              summary={w.summary}
              highlights={w.highlights}
              key={key}
            />
          );
        })}
      </Section>
    </div>
  );
};

export default Volunteer;
